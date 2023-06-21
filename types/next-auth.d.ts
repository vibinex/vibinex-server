import NextAuth, { DefaultSession } from "next-auth";
import AuthInfo from "./AuthInfo";

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
}