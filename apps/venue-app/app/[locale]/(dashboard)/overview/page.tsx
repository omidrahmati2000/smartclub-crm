import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { OverviewContent } from './_components/overview-content';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'venue-admin.dashboard' });
  return {
    title: t('title'),
  };
}

export default async function OverviewPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <OverviewContent locale={locale} />;
}
