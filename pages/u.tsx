import { GetServerSideProps } from "next";
import { getServerSession, Session } from "next-auth";
import Link from "next/link";
import MainAppBar from "../views/MainAppBar";
import { authOptions } from "./api/auth/[...nextauth]";
import { updateUser } from "../utils/db/users";
import axios from "axios";
import { useEffect, useContext } from "react";
import RudderContext from "../components/RudderContext";
import { getAuthUserId, getAuthUserName } from "../utils/auth";
import RepoList, { getRepoList } from "../views/RepoList";
import conn from "../utils/db";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import Button from "../components/Button";
import { getAndSetAnonymousIdFromLocalStorage } from "../utils/rudderstack_initialize";

type ProfileProps = {
	session: Session,
	repo_list: string[],
}

const Profile = ({ repo_list }: ProfileProps) => {
	const session: Session | null = useSession().data;
	const { rudderEventMethods } = useContext(RudderContext);
	useEffect(() => {
		const anonymousId = getAndSetAnonymousIdFromLocalStorage()
		rudderEventMethods?.track(getAuthUserId(session), "User Profile Page", { type: "page", name: getAuthUserName(session) }, anonymousId);

		const handleAddRepositoryButton = () => {
			rudderEventMethods?.track(getAuthUserId(session), "Add repository ", { type: "button", eventStatusFlag: 1, source: "/u", name: getAuthUserName(session) }, anonymousId)
		};

		const addRepositoryButton = document.getElementById('add-repository');
		addRepositoryButton?.addEventListener('click', handleAddRepositoryButton);

		return () => {
			addRepositoryButton?.removeEventListener('click', handleAddRepositoryButton);
		};
	}, [rudderEventMethods, session])

	return (
		<div className="flex flex-col min-h-screen">
			<MainAppBar />
			<div className="max-w-[80%] mx-auto flex-grow">
				<RepoList repo_list={repo_list} />
				<Button id='add-repository' variant="contained" href="/docs" className="w-full my-2 py-2">+ Add Repository</Button>
			</div>
			<Footer />
		</div>
	)
}

type GithubEmailObj = {
	email: string,
	primary: boolean,
	verified: boolean,
	visibility: string | null
}

type BitbucketEmailObj = {
	type: "email",
	links: object,
	email: string,
	is_primary: boolean,
	is_confirmed: boolean,
}

type GitlabEmailObj = {
	id: number,
	email: string,
	confirmed_at: string | null,
}

export const getServerSideProps: GetServerSideProps<ProfileProps> = async ({ req, res }) => {
	res.setHeader(
		'Cache-Control',
		'public, s-maxage=1, stale-while-revalidate=10'
	)
	// check if user is logged in
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return {
			redirect: {
				destination: '/',
				permanent: false
			}
		};
	}

	if (Object.keys(session.user.auth_info!).includes("github")) {
		for (const gh_auth_info of Object.values(session.user.auth_info!["github"])) {
			const access_key: string = gh_auth_info['access_token'];
			axios.get("https://api.github.com/user/emails", {
				headers: {
					'Accept': 'application/vnd.github+json',
					'Authorization': `Bearer ${access_key}`
				}
			})
				.then((response: { data: GithubEmailObj[] }) => {
					const aliases = response.data.map((emailObj: GithubEmailObj) => emailObj.email);
					updateUser(session.user.id!, { aliases: aliases }).catch(err => {
						console.error(`[Profile] Could not update aliases for user (userId: ${session.user.id})`, err)
					})
				})
				.catch(err => {
					console.error(`[Profile] Error occurred while getting user emails from Github API. userId: ${session.user.id}, name: ${session.user.name}`, err);
				})
		}
	} else {
		console.warn("Github provider not present");
	}

	if (Object.keys(session.user.auth_info!).includes("bitbucket")) {
		for (const bb_auth_info of Object.values(session.user.auth_info!["bitbucket"])) {
			const access_key: string = bb_auth_info['access_token'];
			axios.get("https://api.bitbucket.org/2.0/user/emails", {
				headers: {
					'Authorization': `Bearer ${access_key}`
				}
			})
				.then((response: { data: { values: BitbucketEmailObj[] } }) => {
					const aliases = response.data.values.map((emailObj: BitbucketEmailObj) => emailObj.email);
					updateUser(session.user.id!, { aliases: aliases }).catch(err => {
						console.error(`[Profile] Could not update aliases for user (userId: ${session.user.id})`, err)
					})
				})
				.catch(err => {
					console.error(`[Profile] Error occurred while getting user emails from Bitbucket API. userId: ${session.user.id}, name: ${session.user.name}`, err.message);
				})
		}
	} else {
		console.warn("Bitbucket provider not present");
	}

	if (Object.keys(session.user.auth_info!).includes("gitlab")) {
		for (const gl_auth_info of Object.values(session.user.auth_info!["gitlab"])) {
			const access_key: string = gl_auth_info['access_token'];
			axios.get("https://gitlab.com/api/v4/user/emails", {
				headers: {
					'Authorization': `Bearer ${access_key}`
				}
			})
				.then((response: { data: GitlabEmailObj[] }) => {
					const aliases = response.data.map((emailObj: GitlabEmailObj) => emailObj.email);
					updateUser(session.user.id!, { aliases: aliases }).catch(err => {
						console.error(`[Profile] Could not update aliases for user (userId: ${session.user.id})`, err)
					})
				})
				.catch(err => {
					console.error(`[Profile] Error occurred while getting user emails from GitLab API. Endpoint: /user/emails, userId: ${session.user.id}, name: ${session.user.name}`, err.message);
				});
		}
	} else {
		console.warn("Github provider not present");
	}

	// get the list of repositories of the user
	const repo_list = await getRepoList(conn, session.user.id);

	return {
		props: {
			session,
			repo_list
		}
	}
}

export default Profile;