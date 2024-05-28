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
		const eventProperties = { response_status: 405 };
		rudderStackEvents.track("absent", "", 'chrome_extension_event', { function: "setup_handler", type: 'HTTP-405', eventStatusFlag: 0, eventProperties });
		return res.status(405).json({ error: 'Method Not Allowed', message: 'Only POST requests are allowed' });
	}
	const { owner, provider, user_id } = req.body;
	const event_properties = {
		repo_provider: provider || "",
		repo_owner: owner || ""
	};
	if (!owner || !provider || !user_id) {
		const eventProperties = { ...event_properties, response_status: 400 };
		rudderStackEvents.track(user_id ?? "absent", "", 'chrome_extension_event', { function: "setup_handler", type: 'HTTP-400', eventStatusFlag: 0, eventProperties });
		return res.status(400).json({ error: 'Bad Request', message: 'Missing required fields: owner, provider, or user_id' });
	}
	await getSetupReposFromDbForOwner(owner, provider)
		.then((repos: string[]) => {
			const eventProperties = { ...event_properties, response_status: 200, result_length: repos.length };
			rudderStackEvents.track(user_id, "", 'chrome_extension_event', {
				type: 'HTTP-200',
				function: 'repos_in_org',
				eventStatusFlag: 1,
				eventProperties
			});
			res.status(200).json({ repos: repos });
		})
		.catch((error: Error) => {
			console.error('[extension/setup] Error fetching repositories from database for org: ' + owner + ' and provider: ' + provider, error);
			const eventProperties = { ...event_properties, response_status: 500 };
			rudderStackEvents.track(user_id, "", 'chrome_extension_event', {
				type: 'HTTP-500',
				function: 'repos_in_org',
				eventStatusFlag: 0,
				eventProperties
			});
			res.status(500).json({ error: 'Internal Server Error', message: 'An error occurred while fetching repositories from the database' });
		});
}
