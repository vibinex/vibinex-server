import axios from 'axios';
import type { Session } from 'next-auth';
import React, { useEffect, useState } from 'react';
import { RepoProvider } from '../../utils/providerAPI';
import { CloudBuildStatus } from '../../utils/pubsub/pubsubClient';
import Button from '../Button';
import DockerInstructions from './DockerInstructions';
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

	const handleBuildButtonClick = () => {
		setIsTriggerBuildButtonDisabled(true);
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
				setIsTriggerBuildButtonDisabled(false);
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

	if (selectedHosting === 'selfhosting') {
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
			return (<>Not Implemented!</>);
		}
	} else {
		return <div>Select a hosting option to view instructions.</div>;
	}
};

export default BuildInstruction;