import { createHmac } from 'crypto';
import { verifyGithubWebhookSignature } from './githubWebhookAuth';

const secret = 'test-webhook-secret';
const payload = Buffer.from('{"repository":{"name":"example"}}', 'utf8');
const sign = (body = payload) => `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`;

describe('verifyGithubWebhookSignature', () => {
	it('accepts a valid GitHub SHA-256 signature', () => {
		expect(verifyGithubWebhookSignature(payload, sign(), secret)).toBe(true);
	});

	it.each([
		[undefined],
		['sha1=not-supported'],
		['sha256=not-a-valid-signature'],
	])('rejects missing or malformed signatures', (signature) => {
		expect(verifyGithubWebhookSignature(payload, signature, secret)).toBe(false);
	});

	it('rejects a signature for a changed payload', () => {
		expect(verifyGithubWebhookSignature(Buffer.from('tampered'), sign(), secret)).toBe(false);
	});

	it('fails closed when the webhook secret is not configured', () => {
		expect(verifyGithubWebhookSignature(payload, sign(), undefined)).toBe(false);
	});
});
