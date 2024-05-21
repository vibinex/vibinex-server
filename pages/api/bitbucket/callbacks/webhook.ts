import { NextApiRequest, NextApiResponse } from 'next';
import { publishMessage } from '../../../../utils/pubsub/pubsubClient';
import { getTopicNameFromDB } from '../../../../utils/db/relevance';
import { getRepoConfig } from '../../../../utils/db/repos';
import rudderStackEvents from '../../events';

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		const eventProperties = { response_status: 405 };
		rudderStackEvents.track("absent", "", 'bitbucket-webhook', { type: 'api-call-method', eventStatusFlag: 0, eventProperties });
		res.status(405).json({ error: 'Method Not Allowed' });
		return;
	}

	const jsonBody = req.body;
	const eventHeader = req.headers['x-event-key'];
	const owner = jsonBody.repository.owner.username; 
	const provider = "bitbucket";
	const repo_name = jsonBody.repository.name;

	const event_properties = {
		repo_name: repo_name,
		repo_owner: owner,
		event_type: eventHeader,
		repo_provider: provider
	};

	// Verify the event type
	if (eventHeader !== 'pullrequest:approved' && eventHeader !== 'pullrequest:created' && eventHeader !== 'pullrequest:updated') {
		const eventProperties = { ...event_properties, response_status: 400 };
		rudderStackEvents.track("absent", "", 'bitbucket-webhook', { type: 'invalid-event-header', eventStatusFlag: 0, eventProperties });
		res.status(400).json({ error: 'Invalid event header' });
		return;
	}
	console.info("[webookHandler] Received bitbucket webhook event for ", repo_name);
	const topicName: string[] | null = await getTopicNameFromDB(provider, owner, repo_name).catch((error) => {
		console.error('[webhookHandler] Failed to get topic name from db:', error);
		return null;
	});
	if (!topicName) {
		const eventProperties = { ...event_properties, response_status: 500 };
		rudderStackEvents.track("absent", "", 'bitbucket-webhook', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties });
		res.status(500).json({ error: 'Unable to get topic name from db' });
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
		const eventProperties = { ...event_properties, response_status: 500 };
		rudderStackEvents.track("absent", "", 'bitbucket-webhook', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties });
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
			const eventProperties = { ...event_properties, topic_name: installId };
			rudderStackEvents.track("absent", "", 'bitbucket-webhook', { type: 'publish-webhook-message', eventStatusFlag: 0, eventProperties });	
			console.error('[webookHandler] Failed to publish message:', error);
			failedCount++;
			return null;
		});

		if (result === null) continue;

		const eventProperties = { ...event_properties, topic_name: installId };
		rudderStackEvents.track("absent", "", 'bitbucket-webhook', { type: 'publish-webhook-message', eventStatusFlag: 1, eventProperties });
		console.info("[webookHandler] Sent message to pubsub for ", installId, result);
	}

	// Determine the response status code based on the number of failures
	if (failedCount > 0) {
		const eventProperties = { ...event_properties, response_status: 500, failed_count: failedCount};
		rudderStackEvents.track("absent", "", 'bitbucket-webhook', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties });
		res.status(500).json({ error: `Failed to publish ${failedCount} messages to Pub/Sub` });
	} else {
		const eventProperties = { ...event_properties, response_status: 200, failed_count: failedCount };
		rudderStackEvents.track("absent", "", 'bitbucket-webhook', { type: 'HTTP-200', eventStatusFlag: 1, eventProperties });
		res.status(200).send("Success");
	}
}

export default webhookHandler;
