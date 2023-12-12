import { NextApiRequest, NextApiResponse } from 'next';
import { publishMessage } from '../../../../utils/pubsub/pubsubClient';
import constructHtml from '../../../../utils/serverSideHTML';

const installHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const topicName = process.env.TOPIC_NAME;
	if (!topicName) {
		console.error('[bitbucket/installHandler] TOPIC_NAME not set');
		res.status(500).send(constructHtml("Internal Server Error", "error"));
		return;
	}
	if (!req.query.code) {
		console.error(`[bitbucket/installHandler] Installation code not provided for topic: ${topicName}`);
		res.status(400).send(constructHtml("Bad Request: Bitbucket did not send a valid auth code", "error"));
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