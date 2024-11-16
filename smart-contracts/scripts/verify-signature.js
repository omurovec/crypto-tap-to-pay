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
    px: "0xd961005d2b19b117c27187fb4bffc0d5b96c8f39eb0c7476fb69e6efc88fa5be", // public key x coordinate
    py: "0x848150bcbdc70e6545f27070b840f9f5188bb8cad0cab28e107e200be9cde9d2", // public key y coordinate
    messageHash: "0xe4d0913917d989d1ab859b505e44b82b5f965f2bee770b1326e454b78a4bd461", // message hash
    r: "0x15c0a726128247fa8915857e30cc0454ca7a6c6ebaecf5b06e0911ec53e30ff6", // signature r value
    s: "0x5f24e9f8ad87806c13a060d21e731d4ac90ed0fda618dd55a8a93b4c16a592b4", // signature s value
    message:
      "0x5615deb798bb3e4dfa0139dfa1b3d433cc23b72f0000000000000000000000000000000000000000000000000de0b6b3a7640000", // original message
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
