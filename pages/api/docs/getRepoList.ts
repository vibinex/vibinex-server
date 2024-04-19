import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { RepoIdentifier } from '../../../types/repository';
import { getUserRepositories } from "../../../utils/providerAPI/getUserRepositories";
import { authOptions } from '../auth/[...nextauth]';

const getUserRepositoriesHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return res.status(401).json({ error: 'Unauthenticated' });
	}
	const repoList: RepoIdentifier[] = await getUserRepositories(session);
	if (repoList.length == 0) {
		return res.status(500).json({ error: 'Unable to get repo list' });
	}
	return res.status(200).json({ repoList: repoList });
}

export default getUserRepositoriesHandler;