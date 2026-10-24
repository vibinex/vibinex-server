import { NextApiRequest, NextApiResponse } from 'next';
import { publishMessage } from '../../../../utils/pubsub/pubsubClient';
import { getTopicNameFromDB } from '../../../../utils/db/relevance';
import { getRepoConfig } from '../../../../utils/db/repos';
import { verifyGithubWebhookSignature } from '../../../../utils/githubWebhookAuth';
import rudderStackEvents from '../../events';

export const config = {
	api: {
		bodyParser: false,
	},
};

const MAX_WEBHOOK_BODY_BYTES = 25 * 1024 * 1024;

class WebhookBodyTooLargeError extends Error {}

const readRawBody = async (req: NextApiRequest): Promise<Buffer> => {
	const chunks: Buffer[] = [];
	let totalBytes = 0;
	for await (const chunk of req) {
		const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		totalBytes += buffer.length;
		if (totalBytes > MAX_WEBHOOK_BODY_BYTES) {
			throw new WebhookBodyTooLargeError('Webhook body exceeds the maximum allowed size');
		}
		chunks.push(buffer);
	}
	return Buffer.concat(chunks);
};

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		const eventProperties = { response_status: 405 };
		rudderStackEvents.track('absent', '', 'github-webhook', { type: 'HTTP-405', eventStatusFlag: 0, eventProperties });
		res.setHeader('Allow', 'POST');
		return res.status(405).json({ error: 'Method Not Allowed' });
	}

	if (!process.env.GITHUB_WEBHOOK_SECRET) {
		console.error('[webhookHandler] GITHUB_WEBHOOK_SECRET is not configured');
		return res.status(500).json({ error: 'Webhook authentication is not configured' });
	}

	let rawBody: Buffer;
	try {
		rawBody = await readRawBody(req);
	} catch (error) {
		if (error instanceof WebhookBodyTooLargeError) {
			return res.status(413).json({ error: 'Payload Too Large' });
		}
		console.error('[webhookHandler] Failed to read request body', error);
		return res.status(400).json({ error: 'Bad Request' });
	}

	const signature = req.headers['x-hub-signature-256'];
	if (!verifyGithubWebhookSignature(rawBody, signature)) {
		console.warn('[webhookHandler] Rejected webhook with an invalid signature');
		return res.status(401).json({ error: 'Invalid webhook signature' });
	}

	let jsonBody: any;
	try {
		jsonBody = JSON.parse(rawBody.toString('utf8'));
	} catch {
		return res.status(400).json({ error: 'Invalid JSON payload' });
	}

	const owner = jsonBody?.repository?.owner?.login;
	const name = jsonBody?.repository?.name;
	if (typeof owner !== 'string' || typeof name !== 'string') {
		return res.status(400).json({ error: 'Invalid repository payload' });
	}

	const provider = 'github';
	const eventHeader = req.headers['x-github-event'];
	const event_type = Array.isArray(eventHeader) ? eventHeader[0] : eventHeader;
	const event_properties = {
		repo_name: name,
		repo_owner: owner,
		repo_provider: provider,
		event_type,
	};

	if (event_type !== 'pull_request' && event_type !== 'pull_request_review') {
		const eventProperties = { ...event_properties, response_status: 400 };
		rudderStackEvents.track('absent', '', 'github-webhook', { type: 'HTTP-400', eventStatusFlag: 0, eventProperties });
		return res.status(400).json({ error: 'Invalid event header' });
	}

	const topicName: string[] | null = await getTopicNameFromDB(provider, owner, name).catch((error) => {
		console.error('[webhookHandler] Failed to get topic name from db', error);
		return null;
	});
	if (!topicName) {
		const eventProperties = { ...event_properties, response_status: 400 };
		rudderStackEvents.track('absent', '', 'github-webhook', { type: 'HTTP-400', eventStatusFlag: 0, eventProperties });
		return res.status(400).json({ error: 'Bad Request' });
	}

	const repoConfig = await getRepoConfig({
		repo_provider: provider,
		repo_owner: owner,
		repo_name: name,
	}).catch((error) => {
		console.error('[webhookHandler] Failed to get repository configuration', error);
		return null;
	});
	if (!repoConfig) {
		const eventProperties = { ...event_properties, response_status: 400 };
		rudderStackEvents.track('absent', '', 'github-webhook', { type: 'HTTP-400', eventStatusFlag: 0, eventProperties });
		return res.status(400).json({ error: 'Unable to get repository configuration' });
	}

	let failedCount = 0;
	for (const installId of topicName) {
		const result = await publishMessage(installId, {
			repositoryProvider: 'github',
			eventPayload: jsonBody,
			repoConfig,
			eventType: event_type,
		}, 'webhook_callback').catch((error: Error) => {
			const eventProperties = { ...event_properties, topic_name: installId };
			rudderStackEvents.track('absent', '', 'github-webhook', { type: 'publish-webhook-message', eventStatusFlag: 0, eventProperties });
			console.error('[webhookHandler] Failed to publish message', error);
			failedCount++;
			return null;
		});

		if (result !== null) {
			const eventProperties = { ...event_properties, topic_name: installId };
			rudderStackEvents.track('absent', '', 'github-webhook', { type: 'publish-webhook-message', eventStatusFlag: 1, eventProperties });
		}
	}

	if (failedCount > 0) {
		const eventProperties = { ...event_properties, response_status: 500, failed_count: failedCount };
		rudderStackEvents.track('absent', '', 'github-webhook', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties });
		return res.status(500).json({ error: `Failed to publish ${failedCount} messages to Pub/Sub` });
	}

	const eventProperties = { ...event_properties, response_status: 200, failed_count: 0 };
	rudderStackEvents.track('absent', '', 'github-webhook', { type: 'HTTP-200', eventStatusFlag: 1, eventProperties });
	return res.status(200).send('Success');
};

export default webhookHandler;
