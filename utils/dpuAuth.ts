import type { NextApiRequest, NextApiResponse } from 'next';

export function validateDpuAuth(req: NextApiRequest, res: NextApiResponse): boolean {
	const configuredToken = process.env.DPU_AUTH_TOKEN;
	if (!configuredToken) {
		console.error('[validateDpuAuth] DPU_AUTH_TOKEN is not configured');
		res.status(500).json({ error: 'DPU auth is not configured' });
		return false;
	}
	const authHeader = req.headers.authorization;
	const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : undefined;
	const headerToken = req.headers['x-dpu-auth-token'];
	const providedToken = bearerToken ?? (Array.isArray(headerToken) ? headerToken[0] : headerToken);
	if (providedToken !== configuredToken) {
		res.status(401).json({ error: 'Unauthorized' });
		return false;
	}
	return true;
}
