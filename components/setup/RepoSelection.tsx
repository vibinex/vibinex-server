import axios from "axios";
import { useEffect, useState } from "react";
import { RepoIdentifier } from "../../types/repository";
import { RepoProvider } from "../../utils/providerAPI";
import Button from "../Button";
import { useRouter } from "next/router";
import { getURLWithParams } from "../../utils/url_utils";


interface SetupReposApiBodyArgs {
	owner: string,
	provider: string,
	repos: string[],
}

function formatRepoListInSaveSetupArgsForm(repos: RepoIdentifier[]) {
	// Group by repo_owner and generate setup args
	const setupArgsMap: Map<string, SetupReposApiBodyArgs> = new Map();
	repos.forEach(repo => {
		const key = repo.repo_owner;
		if (!setupArgsMap.has(key)) {
			setupArgsMap.set(key, {
				owner: repo.repo_owner,
				provider: repo.repo_provider,
				repos: [],
			});
		}
		setupArgsMap.get(key)?.repos.push(repo.repo_name);
	});

	return Array.from(setupArgsMap.values());
}


const RepoSelection = ({ repoProvider }: { repoProvider: RepoProvider }) => {
	const [selectedRepos, setSelectedRepos] = useState<RepoIdentifier[]>([]);
	const [disableAllRepos, setDisableAllRepos] = useState<boolean>(false);
	const [allRepos, setAllRepos] = useState<RepoIdentifier[]>([]);
	const [isGetReposLoading, setIsGetReposLoading] = useState<boolean>(false);
	const [isRepoSubmitButtonDisabled, setIsRepoSubmitButtonDisabled] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const [submitButtonText, setSubmitButtonText] = useState<string>("Submit");
	const router = useRouter();

	const getRepoList = async () => {
		setIsGetReposLoading(true);
		axios.get<{ repoList: RepoIdentifier[] }>(`/api/docs/getAllRepos?nonce=${Math.random()}`)
			.then((response) => {
				return response.data.repoList;
			})
			.then((allRepos) => {
				const providerReposForUser = allRepos.filter(repo => repo.repo_provider === repoProvider);
				setAllRepos(providerReposForUser)

				// automatically check the repositories that are already installed by the user
				axios.get<{ repoList: RepoIdentifier[] }>(`/api/docs/getInstalledRepos?nonce=${Math.random()}`, { params: { provider: repoProvider } })
					.then((response) => {
						return response.data.repoList;
					})
					.then((repos) => {
						const filteredRepos = providerReposForUser.filter(repo => repos.some(selectedRepo =>
							selectedRepo.repo_provider === repo.repo_provider &&
							selectedRepo.repo_owner === repo.repo_owner &&
							selectedRepo.repo_name === repo.repo_name
						)); // this is important because we are matching object references when we compare values in the checkbox
						setSelectedRepos(filteredRepos);
					})
					.catch((err) => {
						console.error(`[RepoSelection] getUserReposForProvider failed:`, err);
					})
			})
			.catch(err => {
				console.error(`[RepoSelection] getUserReposForProvider failed:`, err);
				setError("Failed to get repositories")
			})
			.finally(() => {
				setIsGetReposLoading(false);
			});
	}
	
	useEffect(() => {
		getRepoList();
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
		setDisableAllRepos(true);
		const reposListInSetupArgs = formatRepoListInSaveSetupArgsForm(selectedRepos);
		axios.post('/api/docs/userSelectedRepos', { info: reposListInSetupArgs })
			.then((response) => {
				if (response.status != 200) {
					console.error(`[RepoSelection/handleSubmit] something went wrong while saving repos data in db`);
					setError('Something went wrong');
					setIsRepoSubmitButtonDisabled(false)
				} else {
					console.info(`[RepoSelection/handleSubmit] repos data saved successfully in db`);
					const nextPage = repoProvider === 'github' 
					? getURLWithParams('/docs/setup/hosting', { srcSuffix: '/docs/setup/repositories', installation: 'pat', provider: 'github'})
					: getURLWithParams('/docs/setup/hosting', { srcSuffix: '/docs/setup/repositories', provider: 'bitbucket' });
        			router.push(nextPage);
				}
			})
			.catch((error) => {
				setError(`Unable to submit selected repos, \nPlease refresh this page and try again.`);
				console.error(`[RepoSelection] Unable to save selected repos in db - ${error.message}`);
			})
	};

	const handleRefresh = () => {
		getRepoList();
	}

	if (error.length > 0) {
		return (<p className="text-error">{error}</p>)
	}
	return (
		<div>
			{isGetReposLoading ? (
				<div className='border-4 border-t-secondary rounded-full w-12 h-12 animate-spin mx-auto'></div>
			) : allRepos.length === 0 ? (
				<p>No repositories found</p>
			) : (
				<div>
					<div className='flex gap-2 py-2'>
						<Button variant='outlined' onClick={handleRefresh}>
							&#x21bb; Refresh
						</Button>
						<Button variant='outlined' onClick={handleSelectAll}>
							{selectedRepos.length === allRepos.length ? "Unselect All" : "Select All"}
						</Button>
					</div>
					{allRepos.map((repo) => (
						<div key={`${repo.repo_owner}/${repo.repo_name}`} className='flex items-center gap-2'>
							<input
								type="checkbox"
								id={JSON.stringify(repo)}
								value={`${repo.repo_owner}/${repo.repo_name}`}
								checked={selectedRepos.includes(repo)}
								onChange={(event) => handleCheckboxChange(event, repo)}
								disabled={disableAllRepos}
							/>
							<label htmlFor={JSON.stringify(repo)}>{repo.repo_provider}/{repo.repo_owner}/{repo.repo_name}</label>
						</div>
					))}
				</div>
			)}
			<div className='py-2'>
				<Button variant='contained' onClick={handleSubmit} disabled={selectedRepos.length === 0 || isRepoSubmitButtonDisabled}>
					{submitButtonText}
				</Button>
			</div>
		</div>
	);
};

export default RepoSelection;
