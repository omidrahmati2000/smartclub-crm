import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { auth } from '../../../auth';
import { hasPermission } from '@smartclub/types';
import { AssetsContent } from './_components/assets-content';

export async function generateMetadata() {
  const t = await getTranslations('venue-admin.assets');
  return {
    title: t('title'),
  };
}

export default async function AssetsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const venueId = session.user.venueId;
  if (!venueId) {
    redirect('/login');
  }

  // Check if user can manage assets (Owner or Manager)
  const canManage = hasPermission(session.user, 'venue:assets:write');

  return <AssetsContent venueId={venueId} canManage={canManage} />;
}
