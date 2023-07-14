import crypto from "crypto";

const key = 'JaNdRgUkXp2s5u8x/A?D(G+KbPeShVmY'; // Replace with your secret key
export const encryptToken = (token: string | undefined ) => {
    const algorithm = "aes-256-cbc";
    const iv = crypto.randomBytes(16).toString('hex').substring(0,16); // Generate a random initialization vector
  
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    if(token == undefined) return "hello";
    let encrypted = cipher.update(token, "utf8", "hex");
    encrypted += cipher.final("hex");
    console.log(encrypted);
    return iv+encrypted;
  };
  export const decryptToken = (encryptedToken: string) => {
    const algorithm = "aes-256-cbc";
    
  
    const iv = encryptedToken.substring(0, 16);
    const encryptedData = encryptedToken.substring(16);
  
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
  };
