import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { isValidLocale } from '@smartclub/i18n';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = isValidLocale(cookieLocale) ? cookieLocale : 'fa';

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
      ...commonFile,
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
