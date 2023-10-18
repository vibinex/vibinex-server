import { NextApiRequest, NextApiResponse } from 'next';
import { publishMessage } from '../../../../utils/pubsub/pubsubClient';
import constructHtml from '../../../../utils/serverSideHTML';

const installHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const topicName = process.env.TOPIC_NAME;
	if (topicName) {
		const data = {
			'repository_provider': 'bitbucket',
			'installation_code': req.query.code
		};
		const msgType = 'install_callback';
		console.info("Recieved installation code for bitbucket, published to ", topicName);
		try {
			res.write(constructHtml("Starting installation...<br><small>This may take some time. Please be patient.</small>"));
			await publishMessage(topicName, data, msgType);
		} catch (error) {
			console.error('Error publishing message:', error);
			res.status(500).send(constructHtml("ERROR: Failed to publish message. Data must be in the form of a Buffer.", "error"));
		}
	} else {
		console.error('TOPIC_NAME not set');
		res.status(500).send(constructHtml("ERROR: Failed to publish message.", "error"));
	}
	res.write(
		`<script>
			location.href="/u"
		</script>\
		If you are not automatically redirected, <a href="/u">click here</a>`
	);
	res.end();
}

export default installHandler;