"use client"

import axios from 'axios';
import { useState } from 'react';
import { MdDone, MdEdit } from 'react-icons/md';
import type { AliasMap, HandleMap } from '../types/AliasMap';
import type { RepoProvider } from '../utils/providerAPI';
import Button from './Button';
import Chip from './Chip';
import ChipInput, { ChipData } from './ChipInput';
import { getProviderLogoSrc } from './ProviderLogo';

const GitAliasListItem = ({ providerMap, setProviderMap }: { providerMap: AliasMap, setProviderMap: (providerMap: AliasMap) => void }) => {
	const [editMode, setEditMode] = useState(false);
	const [inputHandleMap, setInputHandleMap] = useState<HandleMap[]>(providerMap.handleMaps);
	const [loading, setLoading] = useState<boolean>(false);
	const [errorMsg, setErrorMsg] = useState<string>("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setErrorMsg("");
		try {
			const updatedAliasMap: AliasMap = {
				alias: providerMap.alias,
				handleMaps: inputHandleMap.map(handleMap => ({
					provider: handleMap.provider,
					handles: handleMap.handles.filter(handle => handle !== '') // Remove empty handles,
				}))
			}

			const response = await axios.post('/api/alias', { aliasHandleMap: updatedAliasMap }, {
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

	const abort = () => {
		setEditMode(false);
		setErrorMsg("");
	};

	const handleAdd = (provider: RepoProvider) => (chipData: ChipData) => {
		// Get current value and split into array 
		const updatedHandleInputValues = inputHandleMap.map(handleInputValue => {
			if (handleInputValue.provider !== provider) return handleInputValue;

			// check if the new value is a duplicate
			const isDuplicate = handleInputValue.handles.some(handle => handle === chipData.text);
			if (isDuplicate) {
				console.warn('Duplicate values are not allowed');
				return handleInputValue;
			}
			return { ...handleInputValue, handles: [...handleInputValue.handles, chipData.text] };
		});
		setInputHandleMap(updatedHandleInputValues);
	};

	const handleRemove = (provider: RepoProvider) => (chipData: ChipData) => {
		// remove the last value from the handles list
		const updatedHandleInputValues = inputHandleMap.map(handleInputValue => {
			if (handleInputValue.provider !== provider) return handleInputValue;
			
			// check if the value doesn't exist
			const isValueInHandles = handleInputValue.handles.some(handle => handle === chipData.text);
			if (!isValueInHandles) {
				console.warn('Value does not exist in handles list');
				return handleInputValue;
			}
			return { ...handleInputValue, handles: handleInputValue.handles.filter((handle) => handle !== chipData.text) };
		});
		setInputHandleMap(updatedHandleInputValues);
	};

	return (
		<div key={providerMap.alias} className="flex border-b border-gray-300 last-of-type:border-0 w-full p-4 flex-wrap items-center">
			<p className="w-full md:w-fit md:grow break-words">{providerMap.alias}</p>
			{(editMode) ? (
				<form
					onSubmit={handleSubmit}
					className="grow flex flex-wrap items-end gap-2 justify-end"
					onKeyDown={(e) => e.key === 'Escape' && abort()}
				>
					{providerMap.handleMaps.map(handleMap => (
						<div key={handleMap.provider} className='grow relative mt-2'>
							<ChipInput
								onAdd={handleAdd(handleMap.provider)}
								onRemove={handleRemove(handleMap.provider)}
								defaultValues={inputHandleMap.find(inputValue => inputValue.provider === handleMap.provider)?.handles.map(handle => (
									{ text: handle, avatar: getProviderLogoSrc(handleMap.provider, "dark") }
								))}
								placeholder={`${handleMap.provider} handles`}
								getAvatarFromValue={(_) => getProviderLogoSrc(handleMap.provider, "dark")}
								disabled={loading}
							/>
							<label htmlFor={`${handleMap.provider}-handles`} className="absolute -top-2 left-2 text-xs px-1 bg-popover">
								{handleMap.provider.charAt(0).toUpperCase() + handleMap.provider.slice(1) + " handles"}
							</label>
						</div>
					))}
					<Button title='Save' variant="contained" type="submit" className='grow-0 !p-2 my-auto' disabled={loading}>
						<MdDone className="w-7 h-7 hover:text-primary-text" />
					</Button>
				</form>
			) : (<>
				{providerMap.handleMaps?.map((handleMap: HandleMap) =>
					handleMap.handles.map((handle: string) => (
						<Chip key={handle} name={handle} avatar={getProviderLogoSrc(handleMap.provider, "dark")} disabled={false} className="h-fit" />
					)))
				}
				<Button title='Edit' variant="text" onClick={() => setEditMode(true)}>
					<MdEdit className="w-6 h-6 hover:text-primary-text" />
				</Button>
			</>)}
			{errorMsg && <p className="text-red-500 w-full text-end text-sm">{errorMsg}</p>}
		</div>
	);
};

export default GitAliasListItem;