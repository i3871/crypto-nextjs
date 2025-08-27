import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: isGitHubPages ? '/crypto-nextjs' : '',
  assetPrefix: isGitHubPages ? '/crypto-nextjs' : '',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
