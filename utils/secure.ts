import * as crypto from 'crypto';


// const key = crypto.randomBytes(32);


export function encryptToken(data: string | undefined): string {
  const algorithm = 'aes-256-cbc';
  const iv = crypto.randomBytes(16);
  const key = 'JaNdRgUkXp2s5u8x/A?D(G+KbPeShVmY'
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  cipher.setAutoPadding(true);
  if(data === undefined) return "null";
  let encryptedData = cipher.update(data, 'utf8', 'hex');
  encryptedData += cipher.final('hex');

  const combinedData = `${iv.toString('hex')}:${encryptedData}`;
  return combinedData;
}


export function decryptToken(combinedData: string): string {
  const algorithm = 'aes-256-cbc';
  const key = 'JaNdRgUkXp2s5u8x/A?D(G+KbPeShVmY'
  const ivLength = 32; // Length of the IV in characters
  const iv = combinedData.substring(0, ivLength);
  const encryptedData = combinedData.substring(ivLength + 1); // Skip the ":" separator

  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
  decipher.setAutoPadding(true);

  let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
  decryptedData += decipher.final('utf8');

  return decryptedData;
}

// const dataToEncrypt = 'Hello, loloposdjvbvdivp';
// const combinedData = encryptToken(dataToEncrypt);
// const decryptedData = decryptToken(combinedData);

// console.log('Decrypted Data:', decryptedData);
