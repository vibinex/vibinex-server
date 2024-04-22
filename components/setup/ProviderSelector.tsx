import React from 'react';
import type { RepoProvider } from '../../utils/providerAPI';
import Select from '../Select';

interface ProviderSelectorProps {
	selectedProvider?: RepoProvider;
	setSelectedProvider: (provider: RepoProvider) => void;
	providerOptions: { value: RepoProvider, label: string, disabled?: boolean }[];
}

const ProviderSelector: React.FC<ProviderSelectorProps> = ({ providerOptions, selectedProvider, setSelectedProvider }) => {
	return (
		<Select<RepoProvider>
			optionsType= "Provider"
			options = { providerOptions }
			onValueChange = { setSelectedProvider }
			defaultValue = { selectedProvider }
			className = 'w-1/2 font-normal'
		/>
	);
};

export default ProviderSelector;
