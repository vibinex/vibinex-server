import { Pool } from "pg";
import Link from "next/link";
import { TableCell, TableHeaderCell } from "../components/Table";
import Image from "next/image";
import { convert } from "../utils/db/converter";

const RepoList = (props: { repo_list: string[] }) => {
	const providerToLogo = (provider: string) => (
		(provider === "github") ? <Image loading="lazy" height={24} width={24} src="https://authjs.dev/img/providers/github.svg" alt="github" className="mx-auto" />
			: (provider === "bitbucket") ? <Image loading="lazy" height={24} width={24} src="/bitbucket-dark.svg" alt="bitbucket" className="mx-auto" />
				: provider
	)

	return (<>
		<h2 className="text-xl font-semibold my-2">Added Repositories</h2>
		<table className="min-w-full divide-y divide-gray-200">
			<thead>
				<tr>
					<TableHeaderCell>Repo Name</TableHeaderCell>
					<TableHeaderCell>Owner</TableHeaderCell>
					<TableHeaderCell>Provider</TableHeaderCell>
					<TableHeaderCell>Stats</TableHeaderCell>
				</tr>
			</thead>
			<tbody className="bg-white divide-y divide-gray-200">
				{props.repo_list.map(repo_addr => {
					const [provider, owner, repo_name] = repo_addr ? repo_addr.split("/") : ["", "", ""];
					return (
						<tr key={repo_addr}>
							<TableCell>{repo_name}</TableCell>
							<TableCell>{owner}</TableCell>
							<TableCell className="text-center">{providerToLogo(provider)}</TableCell>
							<TableCell className="text-primary-main"><Link href={`/repo?repo_name=${repo_addr}`}>Link</Link></TableCell>
						</tr>
					)
				}
				)}
			</tbody>
		</table>
	</>)
}

export async function getRepoList(conn: Pool, userId?: string) {
	const repo_list_q = `SELECT DISTINCT 
		c.commit_json ->> 'repo_name' AS repo_name
		FROM ` + ((!userId) ? "commits AS c" : `(SELECT 
			id,
			ENCODE(sha256(UNNEST(aliases)::bytea), 'hex') AS email_hash 
			FROM users WHERE id = ${convert(userId)}
		) AS u
		INNER JOIN commits AS c
		on u.email_hash = c.author_email`);
	const result = await conn.query(repo_list_q);
	return result.rows.map(row => row.repo_name);
}

export default RepoList;