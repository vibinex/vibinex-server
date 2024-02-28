import { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth/core/types";
import { useContext, useEffect } from "react";
import Button from "../components/Button";
import Footer from "../components/Footer";
import GitAliasForm from "../components/GitAliasForm";
import RudderContext from "../components/RudderContext";
import type { DbRepoSerializable } from "../types/repository";
import { getAuthUserId, getAuthUserName } from "../utils/auth";
import { updateUser, createUpdateUserObj } from "../utils/db/users";
import { getEmailAliases } from "../utils/providerAPI/getEmailAliases";
import { getAndSetAnonymousIdFromLocalStorage } from "../utils/rudderstack_initialize";
import { getURLWithParams } from "../utils/url_utils";
import MainAppBar from "../views/MainAppBar";
import RepoList, { getRepoList } from "../views/RepoList";
import { authOptions } from "./api/auth/[...nextauth]";
import { updateAliasesTableFromUsersTableOnLogin } from "../utils/db/aliases";

type ProfileProps = {
	sessionObj: Session,
	repoList: DbRepoSerializable[],
}

const Profile: NextPage<ProfileProps> = ({ sessionObj: session, repoList }) => {
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
				<GitAliasForm expanded={false} />
				<RepoList repoList={repoList} />
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
				destination: getURLWithParams('/api/auth/signin', {
					callbackUrl: `${process.env.NEXTAUTH_URL}/u`
				}),
				permanent: false
			}
		};
	}

	getEmailAliases(session).then(async (aliases) => {
		const updatedUserObj = await createUpdateUserObj(session.user.id!, { aliases: aliases }).catch(err => {
			console.error(`[createUpdateUserObj] Something went wrong`, err);
		});
		if (!updatedUserObj || Object.keys(updatedUserObj).length == 0) return;
		updateUser(session.user.id!, { aliases: aliases }, updatedUserObj).catch(err => {
			console.error(`[Profile] Could not update aliases for user (userId: ${session.user.id})`, err)
		})
		updateAliasesTableFromUsersTableOnLogin(updatedUserObj).catch(err => {
			console.error(`[updateAliasesTableFromUsersTableOnLogin] could not update aliases table from users table on login for userId: ${session.user.id}`, err);
		})
	})

	// get the list of repositories of the user
	const repoList = await getRepoList(session);

	return {
		props: {
			sessionObj: session,
			repoList
		}
	}
}

export default Profile;