import { useUserWallets } from "@dynamic-labs/sdk-react-core";

export function useWalletAddress() {
  const wallets = useUserWallets();
  return wallets?.[0]?.address;
}
