import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  reactCompiler: true,
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
