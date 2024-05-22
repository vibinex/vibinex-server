import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { RepoIdentifier } from '../../../types/repository';
import { getUserRepositories } from "../../../utils/providerAPI/getUserRepositories";
import { authOptions } from '../auth/[...nextauth]';
import rudderStackEvents from '../events';

const getUserRepositoriesHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		const eventProperties = { response_status: 401 };
		rudderStackEvents.track("absent", "", 'docs-user-repos-handler', { type: 'HTTP-401', eventStatusFlag: 0, eventProperties });
		return res.status(401).json({ error: 'Unauthenticated' });
	}
	const repoList: RepoIdentifier[] | null = await getUserRepositories(session).catch(err => {
		console.error('Error getting repositories', err);
		return null;
	})
	if (!repoList) {
		const eventProperties = { response_status: 500 };
		rudderStackEvents.track(session?.user?.id ?? "absent", "", 'docs-user-repos-handler', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties });
		return res.status(500).json({ error: 'Error getting repositories' });
	}
	if (repoList.length == 0) {
		const eventProperties = { response_status: 204, result_length: repoList.length };
		rudderStackEvents.track(session?.user?.id ?? "absent", "", 'docs-user-repos-handler', { type: 'HTTP-204', eventStatusFlag: 1, eventProperties });
		return res.status(204).json({ error: 'No repositories found' });
	}
	const eventProperties = { response_status: 200, result_length: repoList.length };
	rudderStackEvents.track(session?.user?.id ?? "absent", "", 'docs-user-repos-handler', { type: 'HTTP-200', eventStatusFlag: 1, eventProperties });
	return res.status(200).json({ repoList: repoList });
}

export default getUserRepositoriesHandler;