import { useState } from "react";
import { Address, WalletClient, createWalletClient, http } from "viem";
import { NetworkType } from "@/config/networks";
import { DEPLOYMENT_ADDRESSES } from "@/config/networks";
import { createClient } from "@/utils/contractUtils";
import CustomSmartWalletABI from "@/abis/CustomSmartWallet.json";

interface UseClaimFundsProps {
  walletAddress: Address;
  network?: NetworkType;
  wallet: WalletClient | `0x${string}`; // Can accept wallet client or private key
}

interface ClaimFundsResult {
  claimFunds: (signature: string, amount: bigint) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export function useClaimFunds({
  network = "base",
  wallet,
}: UseClaimFundsProps): ClaimFundsResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const claimFunds = async (signature: string, amount: bigint) => {
    try {
      setIsLoading(true);
      setError(null);

      const client = createClient(network);

      // Create wallet client if private key provided
      const walletClient =
        typeof wallet === "string"
          ? createWalletClient({
              account: wallet,
              chain: client.chain,
              transport: http(),
            })
          : wallet;

      const { request } = await client.simulateContract({
        address: DEPLOYMENT_ADDRESSES[network] as `0x${string}`,
        abi: CustomSmartWalletABI,
        functionName: "claimFunds",
        args: [signature, amount],
        account: walletClient.account,
      });

      // Execute the transaction
      await walletClient.writeContract(request);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to claim funds");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    claimFunds,
    isLoading,
    error,
  };
}
