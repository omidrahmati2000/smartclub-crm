import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { auth } from '../../../../auth';
import { hasPermission } from '@smartclub/types';
import { PricingContent } from './_components/pricing-content';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'venue-admin.pricing' });
  return {
    title: t('title'),
  };
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  const venueId = session.user.venueId;
  if (!venueId) {
    redirect(`/${locale}/login`);
  }

  // Check if user can manage pricing
  const canManage = hasPermission(session.user, 'pricing:manage');

  return <PricingContent locale={locale} venueId={venueId} canManage={canManage} />;
}
