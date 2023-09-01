import { Pool } from "pg";
import Link from "next/link";
import { TableCell, TableHeaderCell } from "../components/Table";
import Image from "next/image";
import { convert } from "../utils/db/converter";
import SwitchSubmit from "../components/SwitchSubmit";
import type { Session } from "next-auth";
import { getUserRepositories } from "../utils/providerAPI/getUserRepositories";
import type { RepoIdentifier } from "../types/RepoIdentifier";
import type { RepoProvider } from "../utils/providerAPI";
import type { ReactElement } from "react";

const RepoList = (props: { repo_list: RepoIdentifier[] }) => {
	// TODO: add rudderstack events for changes in settings.

	const repoProviderLogo: { [key in RepoProvider]: ReactElement } = {
		"github": <Image loading="lazy" height={24} width={24} src="https://authjs.dev/img/providers/github.svg" alt="github" className="mx-auto" />,
		"bitbucket": <Image loading="lazy" height={24} width={24} src="/bitbucket-dark.svg" alt="bitbucket" className="mx-auto" />,
		"gitlab": <Image loading="lazy" height={24} width={24} src="https://authjs.dev/img/providers/gitlab.svg" alt="gitlab" className="mx-auto" />
	}
	const providerToLogo = (provider: RepoProvider) => (provider in repoProviderLogo) ? repoProviderLogo[provider] : provider;

	return (<>
		<h2 className="text-xl font-semibold my-2">Added Repositories</h2>
		<table className="min-w-full divide-y divide-gray-200">
			<thead>
				<tr>
					<TableHeaderCell>Repo Name</TableHeaderCell>
					<TableHeaderCell>Owner</TableHeaderCell>
					<TableHeaderCell className="text-center">Provider</TableHeaderCell>
					<TableHeaderCell className="text-center">Auto-assign</TableHeaderCell>
					<TableHeaderCell className="text-center">PR Comments</TableHeaderCell>
					<TableHeaderCell>Stats</TableHeaderCell>
				</tr>
			</thead>
			<tbody className="bg-white divide-y divide-gray-200">
				{props.repo_list.map(({ repo_provider, repo_owner, repo_name }) => {
					const repo_addr = `${repo_provider}/${repo_owner}/${repo_name}`;
					return (
						<tr key={repo_addr}>
							<TableCell>{repo_name}</TableCell>
							<TableCell>{repo_owner}</TableCell>
							<TableCell className="text-center">{providerToLogo(repo_provider)}</TableCell>
							<TableCell className="text-center"><SwitchSubmit checked={true} toggleFunction={() => { }} /></TableCell>
							<TableCell className="text-center"><SwitchSubmit checked={true} toggleFunction={() => { }} /></TableCell>
							<TableCell className="text-primary-main"><Link href={`/repo?repo_name=${repo_addr}`}>Link</Link></TableCell>
						</tr>
					)
				}
				)}
			</tbody>
		</table>
	</>)
}

export const getRepoList = async (conn: Pool, session: Session) => {
	const allRepos = await getUserRepositories(session);
	const allReposFormattedAsTuples = allRepos.map(repo => `(${convert(repo.repo_provider)}, ${convert(repo.repo_owner)}, ${convert(repo.repo_name)})`).join(',');
	const repo_list_q = `SELECT * FROM repos 
	WHERE (repo_provider, repo_owner, repo_name) IN (${allReposFormattedAsTuples})`;
	const result = await conn.query(repo_list_q);
	return result.rows.map(row => ({
		repo_provider: row.repo_provider,
		repo_owner: row.repo_owner,
		repo_name: row.repo_name
	}));
}

export default RepoList;