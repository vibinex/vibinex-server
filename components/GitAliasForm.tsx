import axios from "axios";
import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { AliasMap, AliasProviderMap, HandleMap } from "../types/AliasMap";
import Button from "./Button";
import Chip from "./Chip";
import { getProviderLogoSrc } from "./ProviderLogo";

const GitAliasForm: React.FC<{ expanded: boolean }> = ({ expanded }) => {
	const [gitAliasMap, setGitAliasMap] = useState<AliasProviderMap | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [handleInputValues, setHandleInputValues] = useState<{ [key: string]: { github: string; bitbucket: string } }>({});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get<{ aliasProviderMap: AliasProviderMap }>(`/api/alias`, { params: { expanded } });
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
				setLoading(false);
			} catch (error) {
				console.error("Error fetching Git email aliases:", error);
			}
		};
		fetchData();
	}, [expanded]);

	const handleInputChange = (alias: string, provider: string, value: string) => {
		setHandleInputValues(prevState => ({
			...prevState,
			[alias]: {
				...prevState[alias],
				[provider]: value
			}
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			if (!gitAliasMap) {
				throw new Error('No new value to submit');
			}
			const updatedProviderMaps = gitAliasMap.providerMaps.map(providerMap => {
				const updatedHandleMaps = providerMap.handleMaps.map(handleMap => {
					const inputValue = handleInputValues[providerMap.alias]?.[handleMap.provider as keyof typeof handleInputValues['']];
					const updatedHandles = inputValue ? [inputValue.toString()] : [];
					return { ...handleMap, handles: updatedHandles };
				});
				return { ...providerMap, handleMaps: updatedHandleMaps };
			});

			const updatedGitAliasMap = { providerMaps: updatedProviderMaps };
			const response = await axios.post('/api/alias', { aliasProviderMap: updatedGitAliasMap }, {
				headers: {
					'Content-Type': 'application/json',
				},
			});
			if (!response) {
				throw new Error('Failed to save Git alias map');
			}
			alert("Git aliases updated successfully!");
		} catch (error) {
			console.error("Error saving Git aliases:", error);
			alert("An error occurred while saving Git aliases. Please try again.");
		}
	};

	if (loading) {
		return (<div>Loading...</div>)
	}

	if (gitAliasMap?.providerMaps && gitAliasMap.providerMaps.length > 0) {
		return (
			<div>
				{gitAliasMap.providerMaps.map((providerMap: AliasMap) => (
					<div key={providerMap.alias} className="flex border-b border-gray-300 last-of-type:border-0 w-full p-4 flex-wrap items-center">
						<p className="w-full md:w-fit md:grow break-words">{providerMap.alias}</p>
						{providerMap.handleMaps?.map((handleMap: HandleMap) => 
							handleMap.handles.map((handle: string) => (
								<Chip key={handle} name={handle} avatar={getProviderLogoSrc(handleMap.provider, "dark")} disabled={false} className="h-fit" />
							)
						))}
						<Button variant="text">
							<MdEdit className="w-6 h-6 hover:text-primary-text" />
						</Button>
					</div>
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
