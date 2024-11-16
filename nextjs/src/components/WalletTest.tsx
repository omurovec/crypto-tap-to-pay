"use client";

import { useState } from "react";
import { useWalletTest } from "@/hooks/useWalletTest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function WalletTest() {
  const [privateKey, setPrivateKey] = useState("");
  const { testWallet, isLoading, error, response } = useWalletTest();

  const handleTest = async () => {
    if (!privateKey.trim()) return;
    await testWallet(privateKey);
  };

  return (
    <div className="space-y-4 p-4">
      <Input
        type="text"
        value={privateKey}
        onChange={(e) => setPrivateKey(e.target.value)}
        placeholder="Enter private key to test"
      />
      <Button onClick={handleTest} disabled={isLoading || !privateKey.trim()}>
        {isLoading ? "Testing..." : "Test Wallet"}
      </Button>

      {error && <div className="text-red-500">Error: {error}</div>}

      {response && (
        <div className="text-green-500">
          {response.message || JSON.stringify(response)}
        </div>
      )}
    </div>
  );
}
