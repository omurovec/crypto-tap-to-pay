import { useState, useEffect } from "react";
import { Address } from "viem";
import { NetworkType } from "@/config/networks";

interface UseSmartWalletBalanceProps {
  address: Address;
  tokenAddress?: Address;
  network?: NetworkType;
}

interface BalanceResult {
  balance: string;
  isLoading: boolean;
  error: Error | null;
}

export function useSmartWalletBalance({
  address,
  tokenAddress,
  network = "base",
}: UseSmartWalletBalanceProps): BalanceResult {
  const [balance, setBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          `/api/balance?address=${address}&network=${network}${
            tokenAddress ? `&tokenAddress=${tokenAddress}` : ""
          }`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch balance");
        }

        setBalance(data.balance);
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

    if (address) {
      fetchBalance();
    }
  }, [address, tokenAddress, network]);

  return { balance, isLoading, error };
}
