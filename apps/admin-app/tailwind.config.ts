import type { Config } from 'tailwindcss';
import baseConfig from '@smartclub/config/tailwind/base.config';
import animate from 'tailwindcss-animate';

const config: Config = {
  ...baseConfig,
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  plugins: [animate],
};

export default config;
