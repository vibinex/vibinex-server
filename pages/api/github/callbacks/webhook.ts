import { NextApiRequest, NextApiResponse } from 'next';
import { publishMessage } from '../../../../utils/pubsub/pubsubClient';
import { getTopicNameFromDB } from '../../../../utils/db/relevance';
import { getRepoConfig } from '../../../../utils/db/repos';

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const jsonBody = req.body;
	const { owner: { username: owner }, name } = jsonBody.repository;
	const provider = "github";
	
	console.info("[webookHandler] Received github webhook event for ", name);
	const topicName: string | null = await getTopicNameFromDB(owner, name, provider).catch((error) => {
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
		repo_name: name
	}).catch((error) => {
		console.error('[webookHandler] Failed to get repoConfig from db :', error);
		return null;
	});
	if (!repoConfig) {
		res.status(500).json({ error: 'Unable to get repoConfig from db' });
		return;
	}
	const data = {
		repositoryProvider: 'github',
		eventPayload: jsonBody,
		repoConfig: repoConfig
	};
	
	const msgType = 'webhook_callback';
	const topicName_str = topicName;
	
	console.debug(`[webookHandler] data = ${JSON.stringify(jsonBody)}`)
	console.debug(`[webookHandler] topicname = ${topicName}`)
	console.debug(`[webookHandler] repoConfig = ${JSON.stringify(repoConfig)}`)
	
	const result: string | null = await publishMessage(topicName_str, data, msgType)
	.catch((error) => {
		console.error('[webookHandler] Failed to get repoConfig from db :', error);
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
