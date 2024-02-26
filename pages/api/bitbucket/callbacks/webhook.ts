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
	if (eventHeader !== 'pullrequest:approved' && eventHeader !== 'pullrequest:created' && eventHeader !== 'pullrequest:updated') {
		res.status(400).json({ error: 'Invalid event header' });
		return;
	}
	console.info("[webookHandler] Received bitbucket webhook event for ", repo_name);
	const topicName: string[] | null = await getTopicNameFromDB(owner, repo_name, provider).catch((error) => {
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
	let failedCount = 0;

	// Publish message to Pub/Sub for each install_id (topic name)
	for (const installId of topicName) {
		const data = {
			repositoryProvider: 'bitbucket',
			eventPayload: jsonBody,
			repoConfig: repoConfig,
			eventType: eventHeader
		};

		const msgType = 'webhook_callback';

		console.debug(`[webookHandler] data = ${JSON.stringify(jsonBody)}`);
		console.debug(`[webookHandler] installId = ${installId}`);
		console.debug(`[webookHandler] repoConfig = ${JSON.stringify(repoConfig)}`);

		const result: string | null = await publishMessage(installId, data, msgType)
		.catch((error) => {
			console.error('[webookHandler] Failed to publish message:', error);
			failedCount++;
			return null;
		});

		if (result === null) continue;

		console.info("[webookHandler] Sent message to pubsub for ", installId, result);
	}

	// Determine the response status code based on the number of failures
	if (failedCount > 0) {
		res.status(500).json({ error: `Failed to publish ${failedCount} messages to Pub/Sub` });
	} else {
		res.status(200).send("Success");
	}
}

export default webhookHandler;
