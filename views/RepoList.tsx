import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProviderLogo from "../components/ProviderLogo";
import SwitchSubmit from "../components/SwitchSubmit";
import { TableCell, TableHeaderCell } from "../components/Table";
import type { DbRepoSerializable, RepoIdentifier } from "../types/repository";

const RepoList = () => {
	const [loading, setLoading] = useState(false);
	const [configLoading, setConfigLoading] = useState(false); // while loading user can't send another api request to change setting
	const [repoList, setRepoList] = useState<DbRepoSerializable[]>([]);

	useEffect(() => {
		setLoading(true);
		// get the list of repositories of the user
		axios.get<{ repoList: DbRepoSerializable[] }>(`/api/repoList?nonce=${Math.random()}`) // adding query parameter to bypass cache
			.then((res) => {
				if (res?.data && typeof res.data === 'object' && res.data.repoList) setRepoList(res.data.repoList);
			})
			.catch(err => {
				console.error("[RepoList] fetching repo list failed", err);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [])

	const setConfig = (repo: RepoIdentifier, configType: 'auto_assign' | 'comment', value: boolean) => {
		setConfigLoading(true);
		axios.post("/api/setRepoConfig", { repo, configType, value })
			.then(() => {
				const updatedRepoList = repoList.map(repository => {
					if (repository.repo_provider === repo.repo_provider && repository.repo_owner === repo.repo_owner && repository.repo_name === repo.repo_name) {
						return { ...repository, config: { ...repository.config, [configType]: value } };
					}
					return repository;
				});
				setRepoList(updatedRepoList);
				setConfigLoading(false);
			})
			.catch(err => {
				console.error(`[RepoList] updating config failed for this repository: ${repo.repo_provider}/${repo.repo_owner}/${repo.repo_name}`, err);
				setConfigLoading(false);
			})
	}

	if (loading) {
		return (
			<div className='border-4 border-t-primary-main rounded-full w-6 h-6 animate-spin'> </div>
		);
	}
	if (repoList.length === 0) {
		return (
			<span>No repositories added yet.</span>
		)
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
							<TableCell className="text-center"><ProviderLogo provider={repoProvider} theme="dark" className="mx-auto" /></TableCell>
							<TableCell className="text-center"><SwitchSubmit checked={config.auto_assign} toggleFunction={() => setConfig(repo_id, 'auto_assign', !config.auto_assign)} disabled={configLoading} /></TableCell>
							<TableCell className="text-center"><SwitchSubmit checked={config.comment} toggleFunction={() => setConfig(repo_id, 'comment', !config.comment)} disabled={configLoading} /></TableCell>
							<TableCell className="text-primary-main"><Link href={`/repo?repo_name=${repoAddr}`}>Link</Link></TableCell>
						</tr>
					)
				}
				)}
			</tbody>
		</table>
	</>)
}

export default RepoList;