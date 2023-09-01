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