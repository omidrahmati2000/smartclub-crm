import { getTranslations } from 'next-intl/server';
import { StaffContent } from './_components/staff-content';

export async function generateMetadata() {
  const t = await getTranslations('venue-admin.staff');
  return {
    title: t('title'),
  };
}

export default function StaffPage() {
  return <StaffContent />;
}
