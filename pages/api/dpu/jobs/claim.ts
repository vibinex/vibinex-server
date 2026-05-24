import type { NextApiRequest, NextApiResponse } from 'next';
import { claimDpuJobs } from '../../../../utils/db/dpuJobs';
import { validateDpuAuth } from '../../../../utils/dpuAuth';

const DEFAULT_LEASE_SECONDS = 300;
const MAX_CLAIM_LIMIT = 10;

export default async function claimHandler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		res.status(405).json({ error: 'Method Not Allowed' });
		return;
	}
	if (!validateDpuAuth(req, res)) return;

	const { installationId, maxJobs, leaseSeconds } = req.body;
	if (!installationId || typeof installationId !== 'string') {
		res.status(400).json({ error: 'installationId is required' });
		return;
	}

	const limit = Math.min(Number(maxJobs) || 1, MAX_CLAIM_LIMIT);
	const lease = Number(leaseSeconds) || DEFAULT_LEASE_SECONDS;
	const jobs = await claimDpuJobs(installationId, limit, lease).catch((err) => {
		console.error('[claimHandler] Failed to claim jobs', err);
		return null;
	});
	if (jobs === null) {
		res.status(500).json({ error: 'Unable to claim jobs' });
		return;
	}

	res.status(200).json({
		jobs: jobs.map(job => ({
			id: job.id.toString(),
			msgType: job.msg_type,
			payload: job.payload,
			attempts: job.attempts,
		})),
	});
}
