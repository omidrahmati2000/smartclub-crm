import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { CalendarView } from './_components/calendar-view';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'venue-admin.calendar' });
  return {
    title: t('title'),
  };
}

export default async function CalendarPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CalendarView locale={locale} />;
}
