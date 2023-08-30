import type { Session } from "next-auth";
import { baseURL, supportedProviders } from ".";
import axios from "axios";

type GithubEmailObj = {
	email: string,
	primary: boolean,
	verified: boolean,
	visibility: string | null
}

type BitbucketEmailObj = {
	type: "email",
	links: object,
	email: string,
	is_primary: boolean,
	is_confirmed: boolean,
}

type GitlabEmailObj = {
	id: number,
	email: string,
	confirmed_at: string | null,
}

type ProviderEmailObj = GithubEmailObj | BitbucketEmailObj | GitlabEmailObj;

/**
 * This function facilitates auth handling for calling the GitHub/Bitbucket/GitLab APIs.
 * Note: Callback functions must return void since we want to run this function for all the different access_tokens available for this provider
 * @param provider The platform which hosts the account for the user and the repositories they use Vibinex with
 * @param session contains the auth_info object (with the access_token and the refresh_token)
 * @param apiEndPoint the target end-point
 * @param callback is the function that is executed in the case of success
 * @param errorCallback is the function that is executed in the case of failure
 */
// export const callProviderAPI = (
// 	provider: 'github' | 'bitbucket' | 'gitlab',
// 	session: Session,
// 	apiEndPoint: string,
// 	callback: (value: AxiosResponse<any, any>) => void,
// 	errorCallback: (reason: any) => void
// ) => {
// 	if (Object.keys(session.user.auth_info!).includes(provider)) {
// 		for (const provider_auth_info of Object.values(session.user.auth_info![provider])) {
// 			const access_key: string = provider_auth_info['access_token']; // handle expired access token with refresh token here
// 			axios.get(baseURL + apiEndPoint, {
// 				headers: {
// 					'Accept': (provider === 'github') ? 'application/vnd.github+json' : 'application/json',
// 					'Authorization': `Bearer ${access_key}`
// 				}
// 			})
// 				.then(callback)
// 				.catch(errorCallback)
// 		}
// 	} else {
// 		console.warn(`${provider} provider not present`);
// 	}
// }

// callProviderAPI('github', session, '/user/emails',
// 	(response: { data: GithubEmailObj[] }) => {
// 		const aliases = response.data.map((emailObj: GithubEmailObj) => emailObj.email);
// 		updateUser(session.user.id!, { aliases: aliases }).catch(err => {
// 			console.error(`[Profile] Could not update aliases for user (userId: ${session.user.id})`, err)
// 		})
// 	}, err => {
// 		console.error(`[Profile] Error occurred while getting user emails from Github API. userId: ${session.user.id}, name: ${session.user.name}`, err);
// 	});

// callProviderAPI('bitbucket', session, '/user/emails',
// 	(response: { data: { values: BitbucketEmailObj[] } }) => {
// 		const aliases = response.data.values.map((emailObj: BitbucketEmailObj) => emailObj.email);
// 		updateUser(session.user.id!, { aliases: aliases }).catch(err => {
// 			console.error(`[Profile] Could not update aliases for user (userId: ${session.user.id})`, err)
// 		})
// 	},
// 	err => {
// 		console.error(`[Profile] Error occurred while getting user emails from Bitbucket API. userId: ${session.user.id}, name: ${session.user.name}`, err.message);
// 	})

// callProviderAPI('gitlab', session, '/user/emails',
// 	(response: { data: GitlabEmailObj[] }) => {
// 		const aliases = response.data.map((emailObj: GitlabEmailObj) => emailObj.email);
// 		updateUser(session.user.id!, { aliases: aliases }).catch(err => {
// 			console.error(`[Profile] Could not update aliases for user (userId: ${session.user.id})`, err)
// 		})
// 	}, err => {
// 	})

export const getEmailAliases = async (session: Session) => {
	const allUserEmailsPromises = [];
	for (const repoProvider of supportedProviders) {
		if (Object.keys(session.user.auth_info!).includes(repoProvider)) {
			for (const [authId, providerAuthInfo] of Object.entries(session.user.auth_info![repoProvider])) {
				const access_key: string = providerAuthInfo['access_token']; // handle expired access token with refresh token here
				const endPoint = '/user/emails';
				const userEmailsPromise: Promise<{ data: ProviderEmailObj[] }> = axios.get(baseURL[repoProvider] + endPoint, {
					headers: {
						'Accept': (repoProvider === 'github') ? 'application/vnd.github+json' : 'application/json',
						'Authorization': `Bearer ${access_key}`
					}
				})
					.catch(err => {
						console.error(`[Profile] Error occurred while getting user emails from ${repoProvider} API (provider-assigned id: ${authId}). Endpoint: ${endPoint}, userId: ${session.user.id}, name: ${session.user.name}`, err.message);
						throw err;
					})
				allUserEmailsPromises.push(userEmailsPromise);
			}
		} else {
			console.warn(`${repoProvider} provider not present`);
		}
	}

	const allAliases: Set<string> = new Set();
	Promise.allSettled(allUserEmailsPromises).then((results) => {
		results.forEach((result) => {
			if (result.status !== 'fulfilled') {
				return;
			}
			const emailObjects = result.value.data;
			emailObjects.forEach((emailObj: ProviderEmailObj) => allAliases.add(emailObj.email));
		})
	})
	return Array.from(allAliases);
}