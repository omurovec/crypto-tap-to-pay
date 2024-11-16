import { base, baseSepolia } from "viem/chains";

export const NETWORK_CONFIG = {
  base: {
    chain: base,
    rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL,
  },
  baseSepolia: {
    chain: baseSepolia,
    rpcUrl: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL,
  },
} as const;

export type NetworkType = keyof typeof NETWORK_CONFIG;

export const DEPLOYMENT_ADDRESSES: { [key in NetworkType]: `0x${string}` } = {
  base: "0x0000000000000000000000000000000000000000",
  baseSepolia: "0x0000000000000000000000000000000000000000",
};

export const COINBASE_API_NETWORK_CONFIG: { [key in NetworkType]: string } = {
  base: "base-mainnet",
  baseSepolia: "base-sepolia",
};
