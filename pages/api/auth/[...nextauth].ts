import NextAuth, { Account, User } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { getUserByAlias, getUserByProvider, DbUser, createUser, updateUser } from "../../../utils/db/users";

interface signInParam {
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
			let db_user: DbUser | undefined;
			if (account) {
				// first search based on auth_info
				db_user = await getUserByProvider(account.provider, account.providerAccountId);
			}
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
				// finally, if user is not found, create a new account
				db_user = createUserUpdateObj(user, account);
				await createUser(db_user).catch(err => {
					console.error("[signIn] Could not create user", err);
				})
			} else {
				// if user is found, update the db entry
				const updateObj: DbUser = createUserUpdateObj(user, account, db_user);
				await updateUser(db_user.id!, updateObj).catch(err => {
					console.error("[signIn] Count not update user in database", err);
				})
			}
			return true;
		},
		async redirect({ url, baseUrl }: { url: string, baseUrl: string }) {
			let path: string;
			if (url.startsWith("/")) path = url;
			else if (new URL(url).origin === baseUrl) path = new URL(url).pathname;
			else path = "/";

			if (path = "/") return `${baseUrl}/repo`;
			return baseUrl
		}
	},
	secret: process.env.NEXTAUTH_SECRET,
}

const createUserUpdateObj = (user: User, account: Account | null, db_user?: DbUser) => {
	const updateObj: DbUser = {}
	if (account) {
		updateObj.auth_info = {
			[account.provider]: {
				[account.providerAccountId]: {
					type: account.type,
					scope: account.scope,
					access_token: account.access_token,
					expires_at: account.expires_at,
				}
			}
		}
	}
	if (user.name && user.name != db_user?.name) updateObj.name = user.name;
	if (user.image && user.image != db_user?.profile_url) updateObj.profile_url = user.image;
	if (user.email && !db_user?.aliases?.includes(user.email)) {
		if (db_user?.aliases)
			updateObj.aliases = [...db_user.aliases, user.email]
		else
			updateObj.aliases = [user.email]
	}
	return updateObj;
}

export default NextAuth(authOptions)