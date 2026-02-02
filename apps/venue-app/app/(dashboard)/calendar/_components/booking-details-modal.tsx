'use client';

import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@smartclub/ui/dialog';
import { Button } from '@smartclub/ui/button';
import { Badge } from '@smartclub/ui/badge';
import { Separator } from '@smartclub/ui/separator';
import type { Booking } from '@smartclub/types';
import { BookingStatus, Permission } from '@smartclub/types';
import { hasPermission } from '@smartclub/types';
import { formatCurrency } from '@smartclub/utils';
import { cn } from '@smartclub/utils';

interface BookingDetailsModalProps {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
  onCheckIn?: (bookingId: string) => void;
  onCancel?: (bookingId: string) => void;
  onMarkNoShow?: (bookingId: string) => void;
}

export function BookingDetailsModal({
  booking,
  open,
  onClose,
  onCheckIn,
  onCancel,
  onMarkNoShow,
}: BookingDetailsModalProps) {
  const t = useTranslations('venue-admin.bookings');
  const tc = useTranslations('venue-admin.common');
  const { data: session } = useSession();

  if (!booking) return null;

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

  const canCheckIn =
    canEdit &&
    (booking.status === BookingStatus.CONFIRMED ||
      booking.status === BookingStatus.PENDING);

  const canCancelBooking =
    canCancel &&
    booking.status !== BookingStatus.CANCELLED &&
    booking.status !== BookingStatus.COMPLETED &&
    booking.status !== BookingStatus.NO_SHOW;

  const canMarkAsNoShow =
    canEdit &&
    booking.status === BookingStatus.CONFIRMED;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('bookingDetails')}</DialogTitle>
          <DialogDescription>{t('bookingId', { id: booking.id })}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Info */}
          <div>
            <h3 className="font-medium mb-3">{t('bookingInfo')}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">{t('date')}:</span>
                <p className="font-medium">{booking.date}</p>
              </div>
              <div>
                <span className="text-muted-foreground">{t('time')}:</span>
                <p className="font-medium">
                  {booking.startTime} - {booking.endTime}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">{t('duration')}:</span>
                <p className="font-medium">
                  {booking.duration} {t('minutes')}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">{t('status')}:</span>
                <Badge
                  variant="secondary"
                  className={cn('mt-1', getStatusColor(booking.status))}
                >
                  {getStatusLabel(booking.status)}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Customer Info */}
          <div>
            <h3 className="font-medium mb-3">{t('customerInfo')}</h3>
            <div className="text-sm">
              <p className="font-medium">
                {booking.participants?.[0]?.name || t('customer')}
              </p>
            </div>
          </div>

          <Separator />

          {/* Payment Info */}
          <div>
            <h3 className="font-medium mb-3">{t('paymentInfo')}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">{t('amount')}:</span>
                <p className="font-medium">
                  {formatCurrency(booking.totalPrice, booking.currency)}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">
                  {t('paymentMethod')}:
                </span>
                <p className="font-medium">{booking.paymentMethod}</p>
              </div>
              <div>
                <span className="text-muted-foreground">
                  {t('paymentStatus')}:
                </span>
                <p className="font-medium">{booking.paymentStatus}</p>
              </div>
            </div>
          </div>

          {/* Participants */}
          {booking.participants && booking.participants.length > 1 && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium mb-3">{t('participants')}</h3>
                <div className="space-y-2 text-sm">
                  {booking.participants.map((participant, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span>{participant.name}</span>
                      {participant.isHost && (
                        <Badge variant="outline" className="text-xs">
                          {t('host')}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <div className="flex w-full gap-2 justify-end">
            {canCheckIn && onCheckIn && (
              <Button
                onClick={() => {
                  onCheckIn(booking.id);
                  onClose();
                }}
                variant="default"
              >
                {t('checkIn')}
              </Button>
            )}
            {canMarkAsNoShow && onMarkNoShow && (
              <Button
                onClick={() => {
                  onMarkNoShow(booking.id);
                  onClose();
                }}
                variant="outline"
              >
                {t('markNoShow')}
              </Button>
            )}
            {canCancelBooking && onCancel && (
              <Button
                onClick={() => {
                  onCancel(booking.id);
                  onClose();
                }}
                variant="destructive"
              >
                {t('cancel')}
              </Button>
            )}
            <Button onClick={onClose} variant="outline">
              {tc('close')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
