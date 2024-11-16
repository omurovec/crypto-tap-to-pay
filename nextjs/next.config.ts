import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowJs: true,
  // disable browser fs
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false };
    }
    return config;
  },
};

export default nextConfig;
