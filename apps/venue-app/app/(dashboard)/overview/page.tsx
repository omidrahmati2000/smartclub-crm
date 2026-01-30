import { getTranslations } from 'next-intl/server';
import { OverviewContent } from './_components/overview-content';

export async function generateMetadata() {
  const t = await getTranslations('venue-admin.dashboard');
  return {
    title: t('title'),
  };
}

export default function OverviewPage() {
  return <OverviewContent />;
}
