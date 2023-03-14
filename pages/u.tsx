import { GetServerSideProps } from "next";
import { getServerSession, Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import LoadingOverlay from "../components/LoadingOverlay";
import MainAppBar from "../views/MainAppBar";
import { authOptions } from "./api/auth/[...nextauth]";
import { getUserByAlias, updateUser } from "../utils/db/users";
import axios from "axios";

const Profile = () => {
	const { data: session, status } = useSession();

	if (status === "loading") {
		return (<LoadingOverlay />)
	} else if (status === 'unauthenticated') {
		window.location.href = "/";
		return (<LoadingOverlay text="You are not authenticated. Redirecting..." />)
	}

	return (
		<>
			<MainAppBar />
			<p>Hi {session?.user?.name}, This is your developer profile</p>
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

export const getServerSideProps: GetServerSideProps<{ session: Session | null }> = async ({ req, res }) => {
	// check if user is logged in
	const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return { props: { session } };
	}
	if (session.user && session.user.email) {
		const userWithAlias = await getUserByAlias(session.user.email)
		if (!userWithAlias || userWithAlias.length < 1) {
			console.warn(`[Profile] No user found with this email: ${session.user.email}`);
			return { props: { session } };
		}
		if (userWithAlias.length > 1) {
			console.warn(`[Profile] Multiple users found with this email: ${session.user.email}. Names: `,
				userWithAlias.map(u => u.name).join(", "));
			return { props: { session } };
		}
		const user = userWithAlias[0];
		if (Object.keys(user.auth_info!).includes("github")) {
			const access_key: string = Object.values(user.auth_info!["github"])[0]['access_token'];
			axios.get("https://api.github.com/user/emails", {
				headers: {
					'Accept': 'application/vnd.github+json',
					'Authorization': `Bearer ${access_key}`
				}
			})
				.then((response: { data: GithubEmailObj[] }) => {
					const aliases = response.data.map((emailObj: GithubEmailObj) => emailObj.email);
					updateUser(user.id!, { aliases: aliases }).catch(err => {
						console.error(`[Profile] Could not update aliases for user (userId: ${user.id})`, err)
					})
				})
		} else {
			console.warn("Github provider not present");
			return { props: { session } };
		}
	}
	return { props: { session } }
}

export default Profile;