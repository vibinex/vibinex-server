import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { getUserRepositoriesByTopic } from '../../../utils/db/repos';
import { authOptions } from '../auth/[...nextauth]';
import rudderStackEvents from '../events';

const getInstalledReposForUser = async (req: NextApiRequest, res: NextApiResponse) => {
	const { query, method } = req;
	if (method !== 'GET') {
		const eventProperties = { response_status: 405 };
		rudderStackEvents.track("absent", "", 'installed-repos-for-user', { type: 'HTTP-405', eventStatusFlag: 0, eventProperties });
		return res.status(405).json({ error: 'Method not allowed' });
	}
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		const eventProperties = { response_status: 401 };
		rudderStackEvents.track("absent", "", 'installed-repos-for-user', { type: 'HTTP-401', eventStatusFlag: 0, eventProperties });
		return res.status(401).json({ error: 'Unauthenticated' });
	}

	const { topicId, provider } = query;
	const event_properties = {
		topic_name: topicId || "",
		repo_provider: provider || ""
	}
	// data validation
	if (!topicId || typeof topicId !== 'string') {
		const eventProperties = { ...event_properties, response_status: 400 };
		rudderStackEvents.track(session?.user?.id ?? "absent", "", 'installed-repos-for-user', { type: 'HTTP-400', eventStatusFlag: 0, eventProperties });
		return res.status(400).json({ error: 'Topic ID is required and must be a string' });
	}
	if (!provider || typeof provider !== 'string') {
		const eventProperties = { ...event_properties, response_status: 400 };
		rudderStackEvents.track(session?.user?.id ?? "absent", "", 'installed-repos-for-user', { type: 'HTTP-400', eventStatusFlag: 0, eventProperties });
		return res.status(400).json({ error: 'Provider is required and must be a string' });
	}

	const userReposFromDb = await getUserRepositoriesByTopic(topicId, provider).catch((err) => {
		console.error(`[getInstalledReposForUser] Failed to get repos for topicId: ${topicId}`, err);
		const eventProperties = { ...event_properties, response_status: 400 };
		rudderStackEvents.track(session?.user?.id ?? "absent", "", 'installed-repos-for-user', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties });
		return res.status(500).json({ error: 'Failed to get repos for topicId' });
	});
	const eventProperties = { ...event_properties, result_length: userReposFromDb?.length, response_status: 200 };
	rudderStackEvents.track(session?.user?.id ?? "absent", "", 'installed-repos-for-user', { type: 'HTTP-200', eventStatusFlag: 1, eventProperties });
	return res.status(200).json({ repoList: userReposFromDb });
}

export default getInstalledReposForUser;