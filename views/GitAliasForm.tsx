import axios from "axios";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import GitAliasListItem from "../components/GitAliasListItem";
import { useToast } from "../components/Toast/use-toast";
import { AliasMap, AliasProviderMap } from "../types/AliasMap";

const GitAliasForm: React.FC<{ expanded: boolean }> = ({ expanded }) => {
	const { toast } = useToast();
	const [gitAliasMap, setGitAliasMap] = useState<AliasProviderMap | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const setProviderMap = (providerMap: AliasMap) => {
		setGitAliasMap(prevMap => prevMap ? (
			{
				...prevMap,
				providerMaps: prevMap.providerMaps.map(map => map.alias === providerMap.alias ? providerMap : map)
			}) : (
			{ providerMaps: [providerMap] }
		));
	};

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.get<{ aliasProviderMap: AliasProviderMap }>(`/api/alias`, {
				params: { expanded },
				headers: { 'Cache-Control': 'no-cache' }
			});
			if (!response.data?.aliasProviderMap) {
				throw new Error('Failed to fetch Git email aliases');
			}
			const aliasProviderMap = response.data.aliasProviderMap;
			aliasProviderMap.providerMaps.sort((a: AliasMap, b: AliasMap) => {
				// First show all aliases without handles, then sort alphabetically
				const aHasHandles = a.handleMaps.flatMap(handleMap => handleMap.handles).length !== 0;
				const bHasHandles = b.handleMaps.flatMap(handleMap => handleMap.handles).length !== 0;
				if (aHasHandles !== bHasHandles) {
					return (aHasHandles > bHasHandles) ? 1 : -1;
				}
				return a.alias.localeCompare(b.alias);
			})
			setGitAliasMap(aliasProviderMap);
		};
		fetchData().catch((error) => {
			console.error("Error fetching Git email aliases:", error);
			toast({
				description: error?.message ?? 'Failed to fetch Git email aliases',
				variant: "destructive",
			});
		}).finally(() => {
			setLoading(false);
		});
	}, [expanded]);

	if (loading) {
		return (<div>Loading...</div>)
	}

	if (gitAliasMap?.providerMaps && gitAliasMap.providerMaps.length > 0) {
		return (
			<div>
				{gitAliasMap.providerMaps.map((providerMap: AliasMap) => (
					<GitAliasListItem key={providerMap.alias} providerMap={providerMap} setProviderMap={setProviderMap} />
				))}
				{!expanded && (
					<Button variant="outlined" className="w-full my-2" href="/settings">View all aliases</Button>
				)}
			</div>
		)
	}
	if (expanded) {
		return (
			<div className="h-screen-1/2 text-primary-text flex flex-col items-center justify-center" >
				<p className="font-bold text-lg">No aliases found</p>
				<p>Please setup a repository from this account to view aliases</p>
			</div>
		)
	}
	return (<></>)
};

export default GitAliasForm;
