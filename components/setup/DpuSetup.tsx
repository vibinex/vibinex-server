import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdContentCopy } from "react-icons/md";
import { getUserRepositories } from '../../utils/providerAPI/getUserRepositories';
import saveSetupReposInDb from '../../utils/db/setupRepos';
import { SetupReposArgs } from '../../utils/db/setupRepos';
import Button from '../Button';

interface DpuSetupProps {
	userId: string;
	selectedProvider: string;
	selectedInstallationType: string;
	// session: Session;
}

export type RepoIdentifier = { repo_provider: string, repo_owner: string, repo_name: string };

async function filterProviderReposAndReturnInSetupArgsForm(session: Session, targetProvider: string, install_id: string): Promise<SetupReposArgs[] | null> {
	const allRepos = await getUserRepositories(session);

	// Filter repos based on the targetProvider
	const filteredRepos = allRepos.filter(repo => repo.repo_provider === targetProvider);

	// Group by repo_owner and generate setup args
	const setupArgsMap: Map<string, SetupReposArgs> = new Map();
	filteredRepos.forEach(repo => {
		const key = repo.repo_owner;
		if (!setupArgsMap.has(key)) {
			setupArgsMap.set(key, {
				repo_owner: repo.repo_owner,
				repo_provider: targetProvider,
				repo_names: [],
				install_id
			});
		}
		setupArgsMap.get(key)!.repo_names.push(repo.repo_name);
	});

	return Array.from(setupArgsMap.values());
}

const DpuSetup: React.FC<DpuSetupProps> = ({ userId, selectedInstallationType, selectedProvider }) => {
	const [isCopied, setIsCopied] = useState<boolean>(false);
	const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
	const [selfHostingCode, setSelfHostingCode] = useState<string>("Generating topic name, please try refreshing if you keep seeing this...");
	const [selectedRepos, setSelectedRepos] = useState<RepoIdentifier[]>([]);
	const [allRepos, setAllRepos] = useState<RepoIdentifier[]>([]);
	const [selectAll, setSelectAll] = useState<boolean>(false);
	const [submissionStatus, setSubmissionStatus] = useState<boolean>(false);

	useEffect(() => {
		if (selectedInstallationType === 'individual' && selectedProvider === 'github') {
			// let providerReposForUser = filterProviderReposAndReturnInSetupArgsForm(session, 'github');

			setAllRepos([{ 'repo_name': 'muskanPaliwal', 'repo_owner': 'alokitInnovations', 'repo_provider': 'github' }]);
			// axios.get('/api/docs/getUserRepositories')
			//     .then(response => {
			//         setAllRepos(response.data); // Assuming the API returns an array of RepoIdentifiers
			//     })
			//     .catch(error => {
			//         console.error("Error fetching repos:", error);
			//     });
		}
		axios.post('/api/dpu/pubsub', { userId }).then((response) => {
			if (response.data.installId) {
				if (selectedInstallationType === 'individual' && selectedProvider === 'github') {
					setSelfHostingCode(`
docker pull asia.gcr.io/vibi-prod/dpu/dpu &&\n
docker run -e INSTALL_ID=${response.data.installId} \\
-e PROVIDER=<your_provider_here> \\
-e GITHUB_PAT=<Your gh cli token> \\
asia.gcr.io/vibi-prod/dpu/dpu
					`);
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
			console.log("[DpuSetup] topic name ", response.data.installId);
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
		if (!selectAll) {
			setSelectedRepos([...allRepos]);
		} else {
			setSelectedRepos([]);
		}
		setSelectAll(!selectAll);
	};

	const handleSubmit = () => {
		// Call your backend Next.js API to submit selected repos
		axios.post('/api/docs/getRepoList', { userId, selectedRepos })
			.then(response => {
				// Handle success
				console.log("Repos submitted successfully:", response.data);
				// Set selfHostingCode based on selected repos
				setSelfHostingCode(`Your self hosting code here`);
				setSubmissionStatus(true);
			})
			.catch(error => {
				console.error("Error submitting repos:", error);
			});
	};

	return (
		<div className='relative'>
			{submissionStatus ? (
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
						<div key={index} className='flex items-center gap-2'>
							<input
								type="checkbox"
								id={JSON.stringify(repo)}
								value={`${repo.repo_owner}/${repo.repo_name}`}
								checked={selectedRepos.includes(repo)}
								onChange={(event) => handleCheckboxChange(event, repo)}
							/>
							<label htmlFor={JSON.stringify(repo)}>{repo.repo_name}</label>
						</div>
					))}
					<div className='flex gap-2 py-2'>
						<Button variant='outlined' onClick={handleSelectAll}>
							{selectAll ? "Unselect All" : "Select All"}
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
