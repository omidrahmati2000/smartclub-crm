import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { cookies } from 'next/headers';
import { Inter, Vazirmatn } from 'next/font/google';
import { isValidLocale, localeDirection } from '@smartclub/i18n';
import type { Locale } from '@smartclub/i18n';
import { LocaleProvider } from '@smartclub/i18n/locale-provider';
import { Providers } from '@/providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-vazirmatn',
});

export const metadata: Metadata = {
  title: 'SmartClub - Platform Admin',
  description: 'Platform Administration Panel',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
  const locale: Locale = isValidLocale(cookieLocale) ? cookieLocale : 'fa';
  const dir = localeDirection[locale];
  const messages = await getMessages();

  return (
    <html lang={locale} dir={dir}>
      <body className={`${inter.variable} ${vazirmatn.variable} ${locale === 'en' ? 'font-sans' : 'font-vazir'}`}>
        <NextIntlClientProvider messages={messages}>
          <LocaleProvider initialLocale={locale}>
            <Providers>{children}</Providers>
          </LocaleProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
