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
	const { owner: { username: owner }, name } = jsonBody.repository;
	const provider = "github";
	const event_type = req.headers['X-GitHub-Event'];
	console.log("[webhookHandler] Received github event ", event_type);

	// Verify the event type
	if (typeof event_type === 'string' && !["pull_request", "pull_request_review"].includes(event_type)) {
		res.status(400).json({ error: 'Invalid event header' });
		return;
	}
		
	console.info("[webookHandler] Received github webhook event for ", name);
	const topicName: string | null = await getTopicNameFromDB(owner, name, provider).catch((error) => {
		console.error('[webhookHandler] Failed to get topic name from db:', error);
		return null;
	});
	if (!topicName) {
		console.error('Topic name not found in db');
		res.status(400).json({ error: 'Bad Request' });
		return;
	}
	const repoConfig = await getRepoConfig({
		repo_provider: provider,
		repo_owner: owner,
		repo_name: name
	}).catch((error) => {
		console.error('[webookHandler] Failed to get repoConfig from db :', error);
		return null;
	});
	if (!repoConfig) {
		res.status(400).json({ error: 'Unable to get repoConfig from db' });
		return;
	}
	const data = {
		repositoryProvider: 'github',
		eventPayload: jsonBody,
		repoConfig: repoConfig,
		eventType: event_type
	};
	
	const msgType = 'webhook_callback';
	const topicName_str = topicName;
	
	console.debug(`[webookHandler] data = ${JSON.stringify(jsonBody)}`)
	console.debug(`[webookHandler] topicname = ${topicName}`)
	console.debug(`[webookHandler] repoConfig = ${JSON.stringify(repoConfig)}`)
	
	const result: string | null = await publishMessage(topicName_str, data, msgType)
	.catch((error) => {
		console.error('[webookHandler] Failed to publish message:', error);
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
