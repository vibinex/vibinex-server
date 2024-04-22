import * as crypto from 'crypto';

export const generateSecretKey = (): string => {
    return crypto.randomBytes(32).toString('hex'); // 256-bit key
}

export const encrypt = (secretKey: string, data: string): string => {
    // Generate an initialization vector (IV) from the secret key
    const iv = crypto.createHash('sha256').update(secretKey).digest('hex').slice(0, 16);
    // Create an encryption cipher
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), Buffer.from(iv, 'hex'));
    let encryptedData: string = cipher.update(data, 'utf8', 'hex');
    encryptedData += cipher.final('hex');

    return encryptedData;
};

export const decrypt = (secretKey: string, data: string): string => {
    // Generate an initialization vector (IV) from the secret key
    const iv = crypto.createHash('sha256').update(secretKey).digest('hex').slice(0, 16);
    // Create a decryption cipher
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), Buffer.from(iv, 'hex'));
    let decryptedData: string = decipher.update(data, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');

    return decryptedData;
};