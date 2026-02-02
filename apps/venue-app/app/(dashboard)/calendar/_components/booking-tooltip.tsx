'use client';

import { useTranslations, useLocale } from 'next-intl';
import { cn, formatCurrency } from '@smartclub/utils';
import type { Booking } from '@smartclub/types';
import { BookingStatus } from '@smartclub/types';

interface BookingTooltipProps {
  booking: Booking;
  position: { x: number; y: number };
}

export function BookingTooltip({ booking, position }: BookingTooltipProps) {
  const t = useTranslations('venue-admin.calendar');
  const locale = useLocale();

  const getStatusLabel = (status: BookingStatus) => {
    const labels: Record<BookingStatus, string> = {
      [BookingStatus.PENDING]: 'Pending',
      [BookingStatus.CONFIRMED]: 'Confirmed',
      [BookingStatus.CHECKED_IN]: 'Checked In',
      [BookingStatus.COMPLETED]: 'Completed',
      [BookingStatus.CANCELLED]: 'Cancelled',
      [BookingStatus.NO_SHOW]: 'No Show',
    };
    return labels[status];
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return 'bg-green-100 text-green-800 border-green-200';
      case BookingStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case BookingStatus.CHECKED_IN:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case BookingStatus.COMPLETED:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case BookingStatus.CANCELLED:
        return 'bg-red-100 text-red-800 border-red-200';
      case BookingStatus.NO_SHOW:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const duration =
    (new Date(`1970-01-01T${booking.endTime}`).getTime() -
      new Date(`1970-01-01T${booking.startTime}`).getTime()) /
    60000;

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  const durationText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  return (
    <div
      className="fixed z-50 bg-background border rounded-lg shadow-lg p-4 min-w-[250px] max-w-[300px] animate-in fade-in-0 zoom-in-95 pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translateY(-100%) translateY(-8px)',
      }}
    >
      {/* Header */}
      <div className="mb-3">
        <h4 className="font-semibold text-sm mb-1">
          {booking.participants?.[0]?.name || 'Unknown Customer'}
        </h4>
        <div
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
            getStatusColor(booking.status)
          )}
        >
          {getStatusLabel(booking.status)}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Time:</span>
          <span className="font-medium">
            {booking.startTime} - {booking.endTime}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Duration:</span>
          <span className="font-medium">{durationText}</span>
        </div>

        {booking.totalPrice && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Price:</span>
            <span className="font-medium">
              {formatCurrency(booking.totalPrice, booking.currency || 'AED', locale)}
            </span>
          </div>
        )}

        {booking.notes && (
          <div className="pt-2 border-t">
            <p className="text-muted-foreground italic">{booking.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
