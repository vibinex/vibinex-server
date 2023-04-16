import { GetServerSideProps } from "next";
import { getServerSession, Session } from "next-auth";
import Link from "next/link";
import MainAppBar from "../views/MainAppBar";
import { authOptions } from "./api/auth/[...nextauth]";
import { updateUser } from "../utils/db/users";
import axios from "axios";
import { useEffect } from "react";
import { rudderEventMethods } from "../utils/rudderstack_initialize";
import { getAuthUserId, getAuthUserName } from "../utils/auth";
import RepoList, { getRepoList } from "../views/RepoList";
import conn from "../utils/db";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";

type ProfileProps = {
	session: Session,
	repo_list: string[],
}

const Profile = ({ repo_list }: ProfileProps) => {
	const session: Session | null = useSession().data;
	useEffect(() => {
		rudderEventMethods().then((response) => {
			response?.page("", "Repo Profile Page", {
				userId: getAuthUserId(session),
				name: getAuthUserName(session)
			});
		});
	}, [session])

	return (
		<div className="flex flex-col min-h-screen">
			<MainAppBar />
			<div className="max-w-[80%] mx-auto flex-grow">
				<p>Hi {getAuthUserName(session)},</p>
				<RepoList repo_list={repo_list} />
				<p>
					To add metadata for more repositories, visit the
					<Link href={"/docs/setup"} className="text-primary-main"> instructions page</Link>
				</p>
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