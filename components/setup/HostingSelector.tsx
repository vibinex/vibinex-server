import React from 'react';
import Select from '../Select';

interface HostingSelectorProps {
    selectedHosting: string;
    setSelectedHosting: (hosting: string) => void;
}

const HostingSelector: React.FC<HostingSelectorProps> = ({ selectedHosting, setSelectedHosting }) => {
    const hostingOptions = [
        { value: 'cloud', label: 'Vibinex Cloud' },
        { value: 'selfhosting', label: 'Self-hosting' },
    ];

    return (
        <Select
            optionsType='Hosting option'
            options={hostingOptions}
            onValueChange={setSelectedHosting}
            defaultValue={selectedHosting}
            className='w-1/2 font-normal'
        />
    );
};

export default HostingSelector;
