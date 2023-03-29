import { Pool } from "pg";
import Button from "../components/Button";

const RepoList = (props: { repo_list: string[] }) => {
	return (<>
		<h2>All repositories in the database:</h2>
		{props.repo_list.map(repo_name => (
			<Button variant="outlined" href={`/repo?repo_name=${repo_name}`} className="m-2" key={repo_name}>
				{repo_name}
			</Button>
		))}
	</>)
}

export async function getRepoList(conn: Pool, userId?: number) {
	const repo_list_q = `SELECT DISTINCT 
		c.commit_json ->> 'repo_name' AS repo_name
		FROM ` + ((!userId) ? "commits AS c" : `(SELECT 
			id,
			ENCODE(sha256(UNNEST(aliases)::bytea), 'hex') AS email_hash 
			FROM users WHERE id = ${userId}
		) AS u
		INNER JOIN commits AS c
		on u.email_hash = c.author_email`);
	const result = await conn.query(repo_list_q);
	return result.rows.map(row => row.repo_name);
}

export default RepoList;