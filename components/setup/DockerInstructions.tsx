"use client";

import axios from 'axios';
import type { Session } from "next-auth";
import React, { useEffect, useState } from 'react';

import { RepoIdentifier } from '../../types/repository';
import { getUserRepositories } from '../../utils/providerAPI/getUserRepositories';
import Button from '../Button';
import CodeWithCopyButton from './CodeWithCopyButton';
import InstructionsToGeneratePersonalAccessToken from './InstructionsToGeneratePersonalAccessToken';

interface DockerInstructionsProps {
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
		setupArgsMap.get(key)?.repos.push(repo.repo_name);
	});

	return Array.from(setupArgsMap.values());
}
const DockerInstructions: React.FC<DockerInstructionsProps> = ({ userId, selectedInstallationType, selectedProvider, session }) => {
	const [selfHostingCode, setSelfHostingCode] = useState<string>("Generating topic name, please try refreshing if you keep seeing this...");
	const [selectedRepos, setSelectedRepos] = useState<RepoIdentifier[]>([]);
	const [allRepos, setAllRepos] = useState<RepoIdentifier[]>([]);
	const [isRepoSelectionDone, setIsRepoSelectionDone] = useState<boolean>(false);
	const [isRepoSubmitButtonDisabled, setIsRepoSubmitButtonDisabled] = useState<boolean>(false);
	const [installId, setInstallId] = useState<string | null>(null);

	useEffect(() => {
		axios.post('/api/dpu/pubsub', { userId }).then(async (response) => {
			if (response.data.installId) {
				setInstallId(response.data.installId);
				if (selectedInstallationType === 'individual' && selectedProvider === 'github') {
					if (!session) {
						console.error(`[DockerInstructions] could not get session for userId: ${userId}`);
						return;
					}
					if (isRepoSelectionDone) {
						setSelfHostingCode(`
docker pull asia.gcr.io/vibi-prod/dpu/dpu &&\n
docker run -e INSTALL_ID=${response.data.installId} \\
-e PROVIDER=<your_provider_here> \\
-e GITHUB_PAT=<Your gh cli token> \\
asia.gcr.io/vibi-prod/dpu/dpu
					`);
					}
					else {
						let providerReposForUser = await getUserReposForProvider(session, 'github');
						setAllRepos(providerReposForUser);
					}
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
			console.error(`[DockerInstructions] Unable to get topic name for user ${userId} - ${error.message}`);
		});
	}, [userId, selectedInstallationType, selectedProvider]);

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
		setIsRepoSubmitButtonDisabled(true)
		if (!installId) {
            console.error("[handleSubmit] InstallId is not available.");
			// TODO - there is no user feedback here. The user might not know that something has gone wrong
            return;
        }
		const reposListInSetupArgs = formatRepoListInSaveSetupArgsForm(selectedRepos, installId);
		axios.post('/api/dpu/setup', { info: reposListInSetupArgs, installationId: installId }).then((response) => {
			if (response.status != 200){
				console.error(`[DockerInstructions/handleSubmit] something went wrong while saving repos data in db`);
			} else {
				console.info(`[DockerInstructions/handleSubmit] repos data saved successfully in db`);
				setSelfHostingCode(`
docker pull asia.gcr.io/vibi-prod/dpu/dpu &&\n
docker run -e INSTALL_ID=${installId} \\
-e PROVIDER=<your_provider_here> \\
-e GITHUB_PAT=<Your gh cli token> \\
asia.gcr.io/vibi-prod/dpu/dpu
				`);
				setIsRepoSelectionDone(true);
			}
			setIsRepoSubmitButtonDisabled(false);
		})
		.catch((error) => {
			setSelfHostingCode(`Unable to submit selected repos, \nPlease refresh this page and try again.`);
			setIsRepoSelectionDone(false);
			setIsRepoSubmitButtonDisabled(false);
			console.error(`[DockerInstructions] Unable to save selected repos in db for user ${userId} - ${error.message}`);
		});
	};

	return (
		<div className='relative'>
			{selectedInstallationType === 'individual' ? 
				!isRepoSelectionDone ? ( 
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
							<Button variant='contained' onClick={handleSubmit} disabled={selectedRepos.length === 0 || isRepoSubmitButtonDisabled}>
								Submit
							</Button>
						</div>
					</div> 
					) : (
						<>
							<InstructionsToGeneratePersonalAccessToken selectedInstallationType={selectedInstallationType} selectedProvider={selectedProvider} />
							<CodeWithCopyButton text={selfHostingCode} />
							<p className="text-xs mt-2">Minimum config required for running docker image:</p>
							<ul className="text-xs">
								<li>RAM: 2 GB</li>
								<li>CPU: 2v or 4v CPU</li>
								<li>Storage: Depends on codebase size, maximum supported - 20 GB</li>
							</ul>
						</>
			): (
				// selectedInstallationType === 'project'
				<>
					<CodeWithCopyButton text={selfHostingCode} />
					<p className="text-xs mt-2">Minimum config required for running docker image:</p>
					<ul className="text-xs">
						<li>RAM: 2 GB</li>
						<li>CPU: 2v or 4v CPU</li>
						<li>Storage: Depends on codebase size, maximum supported - 20 GB</li>
					</ul>
				</>
			)} 
		</div>
	);
	}

export default DockerInstructions;
