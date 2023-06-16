import { useContext } from 'react';
import { signIn, signOut } from 'next-auth/react';
import { Session } from 'next-auth/core/types';
import RudderContext from '../components/RudderContext';
import { getAndSetAnonymousIdFromLocalStorage } from './url_utils';
import { RudderstackClientSideEvents, rudderEventMethods } from './rudderstack_initialize';

export const login = (anonymousId: string, rudderEventMethods: RudderstackClientSideEvents) => {
	signIn().catch((err) => {
		rudderEventMethods?.track(``, "login", {eventStatusFlag: 0, source: "profile-popup"}, anonymousId)
		console.error("[signIn] Authentication failed.", err);
	})
}

export const logout = (userId: number, userName: string, anonymousId: string, rudderEventMethods: RudderstackClientSideEvents) => {
	signOut().then(_ => {
		rudderEventMethods?.track(`${userId}`, "logout", {userId: `${userId}`, eventStatusFlag: 1, source: "profile-popup", name: userName}, anonymousId)
		window.location.href = "/";
	})
		.catch(err => {
			rudderEventMethods?.track(`${userId}`, "logout", {userId: `${userId}`, eventStatusFlag: 0, source: "profile-popup", name: userName}, anonymousId)
			console.error("[signOut] Signout failed", err);
		})
}

export const getAuthUserId = (session: Session | null) => session?.user.id ? session.user.id : 0;
export const getAuthUserName = (session: Session | null) => session?.user?.name ? session?.user?.name : "User";
export const getAuthUserImage = (session: Session | null) => session?.user?.image ? session?.user?.image : "/dummy-profile-pic-female-300n300.jpeg";