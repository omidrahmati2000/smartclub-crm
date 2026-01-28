import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@smartclub/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@smartclub/ui/card';
import { Calendar, ListChecks, Plus } from 'lucide-react';

interface QuickActionsProps {
  locale: string;
}

export function QuickActions({ locale }: QuickActionsProps) {
  const t = useTranslations('venue-admin.dashboard');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('quickActions')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <Button asChild variant="outline" className="h-auto flex-col gap-2 p-4">
          <Link href={`/${locale}/bookings`}>
            <Plus className="h-5 w-5" />
            <span className="text-sm">{t('createBooking')}</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto flex-col gap-2 p-4">
          <Link href={`/${locale}/calendar`}>
            <Calendar className="h-5 w-5" />
            <span className="text-sm">{t('viewCalendar')}</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto flex-col gap-2 p-4">
          <Link href={`/${locale}/bookings`}>
            <ListChecks className="h-5 w-5" />
            <span className="text-sm">{t('viewAllBookings')}</span>
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
