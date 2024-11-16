import { useState } from "react";
import { encrypt } from "@/lib/crypto";

interface WalletResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

export function useWalletTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<WalletResponse | null>(null);

  const testWallet = async (privateKey: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use the proper encryption utility
      const { encrypted, iv, authTag } = encrypt(privateKey);

      const response = await fetch("/api/wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          encryptedData: encrypted,
          iv,
          authTag,
        }),
      });

      const data = await response.json();
      setResponse(data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to test wallet");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, response, testWallet };
}
