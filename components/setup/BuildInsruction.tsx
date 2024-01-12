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

    const buildInstructionContent = () => {
        if (selectedHosting === 'selfhosting') {
            return <CodeWithCopyButton userId={userId}/>;
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