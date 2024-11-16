import { useState, useEffect } from "react";
import { Address } from "viem";
import { NetworkType, DEPLOYMENT_ADDRESSES } from "@/config/networks";
import { createClient } from "@/utils/contractUtils";
import CustomSmartWalletFactoryABI from "@/abis/CustomSmartWalletFactory.json";

interface UseSmartWalletAddressProps {
  network: NetworkType;
  eoaAddress: `0x${string}`;
}

interface SmartWalletAddressResult {
  smartWalletAddress: string | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function useSmartWalletAddress({
  network,
  eoaAddress,
}: UseSmartWalletAddressProps): SmartWalletAddressResult {
  const [smartWalletAddress, setSmartWalletAddress] = useState<
    Address | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getSmartWalletAddress = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const client = createClient(network);

      // get the wallet address by making a read call
      const walletAddress = await client.readContract({
        address: DEPLOYMENT_ADDRESSES[network] as `0x${string}`,
        abi: CustomSmartWalletFactoryABI,
        functionName: "smartWallets",
        args: [eoaAddress],
      });

      setSmartWalletAddress(walletAddress as Address);
      return walletAddress as Address;
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSmartWalletAddress();
  }, [eoaAddress]);

  return {
    smartWalletAddress,
    isLoading,
    error,
  };
}
