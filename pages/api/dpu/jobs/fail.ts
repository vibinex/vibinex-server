import type { NextApiRequest, NextApiResponse } from 'next';
import { failDpuJob } from '../../../../utils/db/dpuJobs';
import { validateDpuAuth } from '../../../../utils/dpuAuth';

export default async function failHandler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		res.status(405).json({ error: 'Method Not Allowed' });
		return;
	}
	if (!validateDpuAuth(req, res)) return;

	const { jobId, installationId, error, retry } = req.body;
	if (!jobId || !installationId) {
		res.status(400).json({ error: 'jobId and installationId are required' });
		return;
	}

	const failed = await failDpuJob(
		jobId.toString(),
		installationId.toString(),
		typeof error === 'string' ? error : '',
		retry !== false,
	).catch((err) => {
		console.error('[failHandler] Failed to mark job failed', err);
		return null;
	});
	if (failed === null) {
		res.status(500).json({ error: 'Unable to fail job' });
		return;
	}
	if (!failed) {
		res.status(404).json({ error: 'No processing job found' });
		return;
	}
	res.status(200).json({ ok: true });
}
