import { base, baseSepolia } from "viem/chains";

export const NETWORK_CONFIG = {
  8453: {
    chain: base,
    rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL,
  },
  84532: {
    chain: baseSepolia,
    rpcUrl: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL,
  },
} as const;

export type NetworkType = keyof typeof NETWORK_CONFIG;

export const DEPLOYMENT_ADDRESSES: { [key in NetworkType]: `0x${string}` } = {
  8453: "0x0000000000000000000000000000000000000000",
  84532: "0x705F3124762253c8eF6b7a39f6C0AB9a6c2961FF",
};

export const TOKEN_ADDRESSES: { [key in NetworkType]: `0x${string}` } = {
  8453: "0x0000000000000000000000000000000000000000",
  84532: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
};

export const COINBASE_API_NETWORK_CONFIG: { [key in NetworkType]: string } = {
  8453: "base-mainnet",
  84532: "base-sepolia",
};

export const DEFAULT_NETWORK: NetworkType = 84532;
