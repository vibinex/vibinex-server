import React from 'react';
import Select from '../Select';

interface InstallationSelectorProps {
    selectedInstallation: string;
    setSelectedInstallation: (installation: string) => void;
}

const InstallationSelector: React.FC<InstallationSelectorProps> = ({ selectedInstallation, setSelectedInstallation }) => {
    const installationOptions = [
        { value: 'individual', label: 'Individual' },
        { value: 'project', label: 'Project' },
    ];

    return (
        <Select
            optionsType='Installation Type'
            options={installationOptions}
            onValueChange={setSelectedInstallation}
            defaultValue={selectedInstallation}
            className='w-1/2 font-normal'
        />
    );
};

export default InstallationSelector;