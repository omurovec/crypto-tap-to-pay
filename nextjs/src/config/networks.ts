import { mainnet, sepolia, goerli, base } from "viem/chains";

export const NETWORK_CONFIG = {
  mainnet: {
    chain: mainnet,
    rpcUrl: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
  },
  sepolia: {
    chain: sepolia,
    rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL,
  },
  goerli: {
    chain: goerli,
    rpcUrl: process.env.NEXT_PUBLIC_GOERLI_RPC_URL,
  },
  base: {
    chain: base,
    rpcUrl: process.env.NEXT_PUBLIC_BASE_RPC_URL,
  },
} as const;

export const DEPLOYMENT_ADDRESSES = {
  mainnet: "0x0000000000000000000000000000000000000000",
  sepolia: "0x0000000000000000000000000000000000000000",
  goerli: "0x0000000000000000000000000000000000000000",
  base: "0x0000000000000000000000000000000000000000",
};

export type NetworkType = keyof typeof NETWORK_CONFIG;
