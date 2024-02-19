import type { NextApiRequest, NextApiResponse } from 'next';
import { getSetupReposFromDbForUserId } from '../../../utils/db/setup';

export default async function setupRepos(req: NextApiRequest, res: NextApiResponse) {
	// For cors prefetch options request
	if (req.method == "OPTIONS") {
		res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.status(200).send("Ok");
		return;
	}
	// For normal requests
	console.info("[extension/setup] Getting setup repos info for ", req.body.org);
	
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method Not Allowed', message: 'Only POST requests are allowed' });
	}
	const { userId, org, provider } = req.body;
	if (!userId || !org || !provider) {
		return res.status(400).json({ error: 'Bad Request', message: 'All the three arguments user_id, org, and provider are required in the request body' });
	}
	getSetupReposFromDbForUserId(userId, org, provider)
	.then((repos: string[]) => {
		res.status(200).json({ repos: repos });
	})
	.catch((error: Error) => {
		console.error('[extension/setup] Error fetching repositories from database for user_id: ' + userId + ' , org: ' + org + ' and provider: ' + provider, error);
		res.status(500).json({ error: 'Internal Server Error', message: 'An error occurred while fetching repositories from the database' });
	});
}
