import axios from 'axios';
import type { Session } from 'next-auth';
import React, { useEffect, useState } from 'react';
import { encrypt } from '../../utils/encryptDecrypt';
import { RepoProvider } from '../../utils/providerAPI';
import { CloudBuildStatus } from '../../utils/trigger';
import Button from '../Button';
import DockerInstructions from './DockerInstructions';
import InstructionsToGeneratePersonalAccessToken from './InstructionsToGeneratePersonalAccessToken';
import RepoSelection from './RepoSelection';

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
	const [maskedGithubPat, setMaskedGithubPat] = useState('');
	const [isInputDisabled, setIsInputDisabled] = useState(false);

	const handleGithubPatInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		setHandleGithubPatInputValue(event.target.value);
	};

	const encryptGithubPat = (handleGithubPatInputValue: string) => {
		const encryptionPublicKey = process.env.NEXT_PUBLIC_ENCRYPTION_PUBLIC_KEY;
		if (!encryptionPublicKey) {
			console.error('[encryptGithubPat] Encryption public key is missing');
			setErrorMessage('Failed to encrypt data. Please contact support.');
			setIsInputDisabled(false);
			return;
		}
		return encrypt(encryptionPublicKey, handleGithubPatInputValue)
			.then((encryptedData) => {
				return encryptedData;
			})
			.catch((error) => {
				console.error('[handleBuildButtonClick] /api/dpu/trigger error:', error);
				setErrorMessage('Failed to trigger build. Please try again later.');
				setIsInputDisabled(false);
			});
	}

	const maskGithubPat = (handleGithubPatInputValue: string) => {
		return handleGithubPatInputValue.replace(/.(?=.{4})/g, '*');  // Mask all but the last four characters
	};

	const handleBuildButtonClick = async () => {
		setIsTriggerBuildButtonDisabled(true);
		setBuildStatus(null);
		setErrorMessage(null);
		setIsInputDisabled(true);
		let encryptedGithubPat = await encryptGithubPat(handleGithubPatInputValue);

		if (!encryptedGithubPat) {
			setErrorMessage('Failed to encrypt GitHub PAT. Please try again.');
			setIsInputDisabled(false);
			setIsTriggerBuildButtonDisabled(false);
			return;
		}

		axios.post('/api/dpu/trigger', { userId, selectedHosting, selectedInstallationType, selectedProvider, github_pat: encryptedGithubPat })
			.then((response) => {
				console.log('[handleBuildButtonClick] /api/dpu/trigger response:', response.data);
				setBuildStatus(response.data);
				setIsTriggerBuildButtonDisabled(false);
				if (!response.data.success) {
					setErrorMessage('Failed to trigger build: ' + response.data.message); // Handle backend-specific error messages
				}
				if (response.data.success) {
					setMaskedGithubPat(maskGithubPat(handleGithubPatInputValue)); // Mask the GitHub PAT
					return;
				}
			})
			.catch((error) => {
				console.error('[handleBuildButtonClick] /api/dpu/trigger request failed:', error);
				setErrorMessage('API request failed: ' + error.message);
				setIsTriggerBuildButtonDisabled(false);
				setIsInputDisabled(false);
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

	if (isGetInstallIdLoading) {
		return (<>
			<div className='inline-block border-4 border-t-primary-main rounded-full w-6 h-6 animate-spin mx-2'></div>
			Generating topic name...
		</>);
	}
	if (!installId) {
		return (<div className="flex items-center gap-4">
			<p>Something went wrong while fetching install id.</p>
		</div>);
	}
	if (selectedHosting === 'selfhosting') {
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
			if (!isRepoSelectionDone) {
				return (<RepoSelection repoProvider={selectedProvider} installId={installId} setIsRepoSelectionDone={setIsRepoSelectionDone} />)
			}
			return (<>
				<div className="flex items-center gap-2 py-2">
					<input
						type="text"
						placeholder='Enter your Personal Access Token'
						value={isInputDisabled ? maskedGithubPat : handleGithubPatInputValue}
						onChange={handleGithubPatInput}
						disabled={isInputDisabled}
						className="grow h-8"
					/>
					<Button variant="contained" className="h-8" onClick={handleBuildButtonClick} disabled={isTriggerBuildButtonDisabled || !handleGithubPatInputValue.trim()}>
						Deploy
					</Button>
				</div>
				{errorMessage && (
					<div className="text-error mt-2">
						{errorMessage}
					</div>
				)}
				<InstructionsToGeneratePersonalAccessToken selectedInstallationType={selectedInstallationType} selectedProvider={selectedProvider} />
			</>);
		}
	} else {
		return <div>Select a hosting option to view instructions.</div>;
	}
};

export default BuildInstruction;