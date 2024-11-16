import { createPublicClient, http, Address } from "viem";
import { NETWORK_CONFIG, NetworkType } from "@/config/networks";

export function createClient(network: NetworkType) {
  const networkConfig = NETWORK_CONFIG[network];
  if (!networkConfig.rpcUrl) {
    throw new Error(`No RPC URL configured for network: ${network}`);
  }

  return createPublicClient({
    chain: networkConfig.chain,
    transport: http(networkConfig.rpcUrl),
  });
}

export async function makeContractCall({
  network,
  address,
  abi,
  functionName,
  args,
}: {
  network: NetworkType;
  address: Address;
  abi: any;
  functionName: string;
  args: any[];
}) {
  const client = createClient(network);
  return client.readContract({
    address,
    abi,
    functionName,
    args,
  });
}
