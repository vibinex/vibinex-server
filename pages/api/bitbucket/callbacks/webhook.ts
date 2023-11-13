import { NextApiRequest, NextApiResponse } from 'next';
import { publishMessage } from '../../../../utils/pubsub/pubsubClient';
import { getTopicNameFromDB } from '../../../../utils/db/relevance';
import { getRepoConfig } from '../../../../utils/db/repos';

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		res.status(405).json({ error: 'Method Not Allowed' });
		return;
	}

	const jsonBody = req.body;
	const eventHeader = req.headers['x-event-key'];
	const owner = jsonBody.repository.owner.username; 
	const provider = "bitbucket";
	const repo_name = jsonBody.repository.name;

	// Verify the event type
	if (typeof eventHeader === 'string' && !['pullrequest:approved', 'pullrequest:created', 'pullrequest:updated'].includes(eventHeader)) {
		res.status(400).json({ error: 'Invalid event header' });
		return;
	}
	console.info("[webookHandler] Received bitbucket webhook event for ", repo_name);
	const topicName: string | null = await getTopicNameFromDB(owner, repo_name, provider).catch((error) => {
		console.error('[webhookHandler] Failed to get topic name from db:', error);
		return null;
	});
	if (!topicName) {
		res.status(500)
			.json({ error: 'Unable to get topic name from db' });
		return;
	}
	const repoConfig = await getRepoConfig({
		repo_provider: provider,
		repo_owner: owner,
		repo_name: repo_name
	}).catch((error) => {
		console.error('[webookHandler] Failed to get repoConfig from db :', error);
		return null;
	});
	if (!repoConfig) {
		res.status(500).json({ error: 'Unable to get repoConfig from db' });
		return;
	}
	const data = {
		repositoryProvider: 'bitbucket',
		eventPayload: jsonBody,
		repoConfig: repoConfig,
		eventType: eventHeader
	};
	const msgType = 'webhook_callback';
	console.debug(`[webookHandler] data = ${JSON.stringify(data)}`)
	console.debug(`[webookHandler] topicname = ${topicName}`)
	console.debug(`[webookHandler] repoConfig = ${JSON.stringify(repoConfig)}`)
	const result: string | null = await publishMessage(topicName, data, msgType)
	.catch((error) => {
		console.error('[webookHandler] Failed to publish message :', error);
		return null;
	});
	if (result == null) {
		res.status(500).json({ error: 'Internal Server Error' });
		return;
	}
	console.info("[webookHandler] Sent message to pubsub for ", topicName, result);
	res.status(200).send("Success");
}

export default webhookHandler;
