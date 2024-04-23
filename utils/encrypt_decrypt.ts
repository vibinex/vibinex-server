import * as crypto from 'crypto';

export const generateSecretKey = (): string => {
    return crypto.randomBytes(32).toString('hex'); // 256-bit key
}

export const encrypt = (secretKey: string, data: string): string => {
    try {
        // Generate an initialization vector (IV) from the secret key
        const iv = crypto.randomBytes(16);
        // Create an encryption cipher
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
        let encryptedData: string = cipher.update(data, 'utf8', 'hex');
        encryptedData += cipher.final('hex');
    
        return iv.toString('hex') + ':' + encryptedData;
    } catch (error) {
        console.error('[encrypt] Error encrypting data:', error);
        throw error;
    }
};

export const decrypt = (secretKey: string, data: string): string => {
   try {
       // Generate an initialization vector (IV) from the secret key
        const parts = data.split(':');
        const iv = Buffer.from(parts[0], 'hex');
        const encrypted_text = Buffer.from(parts[1], 'hex');
        // Create a decryption cipher
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
        let decryptedData: string = decipher.update(encrypted_text).toString('utf8');;
        decryptedData += decipher.final();
    
        return decryptedData;
    } catch (error) {
       console.error('[decrypt] Error decrypting data:', error);
       throw error;
   }
};