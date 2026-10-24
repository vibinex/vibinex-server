import type { NextApiRequest, NextApiResponse } from 'next';
import { ackDpuJob } from '../../../../utils/db/dpuJobs';
import { validateDpuAuth } from '../../../../utils/dpuAuth';

export default async function ackHandler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		res.status(405).json({ error: 'Method Not Allowed' });
		return;
	}
	if (!validateDpuAuth(req, res)) return;

	const { jobId, installationId, claimGeneration } = req.body;
	if (!jobId || !installationId || !claimGeneration) {
		res.status(400).json({ error: 'jobId, installationId, and claimGeneration are required' });
		return;
	}

	const acknowledged = await ackDpuJob(jobId.toString(), installationId.toString(), claimGeneration.toString()).catch((err) => {
		console.error('[ackHandler] Failed to acknowledge job', err);
		return null;
	});
	if (acknowledged === null) {
		res.status(500).json({ error: 'Unable to acknowledge job' });
		return;
	}
	if (!acknowledged) {
		res.status(409).json({ error: 'Claim lease lost or expired' });
		return;
	}
	res.status(200).json({ ok: true });
}
