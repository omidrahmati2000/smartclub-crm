import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { CustomersContent } from './_components/customers-content';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'venue-admin.customers' });
  return {
    title: t('title'),
  };
}

export default async function CustomersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CustomersContent locale={locale} />;
}
