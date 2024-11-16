const { ec: EC } = require("elliptic");
const { ethers } = require("ethers");

// Initialize the P-256 curve
const ec = new EC("p256");

async function main() {
  // Generate key pair
  const keyPair = ec.genKeyPair();

  // Get public key coordinates (px, py)
  const px = "0x" + keyPair.getPublic().getX().toString("hex").padStart(64, "0");
  const py = "0x" + keyPair.getPublic().getY().toString("hex").padStart(64, "0");

  // Create a sample message
  // We'll create a message containing:
  // - token address (20 bytes)
  // - amount (32 bytes)
  const tokenAddress = "0x5615dEB798BB3E4dFa0139dFa1b3D433Cc23b72f";
  const amount = ethers.parseEther("1.0");

  // Concatenate the message parts
  const message = ethers.concat([tokenAddress, ethers.zeroPadValue(ethers.toBeHex(amount), 32)]);

  // Hash the message
  const messageHash = ethers.keccak256(message);

  // Sign the message hash
  const signature = keyPair.sign(messageHash.slice(2), { canonical: true });

  // Get r and s values from signature
  const r = "0x" + signature.r.toString("hex").padStart(64, "0");
  const s = "0x" + signature.s.toString("hex").padStart(64, "0");

  console.log("Public Key X:", px);
  console.log("Public Key Y:", py);
  console.log("Message:", message);
  console.log("Message Hash:", messageHash);
  console.log("Signature R:", r);
  console.log("Signature S:", s);
}

main().catch(console.error);
