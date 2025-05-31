import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  webpack(config) {
    // Add alias so `@` resolves to packages/ui/src
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, '../../packages/ui/src'),
    };

    return config;
  },
};

export default nextConfig;

