import type { Session } from "next-auth";
import { baseURL, supportedProviders } from ".";
import axios from "axios";
import type { RepoIdentifier } from "../../types/repository";

type GithubRepoObj = {
	name: string,
	full_name: string,
	created_at: string,
	updated_at: string,
	license: any,
	private: boolean,
	owner: object,
	html_url: string,
	[property: string]: any
}

// type BitbucketRepoObj = {
// }

// type GitlabRepoObj = {
// }

const getUserRepositoriesForGitHub = async (access_key: string, authId?: string) => {
	const perPage = 100;
	let pageNo = 1;
	const allGitHubRepositories: RepoIdentifier[] = []
	let isResponseFull = true;

	do {
		const endPoint = `/user/repos?sort=updated&per_page=${perPage}&page=${pageNo}`;
		const { data: repos }: { data: GithubRepoObj[] } = await axios.get(baseURL['github'] + endPoint, {
			headers: {
				'Accept': 'application/vnd.github+json',
				'Authorization': `Bearer ${access_key}`
			}
		})
			.catch(err => {
				console.error(`[Profile] Error occurred while getting user repositories from GitHub API (provider-assigned id: ${authId}). Endpoint: ${endPoint}`, err.message);
				throw err;
			})
		const allGitHubRepoIdentifiers = repos.map(repo => ({
			repo_provider: supportedProviders[0],
			repo_owner: repo.full_name.split('/')[0],
			repo_name: repo.name
		}))
		allGitHubRepositories.push(...allGitHubRepoIdentifiers);
		isResponseFull = repos.length == perPage;
		pageNo++;
	} while (isResponseFull);

	return allGitHubRepositories;
}

export const getUserRepositories = async (session: Session) => {
	const allUserReposPromises = [];
	for (const repoProvider of supportedProviders) {
		if (Object.keys(session.user.auth_info!).includes(repoProvider)) {
			for (const [authId, providerAuthInfo] of Object.entries(session.user.auth_info![repoProvider])) {
				const access_key: string = providerAuthInfo['access_token']; // handle expired access token with refresh token here
				switch (repoProvider) {
					case 'github':
						const userReposPromiseGitHub = getUserRepositoriesForGitHub(access_key, authId)
						allUserReposPromises.push(userReposPromiseGitHub);
						break;
					default:
						break;
				}
			}
		} else {
			console.warn(`${repoProvider} provider not present`);
		}
	}

	const allRepos: Set<RepoIdentifier> = new Set();
	await Promise.allSettled(allUserReposPromises).then((results) => {
		results.forEach((result) => {
			if (result.status !== 'fulfilled') {
				return;
			}
			const providerRepos = result.value;
			providerRepos.forEach((repo: RepoIdentifier) => allRepos.add(repo));
		})
	})
	return Array.from(allRepos);
}