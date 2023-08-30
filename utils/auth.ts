import { signIn, signOut } from 'next-auth/react';
import type { Session } from 'next-auth/core/types';
import { RudderstackClientSideEvents } from './rudderstack_initialize';

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