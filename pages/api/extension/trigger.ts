import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt'

export default async function triggeHandler(req: NextApiRequest, res: NextApiResponse) {
	// For cors prefetch options request
	if (req.method == "OPTIONS") {
		res.status(200).send("Ok");
		return;
	}
	// For normal requests
	console.info("[extension/triggeHandler] Getting setup repos info for ", req.body.url);

	if (req.method !== 'POST') {
		res.status(405).json({ error: 'Method Not Allowed', message: 'Only POST requests are allowed' });
		return;
	}
    const user = await getToken({ req: req }).catch((err) => {
		console.error("[extension/triggeHandler] Error getting user token", err);
		return null;
	});
    if (!user?.email) {
        console.error("[extension/triggeHandler] Error getting user");
        res.status(401).json({ error: 'Unauthenticated', message: 'Incorrect auth token in request' });
		return;
	}
	const { url } = req.body;
	if (!url) {
        console.error("[extension/triggeHandler] Error parsing url");
		res.status(400).json({ error: 'Bad Request', message: 'url is required in the request body' });
		return;
	}
    
	try {
		await triggerDPU(url, user.email);	
	} catch (error) {
		console.error('[extension/triggeHandler] Error triggering dpu for: ' + user.id + ' and pr: ' + url, error);
		res.status(500).json({ error: 'Internal Server Error', message: 'An error occurred while triggering dpu' });
		return;
	}
    res.status(200).json({message: "DPU triggered!"});
	return;
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

