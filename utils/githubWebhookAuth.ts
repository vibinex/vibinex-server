import { createHmac, timingSafeEqual } from 'crypto';

const SIGNATURE_PREFIX = 'sha256=';

export const verifyGithubWebhookSignature = (
	payload: Buffer,
	signature: string | string[] | undefined,
	secret = process.env.GITHUB_WEBHOOK_SECRET,
): boolean => {
	if (!secret || !signature || Array.isArray(signature) || !signature.startsWith(SIGNATURE_PREFIX)) {
		return false;
	}

	const expected = Buffer.from(
		SIGNATURE_PREFIX + createHmac('sha256', secret).update(payload).digest('hex'),
		'utf8',
	);
	const provided = Buffer.from(signature, 'utf8');
	return expected.length === provided.length && timingSafeEqual(expected, provided);
};
