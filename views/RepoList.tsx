import axios from "axios";
import type { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useState, type ReactElement } from "react";
import SwitchSubmit from "../components/SwitchSubmit";
import { TableCell, TableHeaderCell } from "../components/Table";
import type { DbRepo, DbRepoSerializable, RepoIdentifier } from "../types/repository";
import { getRepos } from "../utils/db/repos";
import type { RepoProvider } from "../utils/providerAPI";
import { getUserRepositories } from "../utils/providerAPI/getUserRepositories";

const RepoList = (props: { repoList: DbRepoSerializable[] }) => {
	const [loading, setLoading] = useState(false); // while loading user can't send another api request to change setting
	const [repoList, setRepoList] = useState(props.repoList);

	const repoProviderLogo: { [key in RepoProvider]: ReactElement } = {
		"github": <Image loading="lazy" height={24} width={24} src="https://authjs.dev/img/providers/github.svg" alt="github" className="mx-auto" />,
		"bitbucket": <Image loading="lazy" height={24} width={24} src="/bitbucket-dark.svg" alt="bitbucket" className="mx-auto" />,
		"gitlab": <Image loading="lazy" height={24} width={24} src="https://authjs.dev/img/providers/gitlab.svg" alt="gitlab" className="mx-auto" />
	}
	const providerToLogo = (provider: RepoProvider) => (provider in repoProviderLogo) ? repoProviderLogo[provider] : provider;

	const setConfig = (repo: RepoIdentifier, configType: 'auto_assign' | 'comment', value: boolean) => {
		setLoading(true);
		axios.post("/api/setRepoConfig", { repo, configType, value })
			.then(() => {
				const updatedRepoList = repoList.map(repository => {
					if (repository.repo_provider === repo.repo_provider && repository.repo_owner === repo.repo_owner && repository.repo_name === repo.repo_name) {
						return { ...repository, config: { ...repository.config, [configType]: value } };
					}
					return repository;
				});
				setRepoList(updatedRepoList);
				setLoading(false);
			})
			.catch(err => {
				console.error(`[RepoList] updating config failed for this repository: ${repo.repo_provider}/${repo.repo_owner}/${repo.repo_name}`, err);
				setLoading(false);
			})
	}

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
				{repoList.map(({ repo_provider: repoProvider, repo_owner: repoOwner, repo_name: repoName, config }) => {
					const repoAddr = `${repoProvider}/${repoOwner}/${repoName}`;
					const repo_id: RepoIdentifier = {
						repo_provider: repoProvider,
						repo_owner: repoOwner,
						repo_name: repoName
					}
					return (
						<tr key={repoAddr}>
							<TableCell>{repoName}</TableCell>
							<TableCell>{repoOwner}</TableCell>
							<TableCell className="text-center">{providerToLogo(repoProvider)}</TableCell>
							<TableCell className="text-center"><SwitchSubmit checked={config.auto_assign} toggleFunction={() => setConfig(repo_id, 'auto_assign', !config.auto_assign)} disabled={loading} /></TableCell>
							<TableCell className="text-center"><SwitchSubmit checked={config.comment} toggleFunction={() => setConfig(repo_id, 'comment', !config.comment)} disabled={loading} /></TableCell>
							<TableCell className="text-primary-main"><Link href={`/repo?repo_name=${repoAddr}`}>Link</Link></TableCell>
						</tr>
					)
				}
				)}
			</tbody>
		</table>
	</>)
}

export const getRepoList = async (session: Session): Promise<DbRepoSerializable[]> => {
	const userReposFromProvider = await getUserRepositories(session).catch((err): RepoIdentifier[] => {
		console.error(`[RepoList] getRepos for the user from the providers failed for user: ${session.user.id} (Name: ${session.user.name})`, err);
		return [];
	});;
	const userReposFromDb = await getRepos(userReposFromProvider).catch((err): DbRepo[] => {
		console.error(`[RepoList] getRepos for the user from the database failed for user: ${session.user.id} (Name: ${session.user.name})`, err);
		return [];
	});
	return userReposFromDb.map(repo => {
		const { created_at, ...other } = repo;
		return { created_at: created_at.toDateString(), ...other }
	});
}

export default RepoList;