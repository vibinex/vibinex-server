import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import type { RepoIdentifier } from "../../types/repository";
import { getRepos } from "../../utils/db/repos";
import { getUserRepositories } from "../../utils/providerAPI/getUserRepositories";
import { authOptions } from "./auth/[...nextauth]";

const getReposForUser = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return res.status(401).json({ error: 'Unauthenticated' });
	}

	const userReposFromProvider = await getUserRepositories(session).catch((err): RepoIdentifier[] => {
		console.error(`[RepoList] getRepos from the providers failed for user: ${session.user.id} (Name: ${session.user.name})`, err);
		return [];
	});
	if (userReposFromProvider.length === 0) {
		console.warn(`[RepoList] getRepos from the providers got zero repositories for user: ${session.user.id} (Name: ${session.user.name})`);
		return res.status(204).json({ repoList: [] });
	}

	const userReposFromDb = await getRepos(userReposFromProvider, session).catch((err) => {
		console.error(`[RepoList] getRepos from the database failed for user: ${session.user.id} (Name: ${session.user.name})`, err);
		return { repos: [], failureRate: 1 };
	});
	if (!userReposFromDb) {
		console.error("[RepoList] getRepos failed for session", session);
		return res.status(500).json({ repoList: [], error: "Failed to get user repositories from the database" });
	}
	if (userReposFromDb.failureRate != 0) {
		// if necessary, we can add this to the returned object
		console.warn(`[RepoList] getRepos from database failed to query ~${(100 * userReposFromDb.failureRate).toFixed(2)}% of the repositories for user: ${session.user.id} (Name: ${session.user.name})`)
	}
	const repoList = userReposFromDb.repos.map(repo => {
		const { created_at, ...other } = repo;
		return { created_at: created_at.toDateString(), ...other }
	});
	return res.status(200).json({ repoList, failureRate: userReposFromDb.failureRate });
}

export default getReposForUser;