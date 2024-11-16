import { useState, useEffect } from "react";
import { NetworkType } from "@/config/networks";
import { createClient } from "@/utils/contractUtils";
import CustomSmartWalletABI from "@/abis/CustomSmartWallet.json";

interface UseNonceProps {
  network: NetworkType;
  smartWalletAddress: `0x${string}`;
}

interface NonceResult {
  nonce: bigint | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function useNonce({
  network,
  smartWalletAddress,
}: UseNonceProps): NonceResult {
  const [nonce, setNonce] = useState<bigint | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getNonce = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const client = createClient(network);

      // get the wallet address by making a read call
      const nonce = await client.readContract({
        address: smartWalletAddress,
        abi: CustomSmartWalletABI,
        functionName: "nonce",
      });

      setNonce(nonce as bigint);
      setNonce(BigInt(1));
      return nonce as bigint;
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getNonce();
  }, [nonce, smartWalletAddress]);

  return {
    nonce,
    isLoading,
    error,
  };
}
