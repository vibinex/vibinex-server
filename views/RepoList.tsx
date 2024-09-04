import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProviderLogo from "../components/ProviderLogo";
import SwitchSubmit from "../components/SwitchSubmit";
import { TableCell, TableHeaderCell } from "../components/Table";
import type { DbRepoSerializable, RepoIdentifier } from "../types/repository";
import { getPreferredTheme, Theme } from "../utils/theme";
import { RepoConfigDbMap, RepoConfigDisplayMap, RepoConfigOptions } from "../types/RepoConfig";
import { useToast } from "../components/Toast/use-toast";

const RepoList = () => {
	const [loading, setLoading] = useState(false);
	const [configLoading, setConfigLoading] = useState(false); // while loading user can't send another api request to change setting
	const [repoList, setRepoList] = useState<DbRepoSerializable[]>([]);
	const [theme, setTheme] = useState<Theme>('light')
	const { toast } = useToast();

	useEffect(() => {
		setLoading(true);
		// get the list of repositories of the user
		axios.get<{ repoList: DbRepoSerializable[] }>(`/api/repoList?nonce=${Math.random()}`) // adding query parameter to bypass cache
			.then((res) => {
				if (res?.data && typeof res.data === 'object' && res.data.repoList) setRepoList(res.data.repoList);
			})
			.catch(err => {
				console.error("[RepoList] fetching repo list failed", err);
				toast({
					description: "Failed to fetch repositories",
					variant: "error",
				});
			})
			.finally(() => {
				setLoading(false);
			});

		setTheme(getPreferredTheme());
	}, [])

	const setConfig = (repo: RepoIdentifier, configType: RepoConfigOptions, value: boolean) => {
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
				toast({
					description: `Failed to update ${configType} configuration for ${repo.repo_name}`,
					variant: "error",
				});
				setConfigLoading(false);
			})
	}

	if (loading) {
		return (
			<div className='border-4 border-t-secondary rounded-full w-6 h-6 animate-spin'> </div>
		);
	}
	if (repoList.length === 0) {
		return (
			<span>No repositories added yet.</span>
		)
	}
	return (<>
		<h2 className="text-xl font-semibold my-2">Added Repositories</h2>
		<div className="w-full overflow-x-auto">
			<table className="min-w-full divide-y divide-border">
				<thead>
					<tr>
						<TableHeaderCell>Repo Name</TableHeaderCell>
						<TableHeaderCell>Owner</TableHeaderCell>
						<TableHeaderCell className="text-center">Provider</TableHeaderCell>
						{Object.entries(RepoConfigDisplayMap).map(([configType, configName]) => (
							<TableHeaderCell key={configType} className="text-center">{configName}</TableHeaderCell>
						))}
						<TableHeaderCell>Stats</TableHeaderCell>
					</tr>
				</thead>
				<tbody className="bg-background divide-y divide-border">
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
								<TableCell className="text-center"><ProviderLogo provider={repoProvider} theme={theme} className="mx-auto" /></TableCell>
								{(Object.keys(RepoConfigDbMap) as RepoConfigOptions[]).map((configOption: RepoConfigOptions) => {
									return (
										<TableCell className="text-center" key={configOption}>
											<SwitchSubmit checked={config[configOption]} toggleFunction={() => setConfig(repo_id, configOption, !config[configOption])} disabled={configLoading} />
										</TableCell>
									)
								})}
								<TableCell className="text-secondary"><Link href={`/repo?repo_name=${repoAddr}`}>Link</Link></TableCell>
							</tr>
						)
					}
					)}
				</tbody>
			</table>
		</div>
	</>)
}

export default RepoList;