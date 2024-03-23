import type { NextApiRequest, NextApiResponse } from 'next';
import { getSetupReposFromDbForOwner } from '../../../utils/db/setup';

const allowedOrigins = ["chrome-extension://jafgelpkkkopeaefadkdjcmnicgpcncc", "https://github.com", "https://bitbucket.org"];

export default async function setupRepos(req: NextApiRequest, res: NextApiResponse) {
	// For cors prefetch options request
	if (req.method == "OPTIONS") {
		res.status(200).send("Ok");
		return;
	}
	// For normal requests
	console.info("[extension/setup] Getting setup repos info for ", req.body.owner);

	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method Not Allowed', message: 'Only POST requests are allowed' });
	}
	const { owner, provider } = req.body;
	if (!owner || !provider) {
		return res.status(400).json({ error: 'Bad Request', message: 'Both the arguments owner, and provider are required in the request body' });
	}
	getSetupReposFromDbForOwner(owner, provider)
		.then((repos: string[]) => {
			res.status(200).json({ repos: repos });
		})
		.catch((error: Error) => {
			console.error('[extension/setup] Error fetching repositories from database for org: ' + owner + ' and provider: ' + provider, error);
			res.status(500).json({ error: 'Internal Server Error', message: 'An error occurred while fetching repositories from the database' });
		});
}
