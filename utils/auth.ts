import { signIn, signOut } from 'next-auth/react';
import { Session } from 'next-auth/core/types';

export const login = () => {
	signIn().catch((err) => {
		console.error("[signIn] Authentication failed.", err);
	})
}

export const logout = () => {
	signOut().then(_ => {
		window.location.href = "/";
	})
		.catch(err => {
			console.error("[signOut] Signout failed", err);
		})
}

export const getAuthUserId = (session: Session | null) => session?.user.id ? session.user.id : 0;
export const getAuthUserName = (session: Session | null) => session?.user?.name ? session?.user?.name : "User";
export const getAuthUserImage = (session: Session | null) => session?.user?.image ? session?.user?.image : "/dummy-profile-pic-female-300n300.jpeg";