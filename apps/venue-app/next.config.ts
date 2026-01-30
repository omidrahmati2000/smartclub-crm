import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  transpilePackages: [
    '@smartclub/ui',
    '@smartclub/utils',
    '@smartclub/types',
    '@smartclub/i18n',
    '@smartclub/mock-data',
  ],
  typescript: {
    // Temporarily ignore build errors - there's a known issue with NextAuth v5 beta in pnpm monorepos
    ignoreBuildErrors: true,
  },
  // Allow cross-origin requests in dev from network IP
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      allowedDevOrigins: ['192.168.100.132:3011'],
    },
  }),
  webpack: (config, { isServer }) => {
    // MSW compatibility: ignore fs module in browser bundles
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
