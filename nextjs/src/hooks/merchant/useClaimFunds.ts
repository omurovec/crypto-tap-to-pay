import { useState } from "react";
import { Address, WalletClient, createWalletClient, http } from "viem";
import { NetworkType, NETWORK_CONFIG } from "@/config/networks";
import { createClient } from "@/utils/contractUtils";
import CustomSmartWalletABI from "@/abis/CustomSmartWallet.json";
import { useDynamicContext, Wallet } from "@dynamic-labs/sdk-react-core";
import { EthereumWallet } from "@dynamic-labs/ethereum-core";
import { isEthereumWallet } from "@dynamic-labs/ethereum";

interface UseClaimFundsProps {
  network: NetworkType;
}

interface ClaimFundsResult {
  claimFunds: (
    primaryWallet: any,
    signature: string,
    amount: bigint,
    smartWalletAddress: string
  ) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export function useClaimFunds({
  network,
}: UseClaimFundsProps): ClaimFundsResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const claimFunds = async (
    primaryWallet: any,
    signature: string,
    amount: bigint,
    smartWalletAddress: string
  ) => {
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

      await primaryWallet.switchNetwork(network);

      // get nonce
      // get the wallet address by making a read call
      const nonce = await client.readContract({
        address: smartWalletAddress as `0x${string}`,
        abi: CustomSmartWalletABI,
        functionName: "nonce",
      });

      // Create wallet client if private key provided
      const ethereumWallet = primaryWallet as EthereumWallet;
      const walletClient = await ethereumWallet.getWalletClient();

      console.log("params", { signature, amount, nonce, smartWalletAddress });

      const { request } = await client.simulateContract({
        address: smartWalletAddress as `0x${string}`,
        abi: CustomSmartWalletABI,
        functionName: "claimFunds",
        args: [signature, [amount, nonce]],
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
