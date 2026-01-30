import { getTranslations } from 'next-intl/server';
import { BookingsContent } from './_components/bookings-content';

export async function generateMetadata() {
  const t = await getTranslations('venue-admin.bookings');
  return {
    title: t('title'),
  };
}

export default function BookingsPage() {
  return <BookingsContent />;
}
