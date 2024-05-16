import { generateJWKKeyPair } from './encryptDecrypt';

describe('generateJWKKeyPair', () => {
	it('should generate a key pair', async () => {
		const keyPair = await generateJWKKeyPair();
		console.dir(keyPair);

		expect(keyPair).toHaveProperty('publicKey');
		expect(keyPair).toHaveProperty('privateKey');

		const publicKey = JSON.parse(keyPair.publicKey);
		expect(publicKey).toHaveProperty('kty');
		expect(publicKey).toHaveProperty('e');
		expect(publicKey).toHaveProperty('n');

		const privateKey = JSON.parse(keyPair.privateKey);
		expect(privateKey).toHaveProperty('kty');
		expect(privateKey).toHaveProperty('e');
		expect(privateKey).toHaveProperty('n');
		expect(privateKey).toHaveProperty('d');
		expect(privateKey).toHaveProperty('p');
		expect(privateKey).toHaveProperty('q');
		expect(privateKey).toHaveProperty('dp');
		expect(privateKey).toHaveProperty('dq');
		expect(privateKey).toHaveProperty('qi');
	});

	it('should generate different key pairs', async () => {
		const keyPair1 = await generateJWKKeyPair();
		const keyPair2 = await generateJWKKeyPair();

		expect(keyPair1).not.toEqual(keyPair2);
	});
});
