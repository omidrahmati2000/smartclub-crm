import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { BookingsContent } from './_components/bookings-content';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'venue-admin.bookings' });
  return {
    title: t('title'),
  };
}

export default async function BookingsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <BookingsContent locale={locale} />;
}
