import type { NextApiRequest, NextApiResponse } from 'next';
import { isRepoIdentifier, type RepoIdentifier } from '../../types/repository';
import { setRepoConfig } from '../../utils/db/repos';

type SetRepoConfigReqBody = {
	repo: RepoIdentifier,
	configType: 'auto_assign' | 'comment',
	value: boolean
}

const isSetRepoConfigReqBody = (x: any): x is SetRepoConfigReqBody => {
	return x && isRepoIdentifier(x.repo) && (x.configType === "auto_assign" || x.configType === "comment") && typeof x.value === "boolean";
}

const setRepoConfigHandler = async (
	req: NextApiRequest,
	res: NextApiResponse<{ message: string }>
) => {
	// check auth


	// validate request
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'setRepoConfig API must be called using POST method' });
	}
	if (!isSetRepoConfigReqBody(req.body)) {
		return res.status(400).json({ message: 'setRepoConfig API received invalid values for one or more of its fields' })
	}

	// update repo config
	const { repo, configType, value }: SetRepoConfigReqBody = req.body;
	await setRepoConfig(repo, configType, value)
		.then((queryResponse) => {
			if (queryResponse)
				res.status(200).json({ message: 'success' });
			else
				throw new Error('Failed to modify repository configuration');
		})
		.catch((err) => {
			console.error(`[setRepoConfig] Failed to update config for ${repo.repo_provider}/${repo.repo_owner}/${repo.repo_name}`, err);
			res.status(500).json({ message: 'Internal error: Could not update repository configuration.' })
		})
}

export default setRepoConfigHandler;