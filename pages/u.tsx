import { GetServerSideProps } from "next";
import { getServerSession, Session } from "next-auth";
import MainAppBar from "../views/MainAppBar";
import { authOptions } from "./api/auth/[...nextauth]";
import { updateUser } from "../utils/db/users";
import { useEffect, useContext } from "react";
import RudderContext from "../components/RudderContext";
import { getAuthUserId, getAuthUserName } from "../utils/auth";
import RepoList, { getRepoList } from "../views/RepoList";
import conn from "../utils/db";
import Footer from "../components/Footer";
import { useSession } from "next-auth/react";
import Button from "../components/Button";
import { getAndSetAnonymousIdFromLocalStorage } from "../utils/rudderstack_initialize";
import { getEmailAliases } from "../utils/providerAPI/getEmailAliases";
import type { RepoIdentifier } from "../types/RepoIdentifier";

type ProfileProps = {
	session: Session,
	repo_list: RepoIdentifier[],
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

	getEmailAliases(session).then((aliases) => {
		updateUser(session.user.id!, { aliases: aliases }).catch(err => {
			console.error(`[Profile] Could not update aliases for user (userId: ${session.user.id})`, err)
		})
	})

	// get the list of repositories of the user
	const repo_list = await getRepoList(conn, session);

	return {
		props: {
			session,
			repo_list
		}
	}
}

export default Profile;