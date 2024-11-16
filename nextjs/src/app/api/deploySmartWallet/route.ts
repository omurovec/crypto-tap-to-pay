import { NextResponse } from "next/server";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  NETWORK_CONFIG,
  NetworkType,
  DEPLOYMENT_ADDRESSES,
} from "@/config/networks";
import { createClient } from "@/utils/contractUtils";
import CustomSmartWalletFactoryABI from "@/abis/CustomSmartWalletFactory.json";

export async function POST(request: Request) {
  try {
    // Get parameters from request body
    const { owner, initialWithdrawLimit, token, network } =
      await request.json();

    if (!owner || !initialWithdrawLimit || !token || !network) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    if (!process.env.MASTER_PRIVATE_KEY) {
      return NextResponse.json(
        { error: "Master private key not configured" },
        { status: 500 }
      );
    }

    const typedNetwork: NetworkType = network as NetworkType;

    // Create wallet client from master private key
    const account = privateKeyToAccount(
      process.env.MASTER_PRIVATE_KEY as `0x${string}`
    );
    const client = createClient(network);
    const walletClient = createWalletClient({
      account: account,
      chain: client.chain,
      transport: http(NETWORK_CONFIG[typedNetwork].rpcUrl),
    });

    // Get precomputed wallet address first
    const [preComputedWalletAddress, isDeployed] = (await client.readContract({
      address: DEPLOYMENT_ADDRESSES[typedNetwork] as `0x${string}`,
      abi: CustomSmartWalletFactoryABI,
      functionName: "getWalletAddress",
      args: [owner, BigInt(initialWithdrawLimit), token],
    })) as [`0x${string}`, boolean];

    console.log("preComputedWalletAddress", preComputedWalletAddress);

    // Simulate the contract call
    const { request: contractRequest } = await client.simulateContract({
      address: DEPLOYMENT_ADDRESSES[typedNetwork] as `0x${string}`,
      abi: CustomSmartWalletFactoryABI,
      functionName: "createSmartWallet",
      args: [owner, BigInt(initialWithdrawLimit), token],
      account: walletClient.account,
    });

    // Execute the transaction
    const hash = await walletClient.writeContract(contractRequest);

    console.log("hash", hash);

    // Wait for transaction receipt
    await client.waitForTransactionReceipt({ hash });

    return NextResponse.json({
      success: true,
      data: {
        hash,
        smartWalletAddress: preComputedWalletAddress,
      },
    });
  } catch (error) {
    console.error("Error deploying smart wallet:", error);
    return NextResponse.json(
      { error: "Failed to deploy smart wallet" },
      { status: 500 }
    );
  }
}
