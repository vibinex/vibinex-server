import type { NextApiRequest, NextApiResponse } from 'next';
import { getSetupReposFromDbForOwner } from '../../../utils/db/setup';
import rudderStackEvents from '../events';

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
	await getSetupReposFromDbForOwner(owner, provider)
		.then((repos: string[]) => {
			rudderStackEvents.track(req.body.user_id, "", 'chrome_extension_event', {
				...req.body,
				function: 'repos_in_org',
				resultLength: repos.length,
				eventStatusFlag: 1
			});
			res.status(200).json({ repos: repos });
		})
		.catch((error: Error) => {
			console.error('[extension/setup] Error fetching repositories from database for org: ' + owner + ' and provider: ' + provider, error);
			rudderStackEvents.track(req.body.user_id, "", 'chrome_extension_event', {
				...req.body,
				function: 'repos_in_org',
				eventStatusFlag: 0
			});
			res.status(500).json({ error: 'Internal Server Error', message: 'An error occurred while fetching repositories from the database' });
		});
}
