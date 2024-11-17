import { useState, useEffect } from "react";
import { Address } from "viem";
import { NetworkType } from "@/config/networks";

interface UseSmartWalletBalanceProps {
  walletAddress: Address;
  network: NetworkType;
}

interface BalanceResult {
  balance: string;
  isLoading: boolean;
  error: Error | null;
}

export function useWalletBalance({
  walletAddress,
  network,
}: UseSmartWalletBalanceProps): BalanceResult {
  const [balance, setBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        console.log("wallet balance", balance);
        setIsLoading(true);
        const response = await fetch(
          `/api/usdcBalance?address=${walletAddress}&network=${network}`
        );
        const data = await response.json();

        if (!response.ok) {
          setError(data.error);
          throw new Error(data.error || "Failed to fetch balance");
        }

        if (data.data.length > 0) {
          setBalance(data.data[0].amount);
        }

        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch balance")
        );
        console.error("Error fetching wallet balance:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    if (walletAddress) {
      fetchBalance();
    }

    // Set up polling every 5 seconds
    const intervalId = setInterval(() => {
      if (walletAddress) {
        fetchBalance();
      }
    }, 2000);

    // Cleanup interval on unmount or when dependencies change
    return () => clearInterval(intervalId);
  }, [walletAddress, network]);

  return { balance, isLoading, error };
}
