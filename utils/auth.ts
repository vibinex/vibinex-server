import { signIn, signOut } from 'next-auth/react';
import { Session } from 'next-auth/core/types';
import { rudderEventMethods } from './rudderstack_initialize';

export const login = (userId: number, userName: string) => {
	signIn().catch((err) => {
		rudderEventMethods().then((response) => {
			response?.track(`${userId}`, "login", {userId: `${userId}`, eventStatusFlag: 0, source: "profile-popup", name: userName}, `${null}`)
		})	
		console.error("[signIn] Authentication failed.", err);
	})
}

export const logout = (userId: number, userName: string) => {
	signOut().then(_ => {
		rudderEventMethods().then((response) => {
			response?.track(`${userId}`, "logout", {userId: `${userId}`, eventStatusFlag: 1, source: "profile-popup", name: userName}, `${null}`)
		})
		window.location.href = "/";
	})
		.catch(err => {
			rudderEventMethods().then((response) => {
				response?.track(`${userId}`, "logout", {userId: `${userId}`, eventStatusFlag: 0, source: "profile-popup", name: userName}, `${null}`)
			})	
			console.error("[signOut] Signout failed", err);
		})
}

export const getAuthUserId = (session: Session | null) => session?.user.id ? session.user.id : 0;
export const getAuthUserName = (session: Session | null) => session?.user?.name ? session?.user?.name : "User";
export const getAuthUserImage = (session: Session | null) => session?.user?.image ? session?.user?.image : "/dummy-profile-pic-female-300n300.jpeg";