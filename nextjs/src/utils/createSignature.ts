import { Hex, PrivateKeyAccount, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { isEthereumWallet } from "@dynamic-labs/ethereum";

const DOMAIN = {
  name: "CustomSmartWallet",
  version: "1",
  chainId: 84532, // base sepolia by default
} as const;

const TYPES = {
  Claim: [
    { name: "amount", type: "uint256" },
    { name: "nonce", type: "uint256" },
  ],
} as const;

interface SignatureParams {
  primaryWallet: any;
  amount: bigint;
  nonce: bigint;
  chainId?: number;
}

export async function createClaimSignature({
  primaryWallet,
  amount,
  nonce,
  chainId = 84532,
}: SignatureParams) {
  try {
    if (!isEthereumWallet(primaryWallet)) {
      console.log("errorr");
      return;
    }

    console.log("Creating signature...");
    const walletClient = await primaryWallet.getWalletClient();

    // Prepare the data to sign
    const message = {
      amount,
      nonce,
    };

    // Sign the typed data
    const signature = await walletClient.signTypedData({
      domain: { ...DOMAIN, chainId },
      types: TYPES,
      primaryType: "Claim",
      message,
    });

    return signature;

    // log the signature, private key, and message object
  } catch (error) {
    console.error("Error creating signature:", error);
    throw error;
  }
}
