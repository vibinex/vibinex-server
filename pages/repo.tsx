import MainAppBar from "../views/MainAppBar";
import conn from '../utils/db';
import { NextPage } from "next";
import React from "react";
import { renderObjAsTable } from "../utils/data";
import { ContributorVector } from "../types/contributor";
import Contributors2DView, { getContri2DProps } from "../views/Dashboard/contri_2d";
import CommitsPerFile from "../views/Dashboard/commitsPerFile";
import RepoList, { getRepoList } from "../views/RepoList";
import { rudderEventMethods } from "../utils/rudderstack_initialize";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import { Session } from "next-auth/core/types";
import { getAuthUserName } from "../utils/auth";

const RepoProfile: NextPage<{
	session: Session | null,
	repo_list?: string[],
	repo_name?: string,
	contributor_2d_data?: Array<ContributorVector>
}> = ({ repo_list, repo_name, contributor_2d_data }) => {
	const { data: session } = useSession();
	React.useEffect(() => {
		const properties = (session) ? {
			name: getAuthUserName(session)
		} : {
			anonymousId: localStorage.getItem("AnonymousId")
		};
		rudderEventMethods().then((response) => {
			response?.page("", "Repo Profile Page", properties);
		});
		if (!session) {
			window.location.href = "/";
		}
	}, []);
	return (
		<div className='h-[50rem] w-[90%] m-auto'>
			<MainAppBar />
			{(session && repo_name && contributor_2d_data) ? (<>
				<div className='border-2 mt-10 p-2 rounded-md border-blue-200 text-[20px]'>
					<h3> <span>Repo Name : </span>{repo_name}</h3>
					<h1><span>Owned by : </span>Vibinex</h1>
				</div>
				<CommitsPerFile />
				<div className="block w-96 h-96 mx-auto">
					<Contributors2DView repo_data={contributor_2d_data} />
				</div>
				<div dangerouslySetInnerHTML={{ __html: renderObjAsTable(contributor_2d_data) }}></div>
			</>) : (session && repo_list) ? (
				<div className="max-w-[80%] mx-auto">
					<RepoList repo_list={repo_list} />
				</div>
			) : (session) ? (
				<p>Something went wrong</p>
			) : (<>
				<p>You are not authenticated. Redirecting...</p>
			</>)
			}
		</div >
	)
}

RepoProfile.getInitialProps = async ({ req, res, query }) => {
	// check if user is logged in
	const session = await getServerSession(req, res, authOptions);

	// if info is requested for a specific repository
	if (query.repo_name) {
		const repo_name = Array.isArray(query.repo_name) ? query.repo_name[0] : query.repo_name;
		const contributor_vector: Array<ContributorVector> = await getContri2DProps(conn, repo_name);
		if (contributor_vector.length > 0)
			return {
				session: session,
				repo_name: repo_name,
				contributor_2d_data: contributor_vector
			}
		else
			console.warn(`No data found for repository named ${repo_name}`);
	} else {
		console.debug("No repo name received");
	}

	// by default, show the list of repositories of the user
	const repo_list = await getRepoList(conn);
	return {
		session: session,
		repo_list: repo_list
	}
}

export default RepoProfile;