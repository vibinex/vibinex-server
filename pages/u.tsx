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

const Profile = ({ sessionObj: session }: { sessionObj: Session }) => {
	useEffect(() => {
		rudderEventMethods().then((response) => {
			response?.page("", "Repo Profile Page", {
				userId: getAuthUserId(session),
				name: getAuthUserName(session)
			});
		});
	}, [session])

	return (
		<>
			<MainAppBar />
			<p>Hi {getAuthUserName(session)}, This is your developer profile</p>
			<p>
				To add metadata for more repositories, visit the
				<Link href={"/upload"} className="text-primary-main"> upload page</Link>
			</p>
		</>
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

export const getServerSideProps: GetServerSideProps<{ sessionObj: Session }> = async ({ req, res }) => {
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
	return { props: { sessionObj: session } }
}

export default Profile;