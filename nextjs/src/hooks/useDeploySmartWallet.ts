import { useState } from "react";
import { Address, WalletClient, createWalletClient, http } from "viem";
import { NetworkType, DEPLOYMENT_ADDRESSES } from "@/config/networks";
import { createClient } from "@/utils/contractUtils";
import CustomSmartWalletFactoryABI from "@/abis/CustomSmartWalletFactory.json";

interface UseDeploySmartWalletProps {
  network?: NetworkType;
  wallet: WalletClient | `0x${string}`; // Can accept wallet client or private key
}

interface DeploySmartWalletResult {
  deploySmartWallet: (
    px: `0x${string}`,
    py: `0x${string}`,
    initialWithdrawLimit: bigint
  ) => Promise<Address>;
  isLoading: boolean;
  error: Error | null;
}

export function useDeploySmartWallet({
  network = "base",
  wallet,
}: UseDeploySmartWalletProps): DeploySmartWalletResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deploySmartWallet = async (
    px: `0x${string}`,
    py: `0x${string}`,
    initialWithdrawLimit: bigint
  ): Promise<Address> => {
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
        abi: CustomSmartWalletFactoryABI,
        functionName: "createSmartWallet",
        args: [px, py, initialWithdrawLimit],
        account: walletClient.account,
      });

      // Execute the transaction
      const hash = await walletClient.writeContract(request);

      // Wait for transaction receipt
      await client.waitForTransactionReceipt({ hash });

      // get the wallet address by making a read call
      const walletAddress = await client.readContract({
        address: DEPLOYMENT_ADDRESSES[network] as `0x${string}`,
        abi: CustomSmartWalletFactoryABI,
        functionName: "smartWallets",
        args: [walletClient.account?.address as Address],
      });

      return walletAddress as Address;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to deploy smart wallet");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deploySmartWallet,
    isLoading,
    error,
  };
}
