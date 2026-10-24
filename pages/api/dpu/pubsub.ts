import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { saveTopicNameInUsersTable, createTopicName } from '../../../utils/db/relevance';
import { createTopicNameInGcloud } from '../../../utils/pubsub/pubsubClient';
import { DbUser, getUserById } from '../../../utils/db/users';
import { authOptions } from '../auth/[...nextauth]';
import rudderStackEvents from '../events';

const pubsubHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		res.setHeader('Allow', 'POST');
		return res.status(405).json({ error: 'Method Not Allowed' });
	}

	const session = await getServerSession(req, res, authOptions);
	if (!session?.user?.id) {
		const eventProperties = { response_status: 401 };
		rudderStackEvents.track('absent', '', 'dpu-pubsub', { type: 'HTTP-401', eventStatusFlag: 0, eventProperties });
		return res.status(401).json({ error: 'Unauthenticated' });
	}

	const userId = session.user.id;
	const userData: DbUser | null = await getUserById(userId).catch((error) => {
		console.error('[pubsubHandler] Unable to get authenticated user', error);
		return null;
	});
	if (!userData) {
		const eventProperties = { response_status: 500 };
		rudderStackEvents.track(userId, '', 'dpu-pubsub', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties });
		return res.status(500).json({ error: 'Internal server error' });
	}

	if (!userData.topic_name) {
		const generatedTopic = await createTopicName(userId);
		if (!generatedTopic) {
			const eventProperties = { response_status: 500 };
			rudderStackEvents.track(userId, '', 'dpu-pubsub', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties });
			return res.status(500).json({ error: 'Internal server error' });
		}
		const gcloudTopic = await createTopicNameInGcloud(generatedTopic);
		if (!gcloudTopic) {
			const eventProperties = { response_status: 500 };
			rudderStackEvents.track(userId, '', 'dpu-pubsub', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties });
			return res.status(500).json({ error: 'Internal server error' });
		}
		const saved = await saveTopicNameInUsersTable(userId, generatedTopic)
			.then(() => true)
			.catch((error) => {
				console.error('[pubsubHandler] Unable to save topic name in db', error);
				return false;
			});
		if (!saved) {
			const eventProperties = { response_status: 500 };
			rudderStackEvents.track(userId, '', 'dpu-pubsub', { type: 'save-topic-in-db', eventStatusFlag: 0, eventProperties });
			return res.status(500).json({ error: 'Internal server error' });
		}
		const eventProperties = { topic_name: generatedTopic, response_status: 200 };
		rudderStackEvents.track(userId, '', 'dpu-pubsub', { type: 'create-topic-in-gcloud', eventStatusFlag: 1, eventProperties });
		return res.status(200).json({ installId: generatedTopic });
	}

	const topicName = userData.topic_name;
	const eventProperties = { topic_name: topicName, response_status: 200 };
	rudderStackEvents.track(userId, '', 'dpu-pubsub', { type: 'HTTP-200', eventStatusFlag: 1, eventProperties });
	return res.status(200).json({ installId: topicName });
};

export default pubsubHandler;
