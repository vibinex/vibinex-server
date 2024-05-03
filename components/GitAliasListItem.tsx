"use client"

import axios from 'axios';
import { useState } from 'react';
import { MdDone, MdEdit } from 'react-icons/md';
import type { AliasMap, AliasProviderMap, HandleMap } from '../types/AliasMap';
import type { RepoProvider } from '../utils/providerAPI';
import Button from './Button';
import Chip from './Chip';
import { getProviderLogoSrc } from './ProviderLogo';

const GitAliasListItem = ({ providerMap, setProviderMap }: { providerMap: AliasMap, setProviderMap: (providerMap: AliasMap) => void }) => {
	const [editMode, setEditMode] = useState(false);
	const [inputHandleMap, setInputHandleMap] = useState<HandleMap[]>(providerMap.handleMaps);
	const [loading, setLoading] = useState<boolean>(false);
	const [errorMsg, setErrorMsg] = useState<string>("");

	const handleInputChange = (provider: RepoProvider, value: string) => {
		const handlesList = value.split(",").map(handle => handle.trim());
		const updatedHandleInputValues = inputHandleMap.map(handleInputValue => {
			if (handleInputValue.provider !== provider) return handleInputValue;
			return { ...handleInputValue, handles: handlesList };
		});
		setInputHandleMap(updatedHandleInputValues);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setErrorMsg("");
		try {
			const updatedAliasMap: AliasMap = {
				alias: providerMap.alias,
				handleMaps: inputHandleMap
			}

			const updatedGitAliasMap: AliasProviderMap = { providerMaps: [updatedAliasMap] };
			const response = await axios.post('/api/alias', { aliasProviderMap: updatedGitAliasMap }, {
				headers: {
					'Content-Type': 'application/json',
				},
			});
			if (!response || response.status !== 200) {
				throw new Error('Failed to save Git alias map');
			}
			// success
			setProviderMap(updatedAliasMap);
			setEditMode(false);
		} catch (error) {
			console.error("Error saving Git aliases:", error);
			setErrorMsg("An error occurred while saving Git aliases. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div key={providerMap.alias} className="flex border-b border-gray-300 last-of-type:border-0 w-full p-4 flex-wrap items-center">
			<p className="w-full md:w-fit md:grow break-words">{providerMap.alias}</p>
			{(editMode) ? (
				<form
					onSubmit={handleSubmit}
					onKeyDown={(e) => {
						if (e.key === 'Escape') {
							e.preventDefault();
							setEditMode(false);
							setErrorMsg("");
						}
					}}
					className="grow flex flex-wrap items-end gap-2 justify-end"
				>
					{providerMap.handleMaps.map(handleMap => (
						<div key={handleMap.provider} className='grow relative mt-2'>
							<input
								id={`${handleMap.provider}-handles`}
								type="text"
								value={inputHandleMap.find(inputValue => inputValue.provider === handleMap.provider)?.handles.join(',') ?? ''}
								placeholder={`${handleMap.provider} handles`}
								onChange={(e) => handleInputChange(handleMap.provider, e.target.value)}
								disabled={loading}
								className="w-full"
							/>
							<label htmlFor={`${handleMap.provider}-handles`} className="absolute -top-2 left-2 text-xs px-1 bg-popover">
								{handleMap.provider.charAt(0).toUpperCase() + handleMap.provider.slice(1) + " handles"}
							</label>
						</div>
					))}
					<Button variant="contained" type="submit" className='grow-0 !p-2' disabled={loading}>
						<MdDone className="w-7 h-7 hover:text-primary-text" />
					</Button>
				</form>
			) : (<>
				{providerMap.handleMaps?.map((handleMap: HandleMap) =>
					handleMap.handles.map((handle: string) => (
						<Chip key={handle} name={handle} avatar={getProviderLogoSrc(handleMap.provider, "dark")} disabled={false} className="h-fit" />
					)))
				}
				<Button variant="text" onClick={() => setEditMode(true)}>
					<MdEdit className="w-6 h-6 hover:text-primary-text" />
				</Button>
			</>)}
			{errorMsg && <p className="text-red-500 w-full text-end text-sm">{errorMsg}</p>}
		</div>
	);
};

export default GitAliasListItem;