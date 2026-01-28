import { getRequestConfig } from 'next-intl/server';
import { type Locale, locales } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    locale = 'fa';
  }

  return {
    locale,
    messages: (await import(`../locales/${locale}/common.json`)).default,
  };
});
