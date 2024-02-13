import type { NextApiRequest, NextApiResponse } from 'next';
import { getGithubReposFromDbForUserId } from '../../../../utils/db/setup';

export default async function githubSetupRepos(req: NextApiRequest, res: NextApiResponse) {
	// For cors prefetch options request
	if (req.method == "OPTIONS") {
		res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Content-Type, Authorization");
		res.status(200).send("Ok");
		return;
	}
	// For normal requests
	console.info("[extension/setup/github] Getting setup repos info for ", req.body.org);
	
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method Not Allowed', message: 'Only POST requests are allowed' });
	}
	const { user_id: userId, org } = req.body;
	if (!userId || !org) {
		return res.status(400).json({ error: 'Bad Request', message: 'Both user_id and org are required in the request body' });
	}
	getGithubReposFromDbForUserId(userId, org, 'github')
	.then((repos: string[]) => {
		res.status(200).json({ repos: repos });
	})
	.catch((error: Error) => {
		console.error('Error fetching repositories from database for user_id: ' + userId + ' and org: ' + org, error);
		res.status(500).json({ error: 'Internal Server Error', message: 'An error occurred while fetching repositories from the database' });
	});
}
