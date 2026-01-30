import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { auth } from '../../../auth';
import { hasPermission } from '@smartclub/types';
import { PricingContent } from './_components/pricing-content';

export async function generateMetadata() {
  const t = await getTranslations('venue-admin.pricing');
  return {
    title: t('title'),
  };
}

export default async function PricingPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const venueId = session.user.venueId;
  if (!venueId) {
    redirect('/login');
  }

  // Check if user can manage pricing
  const canManage = hasPermission(session.user, 'pricing:manage');

  return <PricingContent venueId={venueId} canManage={canManage} />;
}
