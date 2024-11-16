const { randomBytes } = require("crypto");
const { writeFileSync } = require("fs");
const { join } = require("path");

function generatePrivateKey() {
  // Generate a 32-byte (256-bit) random private key
  const privateKey = randomBytes(32);

  // Convert to hexadecimal
  const privateKeyHex = privateKey.toString("hex");

  // Add '0x' prefix
  const formattedPrivateKey = `0x${privateKeyHex}`;

  // Create .env.local content
  const envContent = `WALLET_PRIVATE_KEY=${formattedPrivateKey}\n`;

  // Write to .env.local file
  try {
    writeFileSync(join(process.cwd(), ".env.local"), envContent, { flag: "a" });
    console.log("✅ Private key generated successfully");
    console.log("🔑 Private Key:", formattedPrivateKey);
    console.log("⚠️  Keep this key secure and never share it!");
  } catch (error) {
    console.error("❌ Failed to save private key:", error);
  }
}

generatePrivateKey();
