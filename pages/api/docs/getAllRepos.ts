import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { RepoIdentifier } from '../../../types/repository';
import { getUserRepositories } from "../../../utils/providerAPI/getUserRepositories";
import { authOptions } from '../auth/[...nextauth]';
import { getAuthUserId } from '../../../utils/auth';
import { DbUser, getUserById } from '../../../utils/db/users';
import { saveRepoIdentifierToDb } from '../../../utils/db/repos';

const getUserRepositoriesHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return res.status(401).json({ error: 'Unauthenticated' });
	}
	const repoList: RepoIdentifier[] | null = await getUserRepositories(session).catch(err => {
		console.error('[getUserRepositoriesHandler] Error getting repositories', err);
		return null;
	})
	if (!repoList) {
		return res.status(500).json({ error: 'Error getting repositories' });
	}
	if (repoList.length == 0) {
		return res.status(204).json({ error: 'No repositories found' });
	}
	res.status(200).json({ repoList: repoList });
	const userId = getAuthUserId(session);
	const userData: DbUser | null = await getUserById(userId).catch((err) => {
		console.error('[getUserRepositoriesHandler] Error in getting user db data', err);
		return null;
	});
	if (!userData?.topic_name) {
		console.error(`[getUserRepositoriesHandler] Error in getting user topic from db`);
		return;
	}
	const topicName = userData.topic_name;
	await saveRepoIdentifierToDb(repoList, topicName);
}

export default getUserRepositoriesHandler;