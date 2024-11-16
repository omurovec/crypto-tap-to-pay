import { Hex, PrivateKeyAccount, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";

const DOMAIN = {
  name: "CustomSmartWallet",
  version: "1",
  chainId: 1, // mainnet by default
} as const;

const TYPES = {
  Claim: [
    { name: "amount", type: "uint256" },
    { name: "nonce", type: "uint256" },
  ],
} as const;

interface SignatureParams {
  privateKey: Hex;
  amount: bigint;
  nonce: bigint;
  chainId?: number;
}

export async function createClaimSignature({
  privateKey,
  amount,
  nonce,
  chainId = 1,
}: SignatureParams) {
  try {
    // Create account from private key
    const account: PrivateKeyAccount = privateKeyToAccount(privateKey);

    // Create wallet client
    const client = createWalletClient({
      account,
      chain: { ...mainnet, id: chainId },
      transport: http(),
    });

    // Prepare the data to sign
    const message = {
      amount,
      nonce,
    };

    // Sign the typed data
    const signature = await client.signTypedData({
      domain: { ...DOMAIN, chainId },
      types: TYPES,
      primaryType: "Claim",
      message,
    });

    // log the signature, private key, and message object
  } catch (error) {
    console.error("Error creating signature:", error);
    throw error;
  }
}
