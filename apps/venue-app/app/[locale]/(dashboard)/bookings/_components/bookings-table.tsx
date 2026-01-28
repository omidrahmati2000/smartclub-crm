import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@smartclub/ui/table';
import { Badge } from '@smartclub/ui/badge';
import { Button } from '@smartclub/ui/button';
import type { Booking } from '@smartclub/types';
import { BookingStatus, Permission } from '@smartclub/types';
import { hasPermission } from '@smartclub/types';
import { formatCurrency } from '@smartclub/utils';
import { cn } from '@smartclub/utils';
import { Eye, CheckCircle, XCircle, UserX } from 'lucide-react';

interface BookingsTableProps {
  bookings: Booking[];
  onView: (booking: Booking) => void;
  onCheckIn?: (bookingId: string) => void;
  onCancel?: (bookingId: string) => void;
  onMarkNoShow?: (bookingId: string) => void;
}

export function BookingsTable({
  bookings,
  onView,
  onCheckIn,
  onCancel,
  onMarkNoShow,
}: BookingsTableProps) {
  const t = useTranslations('venue-admin.bookings');
  const { data: session } = useSession();

  const user = session?.user as any;
  const canEdit = user && hasPermission(user, Permission.BOOKING_EDIT);
  const canCancel = user && hasPermission(user, Permission.BOOKING_CANCEL);

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
    return t(status);
  };

  const canCheckInBooking = (booking: Booking) => {
    return (
      canEdit &&
      (booking.status === BookingStatus.CONFIRMED ||
        booking.status === BookingStatus.PENDING)
    );
  };

  const canCancelBooking = (booking: Booking) => {
    return (
      canCancel &&
      booking.status !== BookingStatus.CANCELLED &&
      booking.status !== BookingStatus.COMPLETED &&
      booking.status !== BookingStatus.NO_SHOW
    );
  };

  const canMarkAsNoShow = (booking: Booking) => {
    return canEdit && booking.status === BookingStatus.CONFIRMED;
  };

  if (bookings.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        رزروی یافت نشد
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('id')}</TableHead>
            <TableHead>{t('dateTime')}</TableHead>
            <TableHead>{t('customer')}</TableHead>
            <TableHead>{t('status')}</TableHead>
            <TableHead className="text-start">{t('amount')}</TableHead>
            <TableHead className="text-start">{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-mono text-xs">
                {booking.id.split('-')[1]}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{booking.date}</div>
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
                {formatCurrency(booking.totalPrice, booking.currency, 'fa')}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(booking)}
                    title={t('view')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {canCheckInBooking(booking) && onCheckIn && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onCheckIn(booking.id)}
                      title={t('checkIn')}
                    >
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </Button>
                  )}
                  {canMarkAsNoShow(booking) && onMarkNoShow && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onMarkNoShow(booking.id)}
                      title={t('markNoShow')}
                    >
                      <UserX className="h-4 w-4 text-orange-600" />
                    </Button>
                  )}
                  {canCancelBooking(booking) && onCancel && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onCancel(booking.id)}
                      title={t('cancel')}
                    >
                      <XCircle className="h-4 w-4 text-red-600" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
