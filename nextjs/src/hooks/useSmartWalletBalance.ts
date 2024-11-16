import { useState, useEffect } from "react";
import { Address } from "viem";
import { NetworkType } from "@/config/networks";

interface UseSmartWalletBalanceProps {
  smartWalletAddress: Address;
  network: NetworkType;
}

interface BalanceResult {
  balance: string;
  isLoading: boolean;
  error: Error | null;
}

export function useSmartWalletBalance({
  smartWalletAddress,
  network,
}: UseSmartWalletBalanceProps): BalanceResult {
  const [balance, setBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          `/api/usdc-balance?address=${smartWalletAddress}&network=${network}`
        );
        const data = await response.json();

        if (!response.ok) {
          setError(data.error);
          throw new Error(data.error || "Failed to fetch balance");
        }

        setBalance(data.data[0].amount);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch balance")
        );
        console.error("Error fetching wallet balance:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (smartWalletAddress) {
      fetchBalance();
    }
  }, [smartWalletAddress, network]);

  return { balance, isLoading, error };
}
