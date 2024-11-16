const { verifyTypedData } = require("viem");

// Define your EIP-712 type data structure
const domain = {
  name: "CustomSmartWallet",
  version: "1",
  chainId: 84532,
  // verifyingContract: "0x0C140815B151E5abA9B10e4efd0255ca00fA7Ffc",
};

// Define the types of your struct
const types = {
  Claim: [
    { name: "amount", type: "uint256" },
    { name: "nonce", type: "uint256" },
  ],
};

async function verifySignature(signature, signerAddress, message) {
  try {
    const valid = await verifyTypedData({
      address: signerAddress,
      domain,
      types,
      primaryType: "Claim",
      message,
      signature,
    });

    console.log("Signature is valid:", valid);
    return valid;
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
}

// Example usage
async function main() {
  const testSignature =
    "0xebfd872c6635eee74693f1c8b67feb48415668d9e5a87c1f190f4fcaafdfbfc16cf3ca4f4457927556941429ca2deede36dda35cdae78a6d9d7e190eefc4ce051b"; // Your signature here
  const testAddress = "0xC5708cD9b41820577833E844573815b03d8D7Ed2"; // Signer's address
  const testMessage = {
    amount: BigInt("1000000"), // 1 ETH in wei
    nonce: BigInt(0),
  };

  await verifySignature(testSignature, testAddress, testMessage);
}

main();
