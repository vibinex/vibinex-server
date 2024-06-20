import axios from 'axios';
import type { Session } from 'next-auth';
import React, { useState } from 'react';
import { encrypt } from '../../utils/encryptDecrypt';
import { RepoProvider } from '../../utils/providerAPI';
import { CloudBuildStatus } from '../../utils/trigger';
import Button from '../Button';

interface BuildInstructionProps {
	selectedProvider: RepoProvider;
	selectedInstallationType: string;
	session: Session | null;
}

type BodyType = {
	selectedInstallationType: string;
	selectedProvider: RepoProvider;
	userId: string | undefined;
	github_pat?: string; // Optional property
}

const BuildStatus: React.FC<{ buildStatus: CloudBuildStatus | null, isTriggerBuildButtonDisabled: boolean }> = ({ buildStatus, isTriggerBuildButtonDisabled }) => {
	if (buildStatus === null) {
		if (isTriggerBuildButtonDisabled) {
			return (<div className='border-4 border-t-secondary rounded-full w-6 h-6 animate-spin'> </div>)
		}
		return (<></>)
	} else if (buildStatus.success) {
		return <span className='text-success'> Build succeeded! </span>
	} else {
		return (<span className='text-error'> Build failed! Error: {buildStatus.message} </span>)
	}
}

const BuildInstruction: React.FC<BuildInstructionProps> = ({ selectedProvider, selectedInstallationType, session }) => {
	const [isTriggerBuildButtonDisabled, setIsTriggerBuildButtonDisabled] = useState<boolean>(false);
	const [buildStatus, setBuildStatus] = useState<CloudBuildStatus | null>(null);
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
		let body: BodyType = {
			selectedInstallationType,
			selectedProvider,
			userId: session?.user?.id
		}
		if (handleGithubPatInputValue != "") {
			let encryptedGithubPat = await encryptGithubPat(handleGithubPatInputValue);
			if (!encryptedGithubPat) {
				setErrorMessage('Failed to encrypt GitHub PAT. Please try again.');
				setIsInputDisabled(false);
				setIsTriggerBuildButtonDisabled(false);
				return;
			}
			body = {...body, github_pat: encryptedGithubPat};
		}
		if (session?.user?.id) {
			axios.post('/api/dpu/trigger', body)
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
		}
	};

	if (selectedInstallationType === 'app') {
		return (
			<div className="flex items-center gap-4">
				<Button variant="contained" onClick={handleBuildButtonClick} disabled={isTriggerBuildButtonDisabled}>
					Deploy on Vibinex Cloud
				</Button>
				<BuildStatus buildStatus={buildStatus} isTriggerBuildButtonDisabled={isTriggerBuildButtonDisabled} />
			</div>
		);
	} else {
		return (<>
			<div className="flex items-center gap-2 py-2">
				<input
					type="text"
					placeholder='Enter your Personal Access Token'
					value={isInputDisabled ? maskedGithubPat : handleGithubPatInputValue}
					onChange={handleGithubPatInput}
					disabled={isInputDisabled}
					className={`grow h-8 ${isInputDisabled ? 'text-gray-500' : 'text-black'}`}
				/>
				<Button variant="contained" className="h-8" onClick={handleBuildButtonClick} disabled={isTriggerBuildButtonDisabled || !handleGithubPatInputValue.trim()}>
					Deploy on Vibinex Cloud
				</Button>
			</div>
			{errorMessage && (
				<div className="text-error mt-2">
					{errorMessage}
				</div>
			)}
		</>);
	}
};

export default BuildInstruction;