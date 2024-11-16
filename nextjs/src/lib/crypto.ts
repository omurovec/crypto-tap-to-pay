import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

// In production, these should be secure environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
  ? Buffer.from(process.env.ENCRYPTION_KEY, "base64")
  : randomBytes(32); // Fallback for development
const ALGORITHM = "aes-256-gcm";

export function encrypt(text: string) {
  try {
    // Generate a random IV for each encryption
    const iv = randomBytes(12);
    const cipher = createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

    // Encrypt the text
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    // Get authentication tag
    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString("hex"),
      authTag: authTag.toString("hex"),
    };
  } catch (error) {
    console.error("Encryption error:", error);
    throw error;
  }
}

export function decrypt(encrypted: string, iv: string, authTag: string) {
  try {
    console.log("Decrypting with:", {
      encrypted: encrypted.slice(0, 32) + "...",
      iv,
      authTag,
    });

    const decipher = createDecipheriv(
      ALGORITHM,
      ENCRYPTION_KEY,
      Buffer.from(iv, "hex")
    );

    decipher.setAuthTag(Buffer.from(authTag, "hex"));

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    throw error;
  }
}
