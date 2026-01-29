import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { ReportsContent } from './_components/reports-content';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'venue-admin.reports' });
  return {
    title: t('title'),
  };
}

export default async function ReportsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ReportsContent locale={locale} />;
}
