import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { MyBookingsContent } from './_components/my-bookings-content';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'my-bookings' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function MyBookingsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <MyBookingsContent locale={locale} />;
}
