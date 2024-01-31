import axios from 'axios';
import React, { useState } from 'react';
import { CloudBuildStatus } from '../../utils/pubsub/pubsubClient';
import Button from '../Button';
import CodeWithCopyButton from './CodeWithCopyButton';

interface BuildInstructionProps {
    selectedHosting: string;
    selectedProvider: string;
    selectedInstallationType: string;
    userId: string;
}

interface RenderDockerInstructionsProps {
    selectedInstallationType: string;
    selectedProvider: string;
}

interface AdditionalInstructionsProps {
    selectedInstallationType: string;
    selectedProvider: string;
}

const BuildInstruction: React.FC<BuildInstructionProps> = ({ selectedHosting, userId, selectedProvider, selectedInstallationType }) => {
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

    const renderDockerInstructions = ({selectedInstallationType, selectedProvider}: RenderDockerInstructionsProps) => {
        return <div>
        <InstructionsToGeneratePersonalAccessToken selectedInstallationType={selectedInstallationType} selectedProvider={selectedProvider} />
        <CodeWithCopyButton userId={userId} selectedInstallationType={selectedInstallationType} selectedProvider={selectedProvider} />
        <p className="text-xs mt-2">Minimum config required for running docker image:</p>
        <ul className="text-xs">
            <li>RAM: 2 GB</li>
            <li>CPU: 2v or 4v CPU</li>
            <li>Storage: Depends on codebase size, maximum supported - 20 GB</li>
        </ul>
    </div>
    }

    const InstructionsToGeneratePersonalAccessToken: React.FC<AdditionalInstructionsProps> = ({ selectedInstallationType, selectedProvider }) => {
        if (selectedInstallationType === "individual" && selectedProvider === "github") {
            return (
                <>
                <p className="text-xs mt-2">Instructions to generate your personal access token for Individual GitHub setup:</p>
                <ul className="text-xs">
                    <li>Kindly generate your Github Personal Access Token of type Fine-Grained only using the instructions provided by Github.
                        <br />
                        <a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: 'black', fontWeight: 'bold' }}>
                        Link to the Github Docs
                        </a> 
                    </li>
                    <li>Make sure you provide specified permissions to your Github Personal Access Token.
                        <br/> 
                        <span className="text-xs mt-2">
                            Permissions:
                            <ul className="text-xs">
                            <li>Read access to email addresses</li>
                            <li>Read access to code, commit statuses, deployments, issues, merge queues, metadata</li>
                            <li> Read access to pull requests</li>
                            </ul>
                        </span>
                        </li>
                </ul>
                </>
            );
        } else {
            return null;
        }
    }

    const buildInstructionContent = () => {
        if (selectedHosting === 'selfhosting') {
            return renderDockerInstructions({ selectedInstallationType, selectedProvider });
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