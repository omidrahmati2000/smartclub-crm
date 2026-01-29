import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as 'fa' | 'en' | 'ar')) {
    locale = routing.defaultLocale;
  }

  const commonFile = (await import(`../../../../packages/i18n/locales/${locale}/common.json`)).default;
  const auth = (await import(`../../../../packages/i18n/locales/${locale}/auth.json`)).default;
  const explore = (await import(`../../../../packages/i18n/locales/${locale}/explore.json`)).default;
  const venue = (await import(`../../../../packages/i18n/locales/${locale}/venue.json`)).default;
  const booking = (await import(`../../../../packages/i18n/locales/${locale}/booking.json`)).default;
  const myBookings = (await import(`../../../../packages/i18n/locales/${locale}/my-bookings.json`)).default;
  const profile = (await import(`../../../../packages/i18n/locales/${locale}/profile.json`)).default;

  return {
    locale,
    messages: {
      // Spread top-level keys from common (app, nav, etc.)
      ...commonFile,
      // Also make common accessible as a namespace for useTranslations('common')
      common: {
        ...commonFile.common,
        sports: commonFile.sports,
      },
      auth,
      explore,
      venue,
      booking,
      'my-bookings': myBookings,
      profile,
    },
  };
});
