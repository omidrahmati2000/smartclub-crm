import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as 'fa' | 'en' | 'ar')) {
    locale = routing.defaultLocale;
  }

  const common = (await import(`../../../../packages/i18n/locales/${locale}/common.json`)).default;
  const venueAdmin = (await import(`../../../../packages/i18n/locales/${locale}/venue-admin.json`)).default;

  return {
    locale,
    messages: {
      ...common,
      'venue-admin': venueAdmin,
    },
  };
});
