import { signIn, signOut } from 'next-auth/react';
import type { Session } from 'next-auth/core/types';
import { RudderstackClientSideEvents } from './rudderstack_initialize';
import { AuthProviderType } from 'next-auth';

export const login = (anonymousId: string, rudderEventMethods: RudderstackClientSideEvents | null, provider?: AuthProviderType) => {
	signIn(provider).catch((err) => {
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

export const hasValidAuthInfo = (session: Session | null, provider: AuthProviderType): boolean => {
	const authInfo = session?.user?.auth_info;
	const currentTimeInSec = Date.now() / 1000;
	if (!authInfo?.[provider]) return false;
	const providerAuthInfos = Object.values(authInfo[provider]);
	switch (provider) {
		case 'github':
			return providerAuthInfos.length > 0
		case 'bitbucket':
			return providerAuthInfos.map(info => info.expires_at).filter(expiryTime => expiryTime && expiryTime > currentTimeInSec).length > 0;
		default:
			console.error(`[hasValidAuthInfo] Unsupported provider "${provider}"`);
			return false;
	}
}