import { getTranslations } from 'next-intl/server';
import { ReportsContent } from './_components/reports-content';

export async function generateMetadata() {
  const t = await getTranslations('venue-admin.reports');
  return {
    title: t('title'),
  };
}

export default function ReportsPage() {
  return <ReportsContent />;
}
