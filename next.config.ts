import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    DEV_API_URL: process.env.DEV_API_URL,
    PROD_API_URL: process.env.PROD_API_URL,
  },
};

export default nextConfig;
