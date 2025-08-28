import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove 'output: export' for Cloudflare Pages deployment
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
