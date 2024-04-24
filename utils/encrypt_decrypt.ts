import * as crypto from 'crypto';

export const generateSecretKey = (): string => {
    return crypto.randomBytes(32).toString('hex'); // 256-bit key
}

export const encrypt = (secretKey: string, data: string): string => {
    try {
        // Generate an initialization vector (IV) from the secret key
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(secretKey, 'hex'), iv);
        // Encrypt the data
        let encryptedData = cipher.update(data, 'utf8', 'hex');
        encryptedData += cipher.final('hex');

        // Get the authentication tag
        const tag = cipher.getAuthTag();

        // Combine IV, encrypted data, and authentication tag
        const encryptedPayload = `${iv.toString('hex')}:${encryptedData}:${tag.toString('hex')}`;

        return encryptedPayload;
    } catch (error) {
        console.error('[encrypt] Error encrypting data:', error);
        throw error;
    }
};

export const decrypt = (secretKey: string, data: string): string => {
   try {
        // Split the encrypted payload into IV, encrypted data, and authentication tag
        const [ivHex, encryptedDataHex, tagHex] = data.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const encryptedData = Buffer.from(encryptedDataHex, 'hex');
        const tag = Buffer.from(tagHex, 'hex');

        // Create a decipher using AES-GCM
        const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(secretKey, 'hex').toString('hex'), iv);
        decipher.setAuthTag(tag);

        // Decrypt the data
        let decryptedData = decipher.update(encryptedData).toString(('utf8'));
        decryptedData += decipher.final('utf8');
        return decryptedData;
    } catch (error) {
       console.error('[decrypt] Error decrypting data:', error);
       throw error;
   }
};