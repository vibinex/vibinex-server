import axios from "axios";
import type { Session } from "next-auth";
import { baseURL, supportedProviders } from ".";
import AuthInfo from "../../types/AuthInfo";
import { bitbucketAccessToken } from "./auth";

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
		if (!Object.keys(session.user.auth_info!).includes(repoProvider)) {
			console.warn(`${repoProvider} provider not present`);
			continue;
		}
		for (const [authId, providerAuthInfo] of Object.entries(session.user.auth_info![repoProvider])) {
			const access_key: string | null = (repoProvider === 'bitbucket')
				? await bitbucketAccessToken(authId, session.user.id!)
				: providerAuthInfo.access_token!;
			// const access_key: string = providerAuthInfo['access_token'];
			if (!access_key) {
				console.error("[getEmailAliases] No access token found: ", providerAuthInfo);
				continue;
			}
			const endPoint = '/user/emails';
			const userEmailsPromise: Promise<ProviderEmailObj[]> = axios.get(baseURL[repoProvider] + endPoint, {
				headers: {
					'Accept': (repoProvider === 'github') ? 'application/vnd.github+json' : 'application/json',
					'Authorization': `Bearer ${access_key}`
				}
			})
				.then((res) => {
					return (repoProvider === 'bitbucket') ? res.data.values : res.data;
				})
				.catch(err => {
					console.error(`[Profile] Error occurred while getting user emails from ${repoProvider} API (provider-assigned id: ${authId}). Endpoint: ${endPoint}, userId: ${session.user.id}, name: ${session.user.name}`, err.message);
					throw err;
				})
			allUserEmailsPromises.push(userEmailsPromise);
		}
	}

	const allAliases: Set<string> = new Set();
	await Promise.allSettled(allUserEmailsPromises).then((results) => {
		results.forEach((result) => {
			if (result.status !== 'fulfilled') {
				console.error(`[getEmailAliases] Promise rejected for one of the providers with this reason: ${result.reason}`);
				return;
			}
			const emailObjects = result.value;
			emailObjects.forEach((emailObj: ProviderEmailObj) => allAliases.add(emailObj.email));
		})
	})
	return Array.from(allAliases);
}