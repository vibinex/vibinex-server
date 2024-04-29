import axios from 'axios';
import type { Session } from 'next-auth';
import React, { useEffect, useState } from 'react';
import { RepoProvider } from '../../utils/providerAPI';
import { CloudBuildStatus } from '../../utils/trigger';
import Button from '../Button';
import DockerInstructions from './DockerInstructions';
import RepoSelection from './RepoSelection';
import { encrypt } from '../../utils/encrypt_decrypt';

interface BuildInstructionProps {
	selectedHosting: string;
	selectedProvider: RepoProvider;
	selectedInstallationType: string;
	userId: string;
	session: Session | null;
}

const BuildStatus: React.FC<{ buildStatus: CloudBuildStatus | null, isTriggerBuildButtonDisabled: boolean }> = ({ buildStatus, isTriggerBuildButtonDisabled }) => {
	if (buildStatus === null) {
		if (isTriggerBuildButtonDisabled) {
			return (<div className='border-4 border-t-primary-main rounded-full w-6 h-6 animate-spin'> </div>)
		}
		return (<></>)
	} else if (buildStatus.success) {
		return <span className='text-success'> Build succeeded! </span>
	} else {
		return (<span className='text-error'> Build failed! Error: {buildStatus.message} </span>)
	}
}

const BuildInstruction: React.FC<BuildInstructionProps> = ({ selectedHosting, userId, selectedProvider, selectedInstallationType, session }) => {
	const [isTriggerBuildButtonDisabled, setIsTriggerBuildButtonDisabled] = useState<boolean>(false);
	const [buildStatus, setBuildStatus] = useState<CloudBuildStatus | null>(null);
	const [isRepoSelectionDone, setIsRepoSelectionDone] = useState<boolean>(false);
	const [installId, setInstallId] = useState<string | null>(null);
	const [isGetInstallIdLoading, setIsGetInstallIdLoading] = useState(false);
	const [handleGithubPatInputValue, setHandleGithubPatInputValue] = useState<string>("");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleGithubPatInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHandleGithubPatInputValue(event.target.value);
    };

	const encrypt_github_pat = (handleGithubPatInputValue: string) => {
		let secret_key = process.env.NEXT_PUBLIC_SECRET_KEY;
		if (secret_key) {
			return encrypt(secret_key, handleGithubPatInputValue);
		}
	}

	const handleBuildButtonClick = () => {
		setIsTriggerBuildButtonDisabled(true);
		setBuildStatus(null);
		setErrorMessage(null);
		let encrypted_github_pat = encrypt_github_pat(handleGithubPatInputValue);

		axios.post('/api/dpu/trigger', { userId, selectedHosting, selectedInstallationType, selectedProvider, github_pat: encrypted_github_pat })
			.then((response) => {
				console.log('[handleBuildButtonClick] /api/dpu/trigger response:', response.data);
				setBuildStatus(response.data);
				setHandleGithubPatInputValue("");  // Clear the input field after successful submission
				if (!response.data.success) {
					setErrorMessage('Failed to trigger build: ' + response.data.message); // Handle backend-specific error messages
				}
				if (response.data.success) {
					return;
				}
			})
			.catch((error) => {
				console.error('[handleBuildButtonClick] /api/dpu/trigger request failed:', error);
				setErrorMessage('API request failed: ' + error.message);
				setIsTriggerBuildButtonDisabled(false);
				// setHandleGithubPatInputValue(""); TODO: Not sure if this needs to be done.
				setBuildStatus({ success: false, message: 'API request failed' });
			})
	};

	useEffect(() => {
		setIsGetInstallIdLoading(true);
		axios.post('/api/dpu/pubsub', { userId }).then(async (response) => {
			if (response.data.installId) {
				setInstallId(response.data.installId);
			}
		})
			.catch((error) => {
				console.error(`[BuildInstruction] Unable to get topic name for user ${userId} - ${error.message}`);
			})
			.finally(() => {
				setIsGetInstallIdLoading(false);
			});
	}, [userId])

	if (!installId) {
		return (<div className="flex items-center gap-4">
			<p>Something went wrong while fetching install id.</p>
		</div>);
	}
	if (selectedHosting === 'selfhosting') {
		if (isGetInstallIdLoading) {
			return (<>
				<div className='inline-block border-4 border-t-primary-main rounded-full w-6 h-6 animate-spin mx-2'></div>
				Generating topic name...
			</>);
		}
		if (!isRepoSelectionDone && (
			(selectedProvider === 'bitbucket' && selectedInstallationType === 'project') ||
			(selectedProvider === 'github' && selectedInstallationType === 'individual')
		)) {
			return (<RepoSelection repoProvider={selectedProvider} installId={installId} setIsRepoSelectionDone={setIsRepoSelectionDone} />)
		}
		return <DockerInstructions userId={userId} selectedInstallationType={selectedInstallationType} selectedProvider={selectedProvider} session={session} installId={installId} />
	} else if (selectedHosting === 'cloud') {
		if (selectedInstallationType === 'project') {
			return (
				<div className="flex items-center gap-4">
					<Button variant="contained" onClick={handleBuildButtonClick} disabled={isTriggerBuildButtonDisabled}>
						Trigger Cloud Build
					</Button>
					<BuildStatus buildStatus={buildStatus} isTriggerBuildButtonDisabled={isTriggerBuildButtonDisabled} />
				</div>
			);
		} else {
			// TODO - if repo selection is false show repos, if true pat text field and trigger cloud build button
			if (!isRepoSelectionDone &&
				(selectedProvider === 'github' && selectedInstallationType === 'individual')
			) {
				return (<RepoSelection repoProvider={selectedProvider} installId={installId} setIsRepoSelectionDone={setIsRepoSelectionDone} />)
			}
			return (<>
				<div className="flex items-center gap-2 py-2">
					<input
						type="text"
						placeholder='Enter your Personal Access Token'
						value={handleGithubPatInputValue}
						onChange={handleGithubPatInput}
						disabled={isTriggerBuildButtonDisabled}
						className="w-full h-8"
					/>
					<Button variant="contained" className="h-8" onClick={handleBuildButtonClick} disabled={isTriggerBuildButtonDisabled || !handleGithubPatInputValue.trim()}>
						Submit
					</Button>
				</div>
				{errorMessage && (
					<div className="text-error mt-2">
						{errorMessage}
					</div>
				)}
			</>);
		}
	} else {
		return <div>Select a hosting option to view instructions.</div>;
	}
};

export default BuildInstruction;