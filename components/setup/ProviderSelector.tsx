import React from 'react';
import Select from '../Select';

interface ProviderSelectorProps {
    selectedProvider: string;
    setSelectedProvider: (provider: string) => void;
}

const ProviderSelector: React.FC<ProviderSelectorProps> = ({ selectedProvider, setSelectedProvider }) => {
    const providerOptions = [
        { value: 'github', label: 'Github', disabled: false },
        { value: 'bitbucket', label: 'Bitbucket', disabled: false },
    ];

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
