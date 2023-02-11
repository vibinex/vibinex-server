import MainAppBar from "../views/MainAppBar";
import conn from '../utils/db';
import { NextPage } from "next";
import { renderObjAsTable } from "../utils/data";
import { VoronoiDatum } from '@nivo/voronoi';
import Contributors2DView, { getContri2DProps } from "../views/Dashboard/contri_2d";

const RepoProfile: NextPage<{
	repo_name: string,
	contributor_2d_data: Array<VoronoiDatum>
}> = ({ repo_name, contributor_2d_data }) => {
	return (
		<>
			<MainAppBar isLoggedIn={true} />
			<p>Repository: {repo_name}</p>
			<div className="block w-96 h-96 mx-auto">
				<Contributors2DView repo_data={contributor_2d_data} />
			</div>
			<div dangerouslySetInnerHTML={{ __html: renderObjAsTable(contributor_2d_data) }}></div>
		</>
	)
}

RepoProfile.getInitialProps = async ({ query }) => {
	if (!query.repo_name) {
		console.log("No repo name received");
		return {
			repo_name: "",
			contributor_2d_data: []
		}
	}
	const repo_name = Array.isArray(query.repo_name) ? query.repo_name[0] : query.repo_name;
	const auth_vector: Array<VoronoiDatum> = await getContri2DProps(conn, repo_name);
	return {
		repo_name: repo_name,
		contributor_2d_data: auth_vector
	}
}

export default RepoProfile;