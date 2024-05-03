import * as jose from 'node-jose';

interface KeyPair { 
    publicKey: string;
    privateKey: string;
}
const generateJWKKeyPair = async (): Promise<KeyPair> => { // Created this function so that in future we can use this to generate keyPair whenever needed. Currently this is not used anywhere.
    const keyStore = jose.JWK.createKeyStore();
    const keyPair = await keyStore.generate('RSA', 2048, {
      alg: 'RSA-OAEP',
      use: 'enc'
    });
  
    return {
        publicKey: JSON.stringify(keyPair.toJSON()),
        privateKey: JSON.stringify(keyPair.toJSON(true))
    };
}

export const encrypt = async (publicKey: string, data: string): Promise<string> => {
    try {
        const key = await jose.JWK.asKey(publicKey, 'json');
        const result = await jose.JWE.createEncrypt({ format: 'compact' }, key)
        .update(data)
        .final();
        return result;
    } catch (error) {
        console.error('[encrypt] Error encrypting data:', error);
        throw error;
    }
};
  
export const decrypt = async (privateKey: string, encryptedData: string): Promise<string> => {
    try {
        const key = await jose.JWK.asKey(privateKey, 'json');
        const result = await jose.JWE.createDecrypt(key).decrypt(encryptedData);
        return result.plaintext.toString('utf8');
    } catch (error) {
        console.error('[decrypt] Error decrypting data:', error);
        throw error;
    }
};