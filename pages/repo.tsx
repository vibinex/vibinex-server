import { GetServerSideProps, NextPage } from "next";
import type { Session } from "next-auth/core/types";
import { getServerSession } from "next-auth/next";
import React from "react";
import Footer from "../components/Footer";
import RudderContext from "../components/RudderContext";
import { ContributorVector } from "../types/contributor";
import { getAuthUserId, getAuthUserName } from "../utils/auth";
import { renderObjAsTable } from "../utils/data";
import conn from '../utils/db';
import { getAndSetAnonymousIdFromLocalStorage } from "../utils/rudderstack_initialize";
import CommitsPerFile from "../views/Dashboard/commitsPerFile";
import Contributors2DView, { getContri2DProps } from "../views/Dashboard/contri_2d";
import MainAppBar from "../views/MainAppBar";
import RepoList from "../views/RepoList";
import { authOptions } from "./api/auth/[...nextauth]";

type RepoProfileData = {
	sessionObj: Session,
	repoName?: string,
	contributor_2d_data?: Array<ContributorVector>
}

const RepoProfile: NextPage<RepoProfileData> = ({ sessionObj: session, repoName: repoAddr, contributor_2d_data }) => {
	const { rudderEventMethods } = React.useContext(RudderContext);
	React.useEffect(() => {
		const anonymousId = getAndSetAnonymousIdFromLocalStorage()
		rudderEventMethods?.track(getAuthUserId(session), "Repo profile page", { name: getAuthUserName(session) }, anonymousId);
	}, [rudderEventMethods, session]);

	const [repoProvider, repoOwner, repoName] = repoAddr ? repoAddr.split("/") : ["", "", ""];
	return (
		<>
			<MainAppBar />
			<div className='min-h-[50rem] w-[90%] m-auto'>
				{(repoName && contributor_2d_data) ? (<>
					<div className='border-2 mt-10 p-2 rounded-md border-blue-200 text-[20px]'>
						<h3><span>Repo Name: </span>{repoName}</h3>
						<h2><span>Owned by: </span>{repoOwner}</h2>
						<h2><span>Hosted on: </span>{repoProvider}</h2>
					</div>
					<CommitsPerFile />
					<div className="block w-96 h-96 mx-auto">
						<Contributors2DView repo_data={contributor_2d_data} />
					</div>
					<div dangerouslySetInnerHTML={{ __html: renderObjAsTable(contributor_2d_data) }}></div>
				</>) : (
					<div className="max-w-[80%] mx-auto">
						<RepoList />
					</div>
				)}
			</div >
			<Footer />
		</>
	)
}

export const getServerSideProps: GetServerSideProps<RepoProfileData> = async ({ req, res, query }) => {
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

	// if info is requested for a specific repository
	if (query.repo_name) {
		const repoName = Array.isArray(query.repo_name) ? query.repo_name[0] : query.repo_name;
		const contributorVector: Array<ContributorVector> = await getContri2DProps(conn, repoName);
		if (contributorVector.length > 0)
			return {
				props: {
					sessionObj: session,
					repoName: repoName,
					contributor_2d_data: contributorVector
				}
			}
		else
			console.warn(`No data found for repository named ${repoName}`);
	} else {
		console.debug("No repo name received");
	}

	return {
		props: { sessionObj: session }
	}
}

export default RepoProfile;