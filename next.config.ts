import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  // Not needed in your project
  turbopack: { root: __dirname },
  reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  images: {
    unoptimized: true,
  },
  // Tauri uses a custom protocol, so we need to set the asset prefix
  ...(process.env.TAURI_ENV_PLATFORM
    ? {
        assetPrefix: './',
      }
    : {}),
};

export default nextConfig;
