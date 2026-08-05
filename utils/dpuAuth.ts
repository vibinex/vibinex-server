import type { NextApiRequest, NextApiResponse } from 'next';
import { timingSafeEqual } from 'crypto';

function safeCompare(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export function validateDpuAuth(req: NextApiRequest, res: NextApiResponse, requestId?: string): boolean {
	const configuredToken = process.env.DPU_AUTH_TOKEN;
	if (!configuredToken) {
		console.error('[validateDpuAuth] DPU_AUTH_TOKEN is not configured');
		res.status(500).json(requestId
			? { code: 'DPU_AUTH_NOT_CONFIGURED', message: 'DPU auth is not configured', requestId }
			: { error: 'DPU auth is not configured' });
		return false;
	}
	const authHeader = req.headers.authorization;
	const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : undefined;
	const headerToken = req.headers['x-dpu-auth-token'];
	const providedToken = bearerToken ?? (Array.isArray(headerToken) ? headerToken[0] : headerToken);
	if (!providedToken || !safeCompare(providedToken, configuredToken)) {
		res.status(401).json(requestId
			? { code: 'UNAUTHORIZED', message: 'Unauthorized', requestId }
			: { error: 'Unauthorized' });
		return false;
	}
	return true;
}
