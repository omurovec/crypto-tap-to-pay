import { useState } from "react";
import { Address, WalletClient, createWalletClient, http } from "viem";
import { NetworkType, NETWORK_CONFIG } from "@/config/networks";
import { createClient } from "@/utils/contractUtils";
import CustomSmartWalletABI from "@/abis/CustomSmartWallet.json";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { EthereumWallet } from "@dynamic-labs/ethereum-core";
import { isEthereumWallet } from "@dynamic-labs/ethereum";

interface UseClaimFundsProps {
  smartWalletAddress: Address;
  network: NetworkType;
  wallet: WalletClient | `0x${string}`; // Can accept wallet client or private key
}

interface ClaimFundsResult {
  claimFunds: (signature: string, amount: bigint) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export function useClaimFunds({
  network,
  wallet,
  smartWalletAddress,
}: UseClaimFundsProps): ClaimFundsResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { primaryWallet } = useDynamicContext();

  const claimFunds = async (signature: string, amount: bigint) => {
    try {
      setIsLoading(true);
      setError(null);

      const client = createClient(network);

      if (!primaryWallet) {
        throw new Error(
          "Wallet not yet initialized. Please try again in a moment."
        );
      }

      if (!isEthereumWallet(primaryWallet)) {
        throw new Error("Wallet is not an Ethereum wallet");
      }

      // Create wallet client if private key provided
      const ethereumWallet = primaryWallet as EthereumWallet;
      const walletClient = await ethereumWallet.getWalletClient();

      const { request } = await client.simulateContract({
        address: smartWalletAddress,
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
