import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { StaffContent } from './_components/staff-content';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'venue-admin.staff' });
  return {
    title: t('title'),
  };
}

export default async function StaffPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <StaffContent locale={locale} />;
}
