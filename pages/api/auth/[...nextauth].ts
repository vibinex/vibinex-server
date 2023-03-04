import NextAuth, { Account, User } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { getUserByAlias, getUserByProvider, DbUser } from "../../../utils/db/users";

type signInParam = {
	user: User,
	account: Account | null,
}

export const authOptions = {
	// Configure one or more authentication providers
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		})
		// ...add more providers here
	],
	callbacks: {
		async signIn({ user, account }: signInParam) {
			// search for the user in the users table
			// first search based on auth_info
			let db_user: DbUser | undefined;
			if (account)
				db_user = await getUserByProvider(account.provider, account.providerAccountId);
			if (!db_user && user.email) {
				// then search based on aliases: ask if they want to merge accounts
				const alias_users = await getUserByAlias(user.email);
				if (alias_users?.length == 1) db_user = alias_users[0];
				else if (alias_users && alias_users?.length > 1) {
					// FIXME: show user the list of accounts and let them choose
					db_user = alias_users[0];
				}
			}
			if (!db_user) {
				console.log("New user");
			}
			return true;
		}
	},
}

export default NextAuth(authOptions)