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
};

export default withNextIntl(nextConfig);
