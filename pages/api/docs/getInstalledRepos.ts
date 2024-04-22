import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { getUserRepositoriesByTopic } from '../../../utils/db/repos';
import { authOptions } from '../auth/[...nextauth]';

const getInstalledReposForUser = async (req: NextApiRequest, res: NextApiResponse) => {
	const { query, method } = req;
	if (method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return res.status(401).json({ error: 'Unauthenticated' });
	}

	const { topicId, provider } = query;
	// data validation
	if (!topicId || typeof topicId !== 'string') {
		return res.status(400).json({ error: 'Topic ID is required and must be a string' });
	}
	if (!provider || typeof provider !== 'string') {
		return res.status(400).json({ error: 'Provider is required and must be a string' });
	}

	const userReposFromDb = await getUserRepositoriesByTopic(topicId, provider).catch((err) => {
		console.error(`[getInstalledReposForUser] Failed to get repos for topicId: ${topicId}`, err);
		return res.status(500).json({ error: 'Failed to get repos for topicId' });
	});	
	return res.status(200).json({ repoList: userReposFromDb });
}

export default getInstalledReposForUser;