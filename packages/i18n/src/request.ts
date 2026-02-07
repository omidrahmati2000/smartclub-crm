import { getRequestConfig } from 'next-intl/server';
import { type Locale, locales } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'fa';
  }

  // Load all translation files for this locale
  const translations = await import(`../locales/${locale}`);

  const messages = {
    auth: (await import(`../locales/${locale}/auth.json`)).default,
    booking: (await import(`../locales/${locale}/booking.json`)).default,
    common: (await import(`../locales/${locale}/common.json`)).default,
    explore: (await import(`../locales/${locale}/explore.json`)).default,
    'location-compliance': (await import(`../locales/${locale}/location-compliance.json`)).default,
    'my-bookings': (await import(`../locales/${locale}/my-bookings.json`)).default,
    profile: (await import(`../locales/${locale}/profile.json`)).default,
    tournament: (await import(`../locales/${locale}/tournament.json`)).default,
    'venue-admin': (await import(`../locales/${locale}/venue-admin.json`)).default,
    venue: (await import(`../locales/${locale}/venue.json`)).default,
  };

  return {
    locale,
    messages,
  };
});
