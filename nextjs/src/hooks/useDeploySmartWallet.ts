import { useState } from "react";
import { NetworkType } from "@/config/networks";

interface UseDeploySmartWalletProps {
  network: NetworkType;
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

      // Deploy the smart wallet
      const deployResponse = await fetch("/api/deploySmartWallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          owner,
          initialWithdrawLimit: initialWithdrawLimit.toString(),
          token,
          network,
        }),
      });

      if (!deployResponse.ok) {
        const data = await deployResponse.json();
        throw new Error(data.error || "Failed to deploy smart wallet");
      }

      const deployData = await deployResponse.json();

      if (!deployData.success || !deployData.data.smartWalletAddress) {
        throw new Error("Failed to deploy smart wallet");
      }

      // Fund the deployed wallet
      const fundResponse = await fetch("/api/fundSmartWallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: deployData.data.smartWalletAddress,
          network,
        }),
      });

      if (!fundResponse.ok) {
        throw new Error("Failed to fund smart wallet");
      }

      return deployData.data.smartWalletAddress;
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
