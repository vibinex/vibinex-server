import type { NextApiRequest, NextApiResponse } from 'next';
import { getGithubReposFromDbForUserId } from '../../../../utils/db/setup';

interface ErrorResponse {
	error: string;
	message: string;
}

interface SuccessResponse {
	repos: string[];
}

export default async function githubSetupRepos(req: NextApiRequest, res: NextApiResponse<ErrorResponse | SuccessResponse>) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method Not Allowed', message: 'Only POST requests are allowed' });
	}
	const { user_id, org } = req.body;
	if (!user_id || !org) {
		return res.status(400).json({ error: 'Bad Request', message: 'Both user_id and org are required in the request body' });
	}
	getGithubReposFromDbForUserId(user_id, org, 'github')
	.then((repos: string[]) => {
		res.status(200).json({ repos: repos });
	})
	.catch((error: Error) => {
		console.error('Error fetching repositories from database:', error);
		res.status(500).json({ error: 'Internal Server Error', message: 'An error occurred while fetching repositories from the database' });
	});
}
