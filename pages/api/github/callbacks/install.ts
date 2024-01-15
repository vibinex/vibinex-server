import { NextApiRequest, NextApiResponse } from 'next';
import { publishMessage } from '../../../../utils/pubsub/pubsubClient';
import constructHtml from '../../../../utils/serverSideHTML';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { getAuthUserId } from '../../../../utils/auth';
import { getUserById, type DbUser } from '../../../../utils/db/users';

const installHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getServerSession(req, res, authOptions).catch((err) => {
		console.error('[github/installHandler] Failed to get session', err);
		return null;
	});
	if (!session) {
		res.status(500).send(constructHtml("Internal Server Error", "error")); // TODO: user is not logged in - redirect to login page with the correct callback URL
		return;
	}
	const userId = getAuthUserId(session);
	const userData: DbUser = await getUserById(userId);
	if (!userData) {
		console.error(`[github/installHandler] cannot get user data`);
		res.status(500).send(constructHtml("Internal Server Error", "error"));
		return;
	}
	if (!userData.topic_name) {
		console.error(`[github/installHandler] user topic name not set`);
		res.status(400).send(constructHtml("Set up your DPU first", "error")); // TODO: alternatively, we can create the topic name here itself
		return;
	}
	const topicName = userData.topic_name;
	console.log('[github/installHandler] topicName', topicName);
	if (!topicName) {
		console.error('[github/installHandler] TOPIC_NAME not set');
		res.status(500).send(constructHtml("Internal Server Error", "error"));
		return;
	}
	if (!req.query.installation_id) {
		console.error('[github/installHandler] Installation code not provided');
		res.status(400).send(constructHtml("Bad Request: GitHub did not send a valid installation ID", "error"));
		return;
	}
	const data = {
		'repository_provider': 'github',
		'installation_code': req.query.installation_id,
	};
	const msgType = 'install_callback';
	console.info("[github/installHandler] Recieved installation code for github, published to ", topicName);
	res.write(constructHtml("Starting installation...<br><small>This may take some time. Please be patient.</small>"));
	const result: string | null = await publishMessage(topicName, data, msgType)
		.catch((error) => {
			console.error(`[github/installHandler] Error publishing message for the topic: ${topicName}`, error);
			return null;
		});
	if (result == null) {
		res.status(500).send(constructHtml("Internal Server Error", "error"));
		return;
	}

	res.write(
		`<script>
			location.href="/docs"
		</script>\
		If you are not automatically redirected, <a href="/docs">click here</a>`
	);
	res.end();
}

export default installHandler;