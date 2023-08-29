import { signIn, signOut } from 'next-auth/react';
import type { Session } from 'next-auth/core/types';
import { RudderstackClientSideEvents } from './rudderstack_initialize';
import axios, { AxiosResponse } from 'axios';

export const login = (anonymousId: string, rudderEventMethods: RudderstackClientSideEvents | null) => {
	signIn().catch((err) => {
		rudderEventMethods?.track(``, "login", { eventStatusFlag: 0, source: "profile-popup" }, anonymousId)
		console.error("[signIn] Authentication failed.", err);
	})
}

export const logout = (userId: string, userName: string, anonymousId: string, rudderEventMethods: RudderstackClientSideEvents | null) => {
	signOut().then(_ => {
		rudderEventMethods?.track(userId, "logout", { userId: userId, eventStatusFlag: 1, source: "profile-popup", name: userName }, anonymousId)
		window.location.href = "/";
	})
		.catch(err => {
			rudderEventMethods?.track(userId, "logout", { userId: userId, eventStatusFlag: 0, source: "profile-popup", name: userName }, anonymousId)
			console.error("[signOut] Signout failed", err);
		})
}

export const getAuthUserId = (session: Session | null) => session?.user?.id ? session.user.id : "";
export const getAuthUserName = (session: Session | null) => session?.user?.name ? session?.user?.name : "User";
export const getAuthUserImage = (session: Session | null) => session?.user?.image ? session?.user?.image : "/dummy-profile-pic-female-300n300.jpeg";
export const getAuthUserEmail = (session: Session | null) => session?.user?.email ? session?.user?.email : "";

/**
 * This function facilitates auth handling for calling the GitHub/Bitbucket/GitLab APIs.
 * Note: Callback functions must return void since we want to run this function for all the different access_tokens available for this provider
 * @param provider The platform which hosts the account for the user and the repositories they use Vibinex with
 * @param session contains the auth_info object (with the access_token and the refresh_token)
 * @param apiEndPoint the target end-point
 * @param callback is the function that is executed in the case of success
 * @param errorCallback is the function that is executed in the case of failure
 */
export const callProviderAPI = (
	provider: 'github' | 'bitbucket' | 'gitlab',
	session: Session,
	apiEndPoint: string,
	callback: (value: AxiosResponse<any, any>) => void,
	errorCallback: (reason: any) => void
) => {
	const baseURL = (provider === 'github') ? "https://api.github.com" :
		(provider === 'bitbucket') ? "https://api.bitbucket.org/2.0" :
			(provider === 'gitlab') ? "https://gitlab.com/api/v4" : "";
	if (Object.keys(session.user.auth_info!).includes(provider)) {
		for (const provider_auth_info of Object.values(session.user.auth_info![provider])) {
			const access_key: string = provider_auth_info['access_token']; // handle expired access token with refresh token here
			axios.get(baseURL + apiEndPoint, {
				headers: {
					'Accept': (provider === 'github') ? 'application/vnd.github+json' : 'application/json',
					'Authorization': `Bearer ${access_key}`
				}
			})
				.then(callback)
				.catch(errorCallback)
		}
	} else {
		console.warn(`${provider} provider not present`);
	}
}