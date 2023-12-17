import { NextApiRequest, NextApiResponse } from 'next';
import { publishMessage } from '../../../../utils/pubsub/pubsubClient';
import constructHtml from '../../../../utils/serverSideHTML';

const installHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const topicName = process.env.TOPIC_NAME;
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