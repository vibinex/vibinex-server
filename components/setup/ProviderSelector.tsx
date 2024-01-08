import React from 'react';
import Select from '../Select';

interface ProviderSelectorProps {
    selectedProvider: string;
    setSelectedProvider: (provider: string) => void;
    providerOptions: { value: string, label: string, disabled?: boolean }[];
}

const ProviderSelector: React.FC<ProviderSelectorProps> = ({ providerOptions, selectedProvider, setSelectedProvider }) => {
    return (
        <Select
            optionsType="Provider"
            options={providerOptions}
            onValueChange={setSelectedProvider}
            defaultValue={selectedProvider}
            className='w-1/2 font-normal'
        />
    );
};

export default ProviderSelector;
