import { getTranslations } from 'next-intl/server';
import { MyBookingsContent } from './_components/my-bookings-content';

export async function generateMetadata() {
  const t = await getTranslations('my-bookings');

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function MyBookingsPage() {
  return <MyBookingsContent />;
}
