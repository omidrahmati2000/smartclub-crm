import { cn } from '@smartclub/utils';
import type { Booking } from '@smartclub/types';
import { BookingStatus } from '@smartclub/types';

interface BookingBlockProps {
  booking: Booking;
  onClick: () => void;
}

export function BookingBlock({ booking, onClick }: BookingBlockProps) {
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
    <button
      onClick={onClick}
      className={cn(
        'w-full rounded border-2 p-2 text-start text-xs transition-colors',
        getStatusColor(booking.status),
      )}
    >
      <div className="font-medium truncate">
        {booking.participants?.[0]?.name || 'مشتری'}
      </div>
      <div className="text-[10px] opacity-75">
        {booking.startTime} - {booking.endTime}
      </div>
    </button>
  );
}
