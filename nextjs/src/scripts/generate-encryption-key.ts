const { randomBytes } = require("crypto");
const { writeFileSync } = require("fs");
const { join } = require("path");

// ... rest of the code remains the same ...

function generateEncryptionKey() {
  // Generate a 32-byte (256-bit) random key
  const key = randomBytes(32);

  // Convert to base64 for storage
  const keyBase64 = key.toString("base64");

  // Create .env.local content
  const envContent = `ENCRYPTION_KEY=${keyBase64}\n`;

  // Write to .env.local file
  try {
    writeFileSync(join(process.cwd(), ".env.local"), envContent);
    console.log("✅ Encryption key generated and saved to .env.local");
    console.log("🔑 Key:", keyBase64);
  } catch (error) {
    console.error("❌ Failed to save encryption key:", error);
  }
}

generateEncryptionKey();
