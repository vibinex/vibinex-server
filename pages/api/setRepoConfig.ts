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

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<{ message: string }>
) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'setRepoConfig API must be called using POST method' });
	}
	if (!isSetRepoConfigReqBody(req.body)) {
		return res.status(400).json({ message: 'setRepoConfig API received invalid values for one or more of its fields' })
	}
	const { repo, configType, value } = req.body;
	setRepoConfig(repo, configType, value);
	res.status(200).json({ message: 'success' })
}