import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { FinanceContent } from './_components/finance-content';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'venue-admin.finance' });
  return {
    title: t('title'),
  };
}

export default async function FinancePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <FinanceContent locale={locale} />;
}
