import axios from "axios";
import { useEffect, useState } from "react";
import { RepoIdentifier } from "../../types/repository";
import { RepoProvider } from "../../utils/providerAPI";
import Button from "../Button";


interface SetupReposApiBodyArgs {
	owner: string,
	provider: string,
	repos: string[],
	installationId: string
}

async function getUserReposForProvider(targetProvider: string) {
	const allRepos = await axios.get<{ repoList: RepoIdentifier[] }>('/api/docs/getRepoList')
		.then((response) => {
			return response.data.repoList;
		})
		.catch((err) => {
			console.error('[getUserReposForProvider] Error occurred while getting repo list from API', err);
			return [];
		});
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

const RepoSelection = ({ repoProvider, installId, setIsRepoSelectionDone }: { repoProvider: RepoProvider, installId: string, setIsRepoSelectionDone: Function }) => {
	const [selectedRepos, setSelectedRepos] = useState<RepoIdentifier[]>([]);
	const [allRepos, setAllRepos] = useState<RepoIdentifier[]>([]);
	const [isGetReposLoading, setIsGetReposLoading] = useState<boolean>(false);
	const [isRepoSubmitButtonDisabled, setIsRepoSubmitButtonDisabled] = useState<boolean>(false);
	const [error, setError] = useState<string>("");

	useEffect(() => {
		setIsGetReposLoading(true);
		getUserReposForProvider(repoProvider)
			.then((providerReposForUser) => setAllRepos(providerReposForUser))
			.catch(err => {
				console.log(`[RepoSelection] getUserReposForProvider failed:`, err);
				setError("Failed to get repositories")
			})
			.finally(() => {
				setIsGetReposLoading(false);
			});
	}, [repoProvider])

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
		const reposListInSetupArgs = formatRepoListInSaveSetupArgsForm(selectedRepos, installId);
		axios.post('/api/dpu/setup', { info: reposListInSetupArgs, installationId: installId })
			.then((response) => {
				if (response.status != 200) {
					console.error(`[RepoSelection/handleSubmit] something went wrong while saving repos data in db`);
					setError('Something went wrong');
				} else {
					console.info(`[RepoSelection/handleSubmit] repos data saved successfully in db`);
					setIsRepoSelectionDone(true);
				}
			})
			.catch((error) => {
				setError(`Unable to submit selected repos, \nPlease refresh this page and try again.`);
				setIsRepoSelectionDone(false);
				console.error(`[RepoSelection] Unable to save selected repos in db - ${error.message}`);
			})
			.finally(() => {
				setIsRepoSubmitButtonDisabled(false);
			})
	};

	if (error.length > 0) {
		return (<p className="text-error">{error}</p>)
	}
	return (
		<div>
			<h4 className='my-2 font-semibold'>Select Repositories</h4>
			{isGetReposLoading ?
				(<div className='border-4 border-t-primary-main rounded-full w-12 h-12 animate-spin mx-auto'> </div>) :
				allRepos.map((repo, index) => (
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
				))
			}
			<div className='flex gap-2 py-2'>
				<Button variant='outlined' onClick={handleSelectAll}>
					{selectedRepos.length === allRepos.length ? "Unselect All" : "Select All"}
				</Button>
				<Button variant='contained' onClick={handleSubmit} disabled={selectedRepos.length === 0 || isRepoSubmitButtonDisabled}>
			Submit
				</Button>
			</div>
		</div>

	);
};

export default RepoSelection;
