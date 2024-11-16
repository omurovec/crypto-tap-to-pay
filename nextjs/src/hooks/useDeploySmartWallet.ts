import { useState } from "react";
import { WalletClient, createWalletClient, http } from "viem";
import {
  NetworkType,
  DEPLOYMENT_ADDRESSES,
  NETWORK_CONFIG,
} from "@/config/networks";
import { createClient } from "@/utils/contractUtils";
import CustomSmartWalletFactoryABI from "@/abis/CustomSmartWalletFactory.json";

interface UseDeploySmartWalletProps {
  network: NetworkType;
  wallet: WalletClient | `0x${string}`; // Can accept wallet client or private key
}

interface DeploySmartWalletResult {
  deploySmartWallet: (
    owner: `0x${string}`,
    initialWithdrawLimit: bigint,
    token: `0x${string}`
  ) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export function useDeploySmartWallet({
  network,
  wallet,
}: UseDeploySmartWalletProps): DeploySmartWalletResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deploySmartWallet = async (
    owner: `0x${string}`,
    initialWithdrawLimit: bigint,
    token: `0x${string}`
  ) => {
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
              transport: http(NETWORK_CONFIG[network].rpcUrl),
            })
          : wallet;

      // get precomputed wallet address
      const preComputedWalletAddress = await client.readContract({
        address: DEPLOYMENT_ADDRESSES[network] as `0x${string}`,
        abi: CustomSmartWalletFactoryABI,
        functionName: "getWalletAddress",
        args: [owner, initialWithdrawLimit, token],
      });

      // TODO: add funding of wallet with small native token balance
      // make call to api/fund-smart-wallet
      try {
        const response = await fetch(`/api/fund-smart-wallet`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: preComputedWalletAddress,
            network: network,
          }),
        });

        if (!response.ok) {
          const error = new Error("Failed to fund smart wallet");
          setError(error);
          throw error;
        }

        // check if response is okey
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fund smart wallet")
        );
      }

      const { request } = await client.simulateContract({
        address: DEPLOYMENT_ADDRESSES[network] as `0x${string}`,
        abi: CustomSmartWalletFactoryABI,
        functionName: "createSmartWallet",
        args: [owner, initialWithdrawLimit, token],
        account: walletClient.account,
      });

      // Execute the transaction
      const hash = await walletClient.writeContract(request);

      // Wait for transaction receipt
      await client.waitForTransactionReceipt({ hash });
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
