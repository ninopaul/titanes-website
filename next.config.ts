import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Allow images from backend API
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
      },
      {
        protocol: 'https',
        hostname: 'titanes-erp-v2-backend.lwxfdl.easypanel.host',
      },
    ],
  },
};

export default nextConfig;
