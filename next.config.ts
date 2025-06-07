import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['static.usernames.app-backend.toolsforhumanity.com'],
  },
  allowedDevOrigins: ['*'],
  eslint: {
    ignoreDuringBuilds: true, // 👈 esto ignora los errores ESLint al hacer build
  },
};

export default nextConfig;
