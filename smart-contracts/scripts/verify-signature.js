const { ec: EC } = require("elliptic");
const { ethers } = require("ethers");

async function verify(px, py, messageHash, r, s, message) {
  const ec = new EC("p256");

  // 1. Verify public key is valid
  try {
    const publicKey = ec.keyFromPublic(
      {
        x: px.slice(2), // remove '0x'
        y: py.slice(2),
      },
      "hex",
    );
    console.log("✅ Public key is valid");
  } catch (e) {
    console.log("❌ Invalid public key");
    return false;
  }

  // 2. Verify the message hash matches keccak256(message)
  const computedHash = ethers.keccak256(message);
  if (computedHash !== messageHash) {
    console.log("❌ Message hash verification failed");
    console.log("Computed:", computedHash);
    console.log("Provided:", messageHash);
    return false;
  }
  console.log("✅ Message hash verified");

  // 3. Verify the signature
  try {
    const publicKey = ec.keyFromPublic(
      {
        x: px.slice(2),
        y: py.slice(2),
      },
      "hex",
    );

    const signature = {
      r: r.slice(2),
      s: s.slice(2),
    };

    const isValid = publicKey.verify(messageHash.slice(2), signature);
    if (isValid) {
      console.log("✅ Signature is valid");
    } else {
      console.log("❌ Invalid signature");
      return false;
    }
  } catch (e) {
    console.log("❌ Signature verification failed:", e);
    return false;
  }

  // 4. Verify the message format
  try {
    // First 20 bytes should be a valid address
    const token = "0x" + message.slice(2, 42);
    if (!ethers.isAddress(token)) {
      console.log("❌ Invalid token address in message");
      return false;
    }

    // Next 32 bytes should be a valid amount
    const amount = ethers.getBigInt("0x" + message.slice(42, 106));
    console.log("✅ Message format is valid");
    console.log("Token:", token);
    console.log("Amount:", amount.toString());
  } catch (e) {
    console.log("❌ Invalid message format:", e);
    return false;
  }

  return true;
}

// You can test the verification by passing the values from the generate script
if (require.main === module) {
  // Replace these with the values from your generate script
  const testValues = {
    px: "0x7c2cda854c888b3c5ef4ddb5cd827efd4d8fb93545aacaf5db348b9784128957", // public key x coordinate
    py: "0xe55627f354dca80a13e75d7d313bd04ba0a9ae3f0c1a4f6dee6fc0a611d64a3c", // public key y coordinate
    messageHash: "0x33e817516544cde5b2c41625384b6cd8a46311438a2ccd0c48506ced9a59e133", // message hash
    r: "0x703e05c727df6f846479cf554b1600a61d69fb03961604b60b95e3fb35733093", // signature r value
    s: "0x0b823f582db05d34e6c7f97c05f34f872e930194c0d415bf9545faf502326a36", // signature s value
    message:
      "0x12345678901234567890123456789012345678900000000000000000000000000000000000000000000000000de0b6b3a7640000", // original message
  };

  verify(testValues.px, testValues.py, testValues.messageHash, testValues.r, testValues.s, testValues.message).then(
    (result) => {
      if (result) {
        console.log("\n✅ All verifications passed!");
      } else {
        console.log("\n❌ Verification failed!");
      }
    },
  );
}

module.exports = { verify };
