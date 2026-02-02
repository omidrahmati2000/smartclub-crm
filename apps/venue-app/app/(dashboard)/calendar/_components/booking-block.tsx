'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@smartclub/utils';
import type { Booking } from '@smartclub/types';
import { BookingStatus } from '@smartclub/types';

interface BookingBlockProps {
  booking: Booking;
  onClick: () => void;
  isDragging?: boolean;
  onResizeStart?: (edge: 'start' | 'end') => void;
  showResizeHandles?: boolean;
}

export function BookingBlock({
  booking,
  onClick,
  isDragging = false,
  onResizeStart,
  showResizeHandles = true,
}: BookingBlockProps) {
  const t = useTranslations('venue-admin.calendar');

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return 'bg-green-100 border-green-300 text-green-900 hover:bg-green-200';
      case BookingStatus.PENDING:
        return 'bg-yellow-100 border-yellow-300 text-yellow-900 hover:bg-yellow-200';
      case BookingStatus.CHECKED_IN:
        return 'bg-blue-100 border-blue-300 text-blue-900 hover:bg-blue-200';
      case BookingStatus.COMPLETED:
        return 'bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200';
      case BookingStatus.CANCELLED:
        return 'bg-red-100 border-red-300 text-red-900 hover:bg-red-200';
      case BookingStatus.NO_SHOW:
        return 'bg-orange-100 border-orange-300 text-orange-900 hover:bg-orange-200';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200';
    }
  };

  return (
    <div className="relative w-full h-full group">
      {/* Top resize handle */}
      {showResizeHandles && onResizeStart && (
        <div
          className="absolute -top-1 left-0 right-0 h-2 cursor-ns-resize opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onMouseDown={(e) => {
            e.stopPropagation();
            onResizeStart('start');
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
        </div>
      )}

      <button
        onClick={onClick}
        className={cn(
          'w-full h-full rounded border-2 p-2 text-start text-xs transition-colors',
          getStatusColor(booking.status),
          isDragging && 'cursor-move ring-2 ring-primary ring-offset-2'
        )}
      >
        <div className="font-medium truncate">
          {booking.participants?.[0]?.name || t('customer')}
        </div>
        <div className="text-[10px] opacity-75">
          {booking.startTime} - {booking.endTime}
        </div>
      </button>

      {/* Bottom resize handle */}
      {showResizeHandles && onResizeStart && (
        <div
          className="absolute -bottom-1 left-0 right-0 h-2 cursor-ns-resize opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onMouseDown={(e) => {
            e.stopPropagation();
            onResizeStart('end');
          }}
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
        </div>
      )}
    </div>
  );
}
