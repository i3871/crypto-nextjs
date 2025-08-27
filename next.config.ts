import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/crypto-nextjs',
  assetPrefix: '/crypto-nextjs',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
