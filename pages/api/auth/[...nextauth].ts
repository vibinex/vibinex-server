import NextAuth, { Account, Profile, Session, TokenSet, User } from "next-auth"
// import GoogleProvider from "next-auth/providers/google"
import GithubProvider, { GithubProfile } from "next-auth/providers/github"
import GitlabProvider, { GitLabProfile } from "next-auth/providers/gitlab";
import type { BitbucketProfile, BitbucketEmailsResponse } from "../../../types/bitbucket"
import { getUserByAlias, getUserByProvider, DbUser, createUser, updateUser } from "../../../utils/db/users";
import rudderStackEvents from "../events";
import axios from "axios"
import { OAuthConfig, OAuthUserConfig } from "next-auth/providers";
import { v4 as uuidv4 } from "uuid";
import sGrid from "@sendgrid/mail";

interface SignInParam {
	user: User,
	account: Account | null,
	profile?: Profile
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
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
			authorization: {
				params: {
					scope: "read:user user:email read:org" // add your custom scope here
				}
			}
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
		async signIn({ user, account, profile }: SignInParam) {
			// search for the user in the users table
			let dbUser: DbUser | undefined;
			if (account) {
				// first search based on auth_info
				dbUser = await getUserByProvider(account.provider, account.providerAccountId).catch(err => {
					console.error(`[signIn] Could not get user by provider for ${account.provider} (Provider ID: ${account.providerAccountId})`, err);
					return undefined;
				});
			}
			if (!dbUser && user.email) {
				// then search based on aliases: ask if they want to merge accounts
				const alias_users = await getUserByAlias(user.email);
				if (alias_users?.length == 1) dbUser = alias_users[0];
				else if (alias_users && alias_users?.length > 1) {
					// FIXME: show user the list of accounts and let them choose
					// Not allowing sign in when this happens
					return false;
				}
			}

			if (!dbUser) {
				// finally, if user is not found, create a new account
				dbUser = createUserUpdateObj(user, account, profile);
				await createUser(dbUser).catch(err => {
					console.error("[signIn] Could not create user", err);
				})

				// signup event
				account && getUserByProvider(account.provider, account.providerAccountId).then(dbUserFromDb => {
					rudderStackEvents.track(dbUserFromDb.id ?? "absent", uuidv4(), "auth", {type: "signup", ...dbUserFromDb, eventStatusFlag: 1 }); //TODO: Get the anonymoudId from the client session so that the random generated anonymoudId doesn't create noise.
				}).catch(err => {
					console.error("[signup] Rudderstack event failed: Could not get user id", dbUser, err);
					rudderStackEvents.track("absent", uuidv4(), "auth", {type: "signup", eventStatusFlag: 0 });
				});
				// email send
				if (user?.name && user?.email) { sendSignupEmail(user.email, user.name); }

			} else {
				const existingAuth = (account) ? Object.keys(dbUser.auth_info!).includes(account.provider) && Object.keys(dbUser.auth_info![account.provider]).includes(account.providerAccountId) : false;
				// if user is found, update the db entry
				const updateObj: DbUser = createUserUpdateObj(user, account, profile, dbUser);
				await updateUser(dbUser.id!, updateObj).catch(err => {
					console.error("[signIn] Count not update user in database", err);
					rudderStackEvents.track("absent", uuidv4(), "auth", {type: "login", ...updateObj, newAuth: !existingAuth, eventtStatusFlag: 1 });
				})
				rudderStackEvents.track(dbUser.id!.toString(), uuidv4(), "auth", {type: "login", ...updateObj, newAuth: !existingAuth, eventStatusFlag: 0 }); //TODO: Get the anonymoudId from the client session so that the random generated anonymoudId doesn't create noise.;
			}
			return true;
		},
		async redirect({ url, baseUrl }: { url: string, baseUrl: string }) {
			let path: string;
			if (url.startsWith("/")) path = url;
			else if (new URL(url).origin === baseUrl) path = new URL(url).pathname + new URL(url).search;
			else path = "/";

			if (path === "/") return `${baseUrl}/u`;
			return `${baseUrl}${path}`
		},
		async session({ session }: { session: Session }) {
			if (session?.user) {
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

const sendSignupEmail = (userEmail: string, userName: string) => {
	const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Welcome to Vibinex</title>
	<style>
		/* Add your custom CSS styles here */
		body {
			font-family: Arial, sans-serif;
			background-color: #f5f5f5;
			color: #333;
			margin: 0;
			padding: 0;
		}
		.container {
			max-width: 600px;
			margin: 20px auto;
			padding: 20px;
			background-color: #fff;
			border-radius: 8px;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		}
		.logo {
			text-align: center;
			margin-bottom: 20px;
		}
		.logo img {
			max-width: 150px;
			height: auto;
		}
		h1 {
			color: #2196F3;
			text-align: center;
		}
		p {
			margin-bottom: 20px;
			line-height: 1.5;
		}
		.cta-button {
			display: block;
			width: 200px;
			margin: 20px auto;
			padding: 10px 20px;
			text-align: center;
			background-color: #2196F3;
			color: #fff;
			text-decoration: none;
			border-radius: 4px;
			transition: background-color 0.3s ease;
		}
		.cta-button:hover {
			background-color: #0c7cd5;
		}
	</style>
</head>
<body>
	<div class="container">
		<div class="logo">
			<img src="https://vibinex.com/favicon.ico" alt="Vibinex Logo">
		</div>
		<h1>Welcome to Vibinex, ${userName}!</h1>
		<p>With Vibinex, you can streamline your pull request reviews, collaborate with your team more efficiently, and accelerate your software development process.</p>
		<p>Start exploring now by logging into your account:</p>
		<a href="https://vibinex.com/login" class="cta-button">Log In to Vibinex</a>
		<p>If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:contact@vibinex.com">contact@vibinex.com</a>.</p>
		<p>Happy coding!</p>
		<p>The Vibinex Team</p>
	</div>
</body>
</html>
	`;
	console.debug(`[sendSignupEmail] SENDGRID_API_KEY = ${process.env.SENDGRID_API_KEY}`);
	console.debug(`[sendSignupEmail] user email = ${userEmail}`);
	const msg = {
		to: userEmail, // recipient's email address
		from: "contact@vibinex.com", // sender's email address
		subject: "Welcome to Vibinex", // email subject
		html: htmlBody,
	};
	// Send email
	if (!process.env.SENDGRID_API_KEY) {
		console.error("[sendSignupEmail] SENDGRID_API_KEY env var not set, unable to send signup email");
		return;
	}
	sGrid.setApiKey(process.env.SENDGRID_API_KEY as string);
	sGrid.send(msg).then((res) => { 
		console.debug(`[sendSignupEmail] Email sent successfully! res = ${JSON.stringify(res)}`);
	}).catch((err) => {
		console.error("[sendSignupEmail] Error sending email:", err);
	});
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