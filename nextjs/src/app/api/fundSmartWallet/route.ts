import { NextResponse } from "next/server";
import { parseEther, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { NETWORK_CONFIG, NetworkType } from "@/config/networks";
import { createClient } from "@/utils/contractUtils";

export async function POST(request: Request) {
  try {
    // Get the recipient address from request body
    const { address, network } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: "Recipient address is required" },
        { status: 400 }
      );
    }

    if (!network) {
      return NextResponse.json(
        { error: "Network config is required" },
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

    // Send a small amount of native
    const hash = await walletClient.sendTransaction({
      to: address as `0x${string}`,
      value: parseEther("0.0001"),
    });

    return NextResponse.json({
      success: true,
      data: {
        hash,
      },
    });
  } catch (error) {
    console.error("Error funding wallet:", error);
    return NextResponse.json(
      { error: "Failed to fund wallet" },
      { status: 500 }
    );
  }
}
