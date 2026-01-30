import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { isValidLocale } from '@smartclub/i18n';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = isValidLocale(cookieLocale) ? cookieLocale : 'fa';

  return {
    locale,
    messages: (await import(`../../../../packages/i18n/locales/${locale}/common.json`)).default,
  };
});
