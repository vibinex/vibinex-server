import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt'

export default async function triggeHandler(req: NextApiRequest, res: NextApiResponse) {
	// For cors prefetch options request
	if (req.method == "OPTIONS") {
		res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.status(200).send("Ok");
		return;
	}
	// For normal requests
	console.info("[extension/triggeHandler] Getting setup repos info for ", req.body.owner);

	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method Not Allowed', message: 'Only POST requests are allowed' });
	}
    const user = await getToken({ req: req }).catch((err) => {
		console.error("[bitbucket/relevant] Error getting user token", err);
		return null;
	});
    if (!user || !user.email) {
        console.error("[bitbucket/relevant] Error getting user");
        return res.status(401).json({ error: 'Unauthenticated', message: 'Incorrect auth token in request' });
    }
	const { url } = req.body;
	if (!url) {
        console.error("[bitbucket/relevant] Error parsing url");
		return res.status(400).json({ error: 'Bad Request', message: 'url is required in the request body' });
	}
    
	await triggerDPU(url, user.email)
		.catch((error: Error) => {
			console.error('[extension/setup] Error triggering dpu for: ' + user.id + ' and pr: ' + url, error);
			res.status(500).json({ error: 'Internal Server Error', message: 'An error occurred while triggering dpu' });
		});
    res.status(200);
}
async function triggerDPU(url: any, userEmail: string) {
    // parse url for repo name, owner, pr, provider
    // get user id
    // get repo config
    // prepare body
    // get topic id
    // publish
    throw new Error('Function not implemented.');
}

