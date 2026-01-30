import { getTranslations } from 'next-intl/server';
import { CalendarView } from './_components/calendar-view';

export async function generateMetadata() {
  const t = await getTranslations('venue-admin.calendar');
  return {
    title: t('title'),
  };
}

export default function CalendarPage() {
  return <CalendarView />;
}
