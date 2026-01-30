import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { isValidLocale } from '@smartclub/i18n';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = isValidLocale(cookieLocale) ? cookieLocale : 'fa';

  const common = (await import(`../../../../packages/i18n/locales/${locale}/common.json`)).default;
  const auth = (await import(`../../../../packages/i18n/locales/${locale}/auth.json`)).default;
  const venueAdmin = (await import(`../../../../packages/i18n/locales/${locale}/venue-admin.json`)).default;

  return {
    locale,
    messages: {
      ...common,
      auth,
      'venue-admin': venueAdmin,
    },
  };
});
