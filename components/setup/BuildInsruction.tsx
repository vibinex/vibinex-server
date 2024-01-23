import axios from 'axios';
import React, { useState } from 'react';
import { CloudBuildStatus } from '../../utils/pubsub/pubsubClient';
import Button from '../Button';
import CodeWithCopyButton from './CodeWithCopyButton';

interface BuildInstructionProps {
    selectedHosting: string;
    userId: string;
}

const BuildInstruction: React.FC<BuildInstructionProps> = ({ selectedHosting, userId }) => {
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
    const [buildStatus, setBuildStatus] = useState<CloudBuildStatus | null>(null);

    const handleBuildButtonClick = () => {
        setIsButtonDisabled(true);
        setBuildStatus(null);

        axios.post('/api/dpu/trigger', { userId })
        .then((response) => {
            console.log('[handleBuildButtonClick] /api/dpu/trigger response:', response.data);
            setBuildStatus(response.data);
            if (response.data.success) {
                return;
            }
        })
        .catch((error) => {
            console.error('[handleBuildButtonClick] /api/dpu/trigger request failed:', error);
            setIsButtonDisabled(false);
            setBuildStatus({ success: false, message: 'API request failed' });
        })
    };

    const renderBuildStatus = () => {
        if (buildStatus === null) {
            return isButtonDisabled ? <div className='border-4 border-t-primary-main rounded-full w-6 h-6 animate-spin'></div> : null;
        } else {
            return buildStatus.success ? (
                <span className='text-success'>Build succeeded!</span>
            ) : (
                <span className='text-error'>Build failed! Error: {buildStatus.message}</span>
            );
        }
    };

    const renderDockerInstructions = () => {
        return <div>
        <CodeWithCopyButton userId={userId}/>
        <p className="text-xs mt-2">Minimum config required for running docker image:</p>
        <ul className="text-xs">
            <li>RAM: 2 GB</li>
            <li>CPU: 2v or 4v CPU</li>
            <li>Storage: Depends on codebase size, maximum supported - 20 GB</li>
        </ul>
    </div>
    }

    const buildInstructionContent = () => {
        if (selectedHosting === 'selfhosting') {
            return renderDockerInstructions();
        } else if (selectedHosting === 'cloud') {
            return (
                <div className="flex items-center gap-4">
                    <Button variant="contained" onClick={handleBuildButtonClick} disabled={isButtonDisabled}>
                        Trigger Cloud Build
                    </Button>
                    {renderBuildStatus()}
                </div>
            );
        } else {
            return <div>Select a hosting option to view instructions.</div>;
        }
    };

    return (
        <div>
            {buildInstructionContent()}
        </div>
    );
};

export default BuildInstruction;