import axios from "axios";
import type { Session } from "next-auth";
import { baseURL, supportedProviders } from ".";
import type { RepoIdentifier } from "../../types/repository";
import { Bitbucket } from "./Bitbucket";
import AuthInfo from "../../types/AuthInfo";
import { bitbucketAccessToken } from "./auth";

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

type BitbucketWorkspaceObj = {
	type: string,
	user: {
		display_name: string,
		links: object[],
		type: 'user',
		uuid: string,
		account_id: string,
		nickname: string
	},
	workspace: {
		type: 'workspace',
		uuid: string,
		name: string,
		slug: string,
		links: object[]
	},
	links: { self: object[] },
	added_on: string,
	permission: string,
	last_accessed: string
}

type BitbucketRepoObj = {
	type: 'repository',
	full_name: string,
	links: object[],
	name: string,
	slug: string,
	description: string,
	scm: 'git',
	owner: object,
	workspace: {
		type: 'workspace',
		uuid: string,
		name: string,
		slug: string,
		links: object[]
	},
	is_private: boolean,
	project: object,
	uuid: string,
}

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
				console.error(`[getUserRepositories] Error occurred while getting user repositories from GitHub API (provider-assigned id: ${authId}). Endpoint: ${endPoint}`, err.message);
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

export const getUserRepositoriesForBitbucket = async (access_key: string, authId?: string): Promise<RepoIdentifier[]> => {
	const workspacesData = await Bitbucket.retrieveAllPages<BitbucketWorkspaceObj>(`/user/permissions/workspaces`, access_key, authId);
	const workspaces = workspacesData.map((workspaceObj) => workspaceObj.workspace.slug);

	const repositories: RepoIdentifier[] = [];
	for (const workspace of workspaces) {
		const repositoriesData = await Bitbucket.retrieveAllPages<BitbucketRepoObj>(`/repositories/${workspace}`, access_key, authId);
		const allBitbucketRepoIdentifiers = repositoriesData.map(repoObj => ({
			repo_provider: supportedProviders[1],
			repo_owner: repoObj.workspace.slug,
			repo_name: repoObj.slug
		}));
		repositories.push(...allBitbucketRepoIdentifiers);
	}
	return repositories;
}

export const getUserRepositories = async (session: Session) => {
	const allUserReposPromises = [];
	for (const repoProvider of supportedProviders) {
		if (Object.keys(session.user.auth_info!).includes(repoProvider)) {
			for (const [authId, providerAuthInfo] of Object.entries(session.user.auth_info![repoProvider])) {
				const access_key: string = providerAuthInfo['access_token'];
				switch (repoProvider) {
					case 'github':
						if (!providerAuthInfo) {
							console.error("Unable to deserialize providerAuthInfo ", providerAuthInfo);
							continue;
						}
						const access_key_gh = access_key;
						const userReposPromiseGitHub = getUserRepositoriesForGitHub(access_key_gh, authId)
						allUserReposPromises.push(userReposPromiseGitHub);
						break;
					case 'bitbucket':
						const access_key_bb: string | null = await bitbucketAccessToken(authId, session.user.id!);
						if (!access_key_bb) {
							console.error("[getUserRepositories] No access token in auth_info: ", providerAuthInfo);
							continue;
						}
						const userReposPromiseBitbucket = getUserRepositoriesForBitbucket(access_key, authId);
						allUserReposPromises.push(userReposPromiseBitbucket);
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