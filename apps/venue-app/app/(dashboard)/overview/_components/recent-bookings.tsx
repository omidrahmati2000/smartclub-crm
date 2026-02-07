import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@smartclub/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@smartclub/ui/table';
import { Badge } from '@smartclub/ui/badge';
import type { Booking } from '@smartclub/types';
import { BookingStatus } from '@smartclub/types';
import { formatCurrency } from '@smartclub/utils';
import { cn } from '@smartclub/utils';

interface RecentBookingsProps {
  bookings: Booking[];
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
  const t = useTranslations('venue-admin.dashboard');
  const tb = useTranslations('venue-admin.bookings');

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return 'bg-green-100 text-green-800';
      case BookingStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case BookingStatus.CHECKED_IN:
        return 'bg-blue-100 text-blue-800';
      case BookingStatus.COMPLETED:
        return 'bg-gray-100 text-gray-800';
      case BookingStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      case BookingStatus.NO_SHOW:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: BookingStatus) => {
    return tb(status);
  };

  if (bookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('recentBookings')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            {t('noBookings')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('recentBookings')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{tb('dateTime')}</TableHead>
              <TableHead>{tb('customer')}</TableHead>
              <TableHead>{tb('status')}</TableHead>
              <TableHead className="text-start">{tb('amount')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{booking.date}</div>
                    <div className="text-xs text-muted-foreground">
                      {booking.startTime} - {booking.endTime}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {booking.participants?.[0]?.name || 'مشتری'}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn('text-xs', getStatusColor(booking.status))}
                  >
                    {getStatusLabel(booking.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-start">
                  {formatCurrency(booking.totalPrice, booking.currency, 'en')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
