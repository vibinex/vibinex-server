import NextAuth, { Account, Profile, Session, TokenSet, User } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider, { GithubProfile } from "next-auth/providers/github"
import GitlabProvider, { GitLabProfile } from "next-auth/providers/gitlab";
import type { BitbucketProfile, BitbucketEmailsResponse } from "../../../types/bitbucket"
import { getUserByAlias, getUserByProvider, DbUser, createUser, updateUser } from "../../../utils/db/users";
import rudderStackEvents from "../events";
import axios from "axios"
import { OAuthConfig, OAuthUserConfig } from "next-auth/providers";
import { v4 as uuidv4 } from "uuid";
interface signInParam {
	user: User,
	account: Account | null,
	profile?: Profile | undefined
}

export const authOptions = {
	// Configure one or more authentication providers
	providers: [
		// GoogleProvider({
		// 	clientId: process.env.GOOGLE_CLIENT_ID!,
		// 	clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		// }),
		GithubProvider({
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!
		}),
		BitbucketProvider({
			clientId: process.env.BITBUCKET_CLIENT_ID!,
			clientSecret: process.env.BITBUCKET_CLIENT_SECRET!,
		}),
		GitlabProvider({
			clientId: process.env.GITLAB_CLIENT_ID!,
			clientSecret: process.env.GITLAB_CLIENT_SECRET!,
		}),
		// ...add more providers here
	],
	callbacks: {
		async signIn({ user, account, profile }: signInParam) {
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
					// Not allowing sign in when this happens
					return false;
				}
			}

			if (!db_user) {
				// finally, if user is not found, create a new account
				db_user = createUserUpdateObj(user, account, profile);
				await createUser(db_user).catch(err => {
					console.error("[signIn] Could not create user", err);
				})

				// signup event
				account && getUserByProvider(account.provider, account.providerAccountId).then(db_user => {
					rudderStackEvents.track(db_user.id.toString(), uuidv4(), "signup", { ...db_user, eventStatusFlag: 1 }); //TODO: Get the anonymoudId from the client session so that the random generated anonymoudId doesn't create noise.
				}).catch(err => {
					console.error("[signup] Rudderstack event failed: Could not get user id", db_user, err);
				});
			} else {
				const existingAuth = (account) ? Object.keys(db_user.auth_info!).includes(account.provider) && Object.keys(db_user.auth_info![account.provider]).includes(account.providerAccountId) : false;
				// if user is found, update the db entry
				const updateObj: DbUser = createUserUpdateObj(user, account, profile, db_user);
				await updateUser(db_user.id!, updateObj).catch(err => {
					console.error("[signIn] Count not update user in database", err);
				})
				rudderStackEvents.track(db_user.id!.toString(), uuidv4(), "login", { ...updateObj, newAuth: !existingAuth });
			}
			return true;
		},
		async redirect({ url, baseUrl }: { url: string, baseUrl: string }) {
			let path: string;
			if (url.startsWith("/")) path = url;
			else if (new URL(url).origin === baseUrl) path = new URL(url).pathname;
			else path = "/";

			if (path = "/") return `${baseUrl}/u`;
			return baseUrl
		},
		async session({ session }: { session: Session }) {
			if (session && session.user) {
				const usersWithAlias = await getUserByAlias(session.user.email!).catch(err => {
					console.error(`[session callback] getUserByAlias failed for ${session.user.email}`, err);
				})
				if (!usersWithAlias || usersWithAlias.length < 1) {
					console.warn(`[session callback] No user found with this email: ${session.user.email}`);
				}
				else if (usersWithAlias.length > 1) {
					console.warn(`[session callback] Multiple users found with this email: ${session.user.email}. Names: `,
						usersWithAlias.map(u => u.name).join(", "));
					// TODO: send UI to ask user if they want to merge the other accounts with this one
				} else {
					const dbUser = usersWithAlias[0];
					session.user.id = dbUser.id;
					session.user.auth_info = dbUser.auth_info;
				}
			}
			return session;
		}
	},
	secret: process.env.NEXTAUTH_SECRET,
	theme: {
		brandColor: "#2196F3",
		logo: "https://vibinex.com/favicon.ico"
	}
}


const getHandleFromProfile = (profile: Profile | undefined) => {
	let handle: string | null;
	// convert profile to GithubProfile or BitbucketProfile
	const githubProfile = profile as GithubProfile;
	const bitbucketProfile = profile as BitbucketProfile;
	const gitlabProfile = profile as GitLabProfile;
	if (profile !== undefined) {
		if ("login" in githubProfile) {
			handle = githubProfile.login; // Assign profile.login if it's a GithubProfile
		} else if ("username" in bitbucketProfile) {
			handle = bitbucketProfile.username; // Assign profile.username if it's a BitbucketProfile
		} else if ("username" in gitlabProfile) {
			handle = gitlabProfile.username; // Assign profile.username if it's a GitLabProfile
		} else {
			handle = null; // Set handle to null if it's neither a GithubProfile nor a BitbucketProfile
		}
	} else {
		handle = null; // Assign null if it's null
	}
	return handle;
}
const createUserUpdateObj = (user: User, account: Account | null, profile: Profile | undefined, db_user?: DbUser) => {
	const updateObj: DbUser = {}
	if (account) {
		updateObj.auth_info = {
			[account.provider]: {
				[account.providerAccountId]: {
					type: account.type,
					scope: account.scope,
					access_token: account.access_token,
					expires_at: account.expires_at,
					refresh_token: account.refresh_token,
					handle: getHandleFromProfile(profile),
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

// Solution found here: https://github.com/nextauthjs/next-auth/pull/3076#issuecomment-1180218158
function BitbucketProvider<P extends BitbucketProfile>(options: OAuthUserConfig<P>): OAuthConfig<P> {
	return {
		id: "bitbucket",
		name: "Bitbucket",
		type: "oauth",
		authorization: {
			url: `https://bitbucket.org/site/oauth2/authorize`,
			params: {
				scope: "email account",
				response_type: "code",
			},
		},
		token: `https://bitbucket.org/site/oauth2/access_token`,
		userinfo: {
			request: ({ tokens }: { tokens: TokenSet }) =>
				axios
					.get("https://api.bitbucket.org/2.0/user", {
						headers: {
							Authorization: `Bearer ${tokens.access_token}`,
							Accept: "application/json",
						},
					})
					.then((r) => r.data),
		},
		async profile(profile: BitbucketProfile, tokens: TokenSet) {
			const email = await axios
				.get<BitbucketEmailsResponse>(
					"https://api.bitbucket.org/2.0/user/emails",
					{
						headers: {
							Authorization: `Bearer ${tokens.access_token}`,
							Accept: "application/json",
						},
					}
				)
				.then(
					(r) =>
						// find the primary email, or the first available email
						(r.data.values.find((value) => value.is_primary) || r.data.values[0])
							.email
				);

			return {
				...profile,
				id: profile.account_id,
				email,
				image: profile.links.avatar.href,
				name: profile.display_name,
			};
		},
		style: {
			logo: "../../bitbucket-dark.svg",
			logoDark: "../../bitbucket.svg",
			bg: "#fff",
			text: "#0052cc",
			bgDark: "#0052cc",
			textDark: "#fff",
		},
		options,
	}
}

export default NextAuth(authOptions)