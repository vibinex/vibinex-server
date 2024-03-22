"use client";

import axios from 'axios';
import type { Session } from "next-auth";
import React, { useEffect, useState } from 'react';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdContentCopy } from "react-icons/md";
import { RepoIdentifier } from '../../types/repository';
import { getUserRepositories } from '../../utils/providerAPI/getUserRepositories';
import Button from '../Button';

interface DpuSetupProps {
	userId: string;
	selectedProvider: string;
	selectedInstallationType: string;
	session: Session | null;
}

interface SetupReposApiBodyArgs {
	owner: string,
	provider: string,
	repos: string [],
	installationId: string
}

async function getUserReposForProvider(session: Session, targetProvider: string) {
	const allRepos = await getUserRepositories(session);
	// Filter repos based on the targetProvider
	const filteredRepos = allRepos.filter(repo => repo.repo_provider === targetProvider);
	return filteredRepos;
}

function formatRepoListInSaveSetupArgsForm(repos: RepoIdentifier[], install_id: string) {
	// Group by repo_owner and generate setup args
	const setupArgsMap: Map<string, SetupReposApiBodyArgs> = new Map();
	repos.forEach(repo => {
		const key = repo.repo_owner;
		if (!setupArgsMap.has(key)) {
			setupArgsMap.set(key, {
				owner: repo.repo_owner,
				provider: repo.repo_provider,
				repos: [],
				installationId: install_id
			});
		}
		setupArgsMap.get(key)!.repos.push(repo.repo_name);
	});

	return Array.from(setupArgsMap.values());
}
const DpuSetup: React.FC<DpuSetupProps> = ({ userId, selectedInstallationType, selectedProvider, session }) => {
	const [isCopied, setIsCopied] = useState<boolean>(false);
	const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
	const [selfHostingCode, setSelfHostingCode] = useState<string>("Generating topic name, please try refreshing if you keep seeing this...");
	const [selectedRepos, setSelectedRepos] = useState<RepoIdentifier[]>([]);
	const [allRepos, setAllRepos] = useState<RepoIdentifier[]>([]);
	const [selectAll, setSelectAll] = useState<boolean>(false);
	const [isRepoSelectionDone, setIsRepoSelectionDone] = useState<boolean>(false);
	const [installId, setInstallId] = useState<string | null>(null);

	useEffect(() => {
		axios.post('/api/dpu/pubsub', { userId }).then(async (response) => {
			if (response.data.installId) {
				setInstallId(response.data.installId);
				if (selectedInstallationType === 'individual' && selectedProvider === 'github') {
					if (!session) {
						console.error(`[DpuSetup] could not get session for userId: ${userId}`);
						return;
					}
					let providerReposForUser = await getUserReposForProvider(session, 'github');
					setAllRepos(providerReposForUser);
				} else if (selectedInstallationType === 'individual' && selectedProvider === 'bitbucket') {
					setSelfHostingCode(`
Coming Soon!
					`)
				} else {
					setSelfHostingCode(`
docker pull asia.gcr.io/vibi-prod/dpu/dpu &&\n
docker run -e INSTALL_ID=${response.data.installId} asia.gcr.io/vibi-prod/dpu/dpu
					`);
				}
			}
		}).catch((error) => {
			setSelfHostingCode(`Unable to get topic name for user\nPlease refresh this page and try again.`);
			console.error(`[DpuSetup] Unable to get topic name for user ${userId} - ${error.message}`);
		});
	}, [userId, selectedInstallationType, selectedProvider]);

	const handleCopyClick = () => {
		setIsButtonDisabled(true);
	};

	const handleCopy = () => {
		setIsCopied(true);
		setIsButtonDisabled(false);
	};

	const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, repo: RepoIdentifier) => {
		if (event.target.checked) {
			setSelectedRepos([...selectedRepos, repo]);
		} else {
			setSelectedRepos(selectedRepos.filter(selectedRepo => selectedRepo !== repo));
		}
	};

	const handleSelectAll = () => {
		if (selectedRepos.length === allRepos.length) {
			setSelectedRepos([]);
		} else {
			setSelectedRepos([...allRepos]);
		}
	};

	const handleSubmit = () => {
		if (!installId) {
            console.error("[handleSubmit] InstallId is not available.");
            return;
        }
		const reposListInSetupArgs = formatRepoListInSaveSetupArgsForm(selectedRepos, installId);
		axios.post('/api/dpu/setup', { info: reposListInSetupArgs, installationId: installId }).then((response) => {
			if (response.status != 200){
				console.error(`[DpuSetup/handleSubmit] something went wrong while saving repos data in db`);
			} else {
				console.info(`[DpuSetup/handleSubmit] repos data saved successfully in db`);
				setSelfHostingCode(`
docker pull asia.gcr.io/vibi-prod/dpu/dpu &&\n
docker run -e INSTALL_ID=${installId} \\
-e PROVIDER=<your_provider_here> \\
-e GITHUB_PAT=<Your gh cli token> \\
asia.gcr.io/vibi-prod/dpu/dpu
				`);
				setIsRepoSelectionDone(true);
			}
		})
		.catch((error) => {
			setSelfHostingCode(`Unable to submit selected repos, \nPlease refresh this page and try again.`);
			setIsRepoSelectionDone(false);
			console.error(`[DpuSetup] Unable to save selected repos in db for user ${userId} - ${error.message}`);
		});
	};

	return (
		<div className='relative'>
			{isRepoSelectionDone ? (
				<>
					<pre>{selfHostingCode}</pre>
					<CopyToClipboard text={selfHostingCode} onCopy={handleCopy}>
						<button
							style={{
								position: 'absolute',
								top: '0px',
								right: '0px',
								cursor: 'pointer',
								background: 'none',
								border: 'none',
							}}
							onClick={handleCopyClick}
							disabled={isButtonDisabled}
						>
							<MdContentCopy />
						</button>
					</CopyToClipboard>
					{isCopied && <span style={{ position: 'absolute', top: '0', right: '50%', transform: 'translate(50%, -100%)', color: 'green' }}>Copied!</span>}
				</>
			) : selectedInstallationType === 'individual' && selectedProvider === 'github' && (
				<div>
					<h4 className='my-2 font-semibold'>Select Repositories</h4>
					{allRepos.map((repo, index) => (
						<div key={`${repo.repo_owner}/${repo.repo_name}`} className='flex items-center gap-2'>
							<input
								type="checkbox"
								id={JSON.stringify(repo)}
								value={`${repo.repo_owner}/${repo.repo_name}`}
								checked={selectedRepos.includes(repo)}
								onChange={(event) => handleCheckboxChange(event, repo)}
							/>
							<label htmlFor={JSON.stringify(repo)}>{repo.repo_provider}/{repo.repo_owner}/{repo.repo_name}</label>
						</div>
					))}
					<div className='flex gap-2 py-2'>
						<Button variant='outlined' onClick={handleSelectAll}>
						{selectedRepos.length === allRepos.length ? "Unselect All" : "Select All"}
						</Button>
						<Button variant='contained' onClick={handleSubmit} disabled={selectedRepos.length === 0}>
							Submit
						</Button>
					</div>
				</div>
			)
			}
		</div>
	);
};

export default DpuSetup;
