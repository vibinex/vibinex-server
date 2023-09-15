import NextAuth, { DefaultSession } from "next-auth";
import AuthInfo from "./AuthInfo";
import { BuiltInProviderType } from "next-auth/providers";

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id?: string,
			name?: string,
			email?: string,
			image?: string,
			auth_info?: AuthInfo
		}
	}

	type AuthProviderType = BuiltInProviderType | 'bitbucket'
}