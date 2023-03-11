import { signIn, signOut } from 'next-auth/react';
import { Session } from 'next-auth/core/types';

export const login = () => {
	signIn().then((val) => {
		console.log("[signIn]", val);
	})
}

export const logout = () => {
	signOut().then(_ => {
		window.location.href = "/";
	})
}

export const getAuthUserName = (session: Session | null) => session?.user?.name ? session?.user?.name : "User";
export const getAuthUserImage = (session: Session | null) => session?.user?.image ? session?.user?.image : "/dummy-profile-pic-female-300n300.jpeg";