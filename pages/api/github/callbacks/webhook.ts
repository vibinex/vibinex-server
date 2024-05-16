import { NextApiRequest, NextApiResponse } from 'next';
import { publishMessage } from '../../../../utils/pubsub/pubsubClient';
import { getTopicNameFromDB } from '../../../../utils/db/relevance';
import { getRepoConfig } from '../../../../utils/db/repos';
import rudderStackEvents from '../../events';

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		const eventProperties = { response_status: 405 };
		rudderStackEvents.track("absent", "", 'github-webhook', { type: 'api-call-method', eventStatusFlag: 0, eventProperties });
		res.status(405).json({ error: 'Method Not Allowed' });
		return;
	}

	const jsonBody = req.body;
	const { owner: { login: owner }, name } = jsonBody.repository;
	const provider = "github";
	const event_type = req.headers['x-github-event'];
	console.log("[webhookHandler] Received github event ", event_type);

	const event_properties = {
		repo_name: name,
		repo_owner: owner,
		repo_provider: provider,
		event_type: event_type
	};

	// Verify the event type
	if (event_type !== "pull_request" && event_type !== "pull_request_review") {
		const eventProperties = { ...event_properties, response_status: 400 };
		rudderStackEvents.track("absent", "", 'github-webhook', { type: 'event-type', eventStatusFlag: 0, eventProperties });
		res.status(400).json({ error: 'Invalid event header' });
		return;
	}
	const topicName: string[] | null = await getTopicNameFromDB(provider, owner, name).catch((error) => {
		console.error('[webhookHandler] Failed to get topic name from db:', error);
		rudderStackEvents.track("absent", "", 'github-webhook', { type: 'get-topic-from-db', eventStatusFlag: 0, event_properties });
		return null;
	});
	if (!topicName) {
		console.error('Topic name not found in db');
		const eventProperties = { ...event_properties, response_status: 400 };
		rudderStackEvents.track("absent", "", 'github-webhook', { type: 'get-topic-from-db', eventStatusFlag: 0, eventProperties });
		res.status(400).json({ error: 'Bad Request' });
		return;
	}
	
	console.info("[webookHandler] Received github webhook event for ", name);
	const repoConfig = await getRepoConfig({
		repo_provider: provider,
		repo_owner: owner,
		repo_name: name
	}).catch((error) => {
		console.error('[webookHandler] Failed to get repoConfig from db :', error);
		rudderStackEvents.track("absent", "", 'github-webhook', { type: 'get-repo-config', eventStatusFlag: 0, event_properties });
		return null;
	});
	if (!repoConfig) {
		const eventProperties = { ...event_properties, response_status: 400 };
		rudderStackEvents.track("absent", "", 'github-webhook', { type: 'get-repo-config', eventStatusFlag: 0, eventProperties });
		res.status(400).json({ error: 'Unable to get repoConfig from db' });
		return;
	}
	let failedCount = 0;

	// Publish message to Pub/Sub for each install_id (topic name)
	for (const installId of topicName) {
		const data = {
			repositoryProvider: 'github',
			eventPayload: jsonBody,
			repoConfig: repoConfig,
			eventType: event_type
		};

		const msgType = 'webhook_callback';

		console.debug(`[webookHandler] data = ${JSON.stringify(jsonBody)}`);
		console.debug(`[webookHandler] installId = ${installId}`);
		console.debug(`[webookHandler] repoConfig = ${JSON.stringify(repoConfig)}`);

		const result: string | null = await publishMessage(installId, data, msgType)
		.catch((error) => {
			const eventProperties = { ...event_properties, topic_name: installId };
			rudderStackEvents.track("absent", "", 'github-webhook', { type: 'publish-webhook-message', eventStatusFlag: 0, eventProperties });	
			console.error('[webookHandler] Failed to publish message:', error);
			failedCount++;
			return null;
		});

		if (result === null) continue;

		const eventProperties = { ...event_properties, topic_name: installId };
		rudderStackEvents.track("absent", "", 'github-webhook', { type: 'publish-webhook-message', eventStatusFlag: 1, eventProperties });
		console.info("[webookHandler] Sent message to pubsub for ", installId, result);
	}

	// Determine the response status code based on the number of failures
	if (failedCount > 0) {
		const eventProperties = { ...event_properties, response_status: 500, failed_count: failedCount};
		rudderStackEvents.track("absent", "", 'github-webhook', { type: 'publish-webhook-message-for-all-topic', eventStatusFlag: 0, eventProperties });
		res.status(500).json({ error: `Failed to publish ${failedCount} messages to Pub/Sub` });
	} else {
		const eventProperties = { ...event_properties, response_status: 200, failed_count: failedCount };
		rudderStackEvents.track("absent", "", 'github-webhook', { type: 'publish-webhook-message-for-all-topic', eventStatusFlag: 1, eventProperties });
		res.status(200).send("Success");
	}
}

export default webhookHandler;
