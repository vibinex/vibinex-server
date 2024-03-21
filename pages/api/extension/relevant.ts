import { NextApiRequest, NextApiResponse } from 'next'
import { getReviewData, getFileData, getHunkData, HunkInfo } from '../../../utils/db/relevance'
import { getToken } from 'next-auth/jwt'
import { getUserEmails } from '../../../utils/db/users'
import rudderStackEvents from '../events'

const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
	const user = await getToken({ req: req }).catch((err) => {
		console.error("[bitbucket/relevant] Error getting user token", err);
		return null;
	});
	return (user?.email) ? await getUserEmails(user.email) : new Set<string>();
}

const relevantHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	// For cors prefetch options request
	if (req.method == "OPTIONS") {
		res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin, Content-Type, Authorization");
		res.status(200).send("Ok");
		return;
	}
	// For normal requests
	if (!("repo_provider" in req.body) ||
		!("repo_owner" in req.body) ||
		!("repo_name" in req.body) ||
		!("user_id" in req.body)) {
		res.status(401).json({ error: 'Invalid request body' });
	}
	console.info("[extension/relevant] Getting relevant info for ", req.body.repo_name);
	const user_emails = await getUser(req, res);
	const { type } = req.query;
	let formattedData;
	if (type === 'review') {
		const reviewDb = await getReviewData(req.body.repo_provider,
			req.body.repo_owner,
			req.body.repo_name,
			user_emails
		).catch(err => {
			console.error("[extension/relevant] Error getting review data", err);
		});
		if (!reviewDb) {
			rudderStackEvents.track(req.body.user_id, "", 'chrome_extension_event', {
				...req.body,
				function: 'relevant_prs',
				eventStatusFlag: 0
			});
			res.status(500).json({ error: 'Internal server error' });
			return;
		}
		formattedData = formatReviewResponse(reviewDb);
		rudderStackEvents.track(req.body.user_id, "", 'chrome_extension_event', {
			...req.body,
			function: 'relevant_prs',
			eventStatusFlag: 1
		});
	} else if (type === 'file') {
		if (!("pr_number" in req.body)) {
			res.status(400).json({ error: 'Invalid request body' });
			return;
		}
		const fileSet = await getFileData(req.body.repo_provider,
			req.body.repo_owner,
			req.body.repo_name,
			req.body.pr_number,
			user_emails);
		formattedData = formatFileResponse(fileSet);
		rudderStackEvents.track(req.body.user_id, "", 'chrome_extension_event', {
			...req.body,
			function: 'relevant_file',
			resultLength: formattedData.files.length,
			eventStatusFlag: 1
		});
	} else if (type === 'hunk') {
		if (!("pr_number" in req.body)) {
			res.status(400).json({ error: 'Invalid request body' });
			return;
		}
		const hunkRes = await getHunkData(req.body.repo_provider,
			req.body.repo_owner,
			req.body.repo_name,
			req.body.pr_number,
			user_emails
		).catch(err => {
			console.error("[extension/relevant] Error getting hunk data", err);
		});
		if (!hunkRes) {
			rudderStackEvents.track(req.body.user_id, "", 'chrome_extension_event', {
				...req.body,
				function: 'relevant_hunks',
				eventStatusFlag: 0
			});
			res.status(500).json({ error: 'Internal server error' });
			return;
		}
		formattedData = formatHunkResponse(hunkRes);
		rudderStackEvents.track(req.body.user_id, "", 'chrome_extension_event', {
			...req.body,
			function: 'relevant_hunks',
			resultLength: formattedData.hunkinfo.length,
			eventStatusFlag: 1
		});
	}
	res.status(200).json(formattedData);
}

const formatReviewResponse = (queryRes: { review_id: string, blamevec: HunkInfo[] }[]) => {
	const prs = new Map();
	for (const pullRequestObj of queryRes) {
		if (pullRequestObj.blamevec.length) {
			prs.set(pullRequestObj.review_id, { "num_hunks_changed": pullRequestObj.blamevec.length });
		}
	}
	const prsObj: { [key: string]: any } = {};
	prs.forEach((value, key) => {
		prsObj[key] = value;
	});
	return { "relevant": prsObj };
}

const formatFileResponse = (queryRes: Set<string>) => {
	return {
		"files": Array.from(queryRes)
	};
}

function formatHunkResponse(queryRes: HunkInfo[]) {
	return {
		"hunkinfo": queryRes
	};
}

export default relevantHandler;