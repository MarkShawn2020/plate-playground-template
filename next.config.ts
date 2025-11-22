import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  turbopack: { root: __dirname },
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
