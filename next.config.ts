import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: { serverActions: { bodySizeLimit: '2mb' } },
  images: { remotePatterns: [{ protocol: 'https', hostname: '**' }] }
};
export default nextConfig;
