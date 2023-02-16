import { Pool } from "pg";
import Button from "../components/Button";

const RepoList = (props: { repo_list: string[] }) => {
	return (<>
		<h2>All repositories in the database:</h2>
		{props.repo_list.map(repo_name => (
			<Button variant="outlined" href={`/repo?repo_name=${repo_name}`} className="m-2">
				{repo_name}
			</Button>
		))}
	</>)
}

export async function getRepoList(conn: Pool) {
	const repo_list_q = `SELECT
		distinct(commit_json ->> 'repo_name') as repo_name
		FROM devraw `;
	const result = await conn.query(repo_list_q);
	return result.rows.map(row => row.repo_name);
}

export default RepoList;