import { Pool } from "pg";
import Link from "next/link";

const RepoList = (props: { repo_list: string[] }) => {
	return (<>
		<h2 className="text-xl font-semibold my-2">Added Repositories</h2>
		<table className="min-w-full divide-y divide-gray-200">
			<thead>
				<tr>
					<th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repo Name</th>
					<th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
					<th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
					<th className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
				</tr>
			</thead>
			<tbody className="bg-white divide-y divide-gray-200">
				{props.repo_list.map(repo_addr => {
					const [provider, owner, repo_name] = repo_addr ? repo_addr.split("/") : ["", "", ""];
					return (
						<tr key={repo_addr}>
							<td className="px-6 py-4 whitespace-nowrap">{repo_name}</td>
							<td className="px-6 py-4 whitespace-nowrap">{owner}</td>
							<td className="px-6 py-4 whitespace-nowrap">{provider}</td>
							<td className="px-6 py-4 whitespace-nowrap text-primary-main"><Link href={`/repo?repo_name=${repo_addr}`}>Link</Link></td>
						</tr>
					)
				}
				)}
			</tbody>
		</table>
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