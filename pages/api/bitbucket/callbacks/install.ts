import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { getAuthUserId } from '../../../../utils/auth';
import { getUserById, type DbUser } from '../../../../utils/db/users';
import { publishMessage } from '../../../../utils/pubsub/pubsubClient';
import constructHtml from '../../../../utils/serverSideHTML';
import { getURLWithParams } from '../../../../utils/url_utils';
import { authOptions } from '../../auth/[...nextauth]';
import rudderStackEvents from '../../events';

const installHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const event_properties = {
		repo_provider: 'bitbucket',
	};
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		const eventProperties = { ...event_properties, response_status: 500 };
		rudderStackEvents.track("absent", "", 'bitbucket-app-install-callback', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties });
		res.status(500).send(constructHtml(
			`Please <a href="${getURLWithParams('/api/auth/signin', { callbackUrl: req.url })}">sign in</a> on Vibinex`,
			"error"
		));
		return;
	}
	const userId = getAuthUserId(session);
	const userData: DbUser | null = await getUserById(userId).catch((err) => {
		console.error('[github/installHandler] Error in getting user data', err);
		return null;
	});
	if (!userData) {
		console.error(`[github/installHandler] userData is empty`);
		res.status(500).send(constructHtml("User data not found. Please ensure your account is set up correctly.", "error"));
		const eventProperties = { ...event_properties, response_status: 500}
		rudderStackEvents.track(userId, "", 'bitbucket-app-install-callback', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties });
		return;
	}
	if (!userData.topic_name) {
		console.error(`[github/installHandler] user topic name not set.`);
		res.status(400).send(constructHtml("Set up your DPU first", "error")); // TODO: alternatively, we can create the topic name here itself
		const eventProperties = { ...event_properties, response_status: 400}
		rudderStackEvents.track(userId, "", 'bitbucket-app-install-callback', { type: 'HTTP-400', eventStatusFlag: 0, eventProperties });
		return;
	}
	const topicName = userData.topic_name;
	if (!req.query.code) {
		console.error(`[bitbucket/installHandler] Installation code not provided for topic: ${topicName}`);
		res.status(400).send(constructHtml("Bad Request: Bitbucket did not send a valid auth code", "error"));
		const eventProperties = { ...event_properties, topic_name: topicName, response_status: 400}
		rudderStackEvents.track(userId, "", 'bitbucket-app-install-callback', { type: 'HTTP-400', eventStatusFlag: 0, eventProperties });
		return;
	}
	const data = {
		'repository_provider': 'bitbucket',
		'installation_code': req.query.code
	};
	const msgType = 'install_callback';
	console.info("[bitbucket/installHandler] Received installation code for bitbucket, published to ", topicName);
	res.write(constructHtml("Starting installation...<br><small>This may take some time. Please be patient.</small>"));
	const result: string | null = await publishMessage(topicName, data, msgType)
		.catch((error) => {
			console.error(`[bitbucket/installHandler] Error publishing message for the topic: ${topicName}`, error);
			return null;
		});
	if (result == null) {
		res.status(500).send(constructHtml("Internal Server Error", "error"));
		const eventProperties = { ...event_properties, topic_name: topicName, response_status: 500}
		rudderStackEvents.track(userId, "", 'bitbucket-app-install-callback', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties });
		return;
	}

	const eventProperties = { ...event_properties, topic_name: topicName, response_status: 200}
	rudderStackEvents.track(userId, "", 'bitbucket-app-install-callback', { type: 'HTTP-200', eventStatusFlag: 1, eventProperties });
	res.write(
		`<script>
			location.href="/docs"
		</script>\
		If you are not automatically redirected, <a href="/docs">click here</a>`
	);
	res.end();
}

export default installHandler;