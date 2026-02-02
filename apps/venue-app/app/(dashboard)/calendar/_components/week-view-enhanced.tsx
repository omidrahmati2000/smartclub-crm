'use client';

import { useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { Booking, Asset } from '@smartclub/types';
import { cn } from '@smartclub/utils';
import { BookingStatus } from '@smartclub/types';

interface WeekViewEnhancedProps {
  startDate: Date;
  assets: Asset[];
  bookings: Booking[];
  onBookingClick: (booking: Booking) => void;
  onCreateBooking?: (assetId: string, date: string, startTime: string, endTime: string) => void;
  onMoveBooking?: (
    booking: Booking,
    newAssetId: string,
    newDate: string,
    newStartTime: string,
    newEndTime: string
  ) => void;
}

const statusColors: Record<string, string> = {
  [BookingStatus.PENDING]: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  [BookingStatus.CONFIRMED]: 'bg-blue-100 border-blue-300 text-blue-800',
  [BookingStatus.CHECKED_IN]: 'bg-green-100 border-green-300 text-green-800',
  [BookingStatus.COMPLETED]: 'bg-gray-100 border-gray-300 text-gray-800',
  [BookingStatus.CANCELLED]: 'bg-red-100 border-red-300 text-red-800',
  [BookingStatus.NO_SHOW]: 'bg-orange-100 border-orange-300 text-orange-800',
};

export function WeekViewEnhanced({
  startDate,
  assets,
  bookings,
  onBookingClick,
  onCreateBooking,
  onMoveBooking,
}: WeekViewEnhancedProps) {
  const locale = useLocale();
  const t = useTranslations('venue-admin.calendar');

  // Generate week days
  const weekDays = useMemo(() => {
    const days: Date[] = [];
    const start = new Date(startDate);
    // Set to start of week (Saturday for Persian calendar)
    const dayOfWeek = start.getDay();
    const diff = dayOfWeek === 6 ? 0 : dayOfWeek + 1;
    start.setDate(start.getDate() - diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  }, [startDate]);

  // Get day name
  const getDayName = (date: Date) => {
    const dayIndex = date.getDay();
    // Adjust for Persian week starting Saturday
    const adjustedIndex = dayIndex === 6 ? 0 : dayIndex + 1;
    const dayKeys = [
      'saturday',
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
    ] as const;
    return t(`weekdays.${dayKeys[adjustedIndex]}`);
  };

  // Get bookings for a specific date
  const getBookingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter((b) => b.date === dateStr);
  };

  // Check if date is today
  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      day: 'numeric',
    }).format(date);
  };

  if (assets.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        {t('noAssets')}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[900px]">
        {/* Header with day names */}
        <div className="grid grid-cols-8 border-b bg-muted/50">
          <div className="p-3 text-xs font-medium border-e">{t('assets')}</div>
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={cn('p-3 text-center border-e', isToday(day) && 'bg-primary/10')}
            >
              <p className="text-xs font-medium">{getDayName(day)}</p>
              <p className={cn('text-lg font-bold', isToday(day) && 'text-primary')}>
                {formatDate(day)}
              </p>
            </div>
          ))}
        </div>

        {/* Asset rows */}
        {assets.map((asset) => (
          <div key={asset.id} className="grid grid-cols-8 border-b">
            <div className="p-3 text-xs font-medium border-e bg-muted/30 truncate">
              {asset.name}
            </div>
            {weekDays.map((day, dayIndex) => {
              const dayBookings = getBookingsForDate(day).filter((b) => b.assetId === asset.id);
              return (
                <div
                  key={dayIndex}
                  className={cn('min-h-[100px] p-1 border-e', isToday(day) && 'bg-primary/5')}
                >
                  <div className="space-y-1">
                    {dayBookings.slice(0, 4).map((booking) => (
                      <div
                        key={booking.id}
                        className={cn(
                          'text-xs p-1 rounded border cursor-pointer truncate',
                          statusColors[booking.status] || 'bg-gray-100'
                        )}
                        onClick={() => onBookingClick(booking)}
                        title={`${booking.startTime} - ${booking.endTime}`}
                      >
                        {booking.startTime}
                      </div>
                    ))}
                    {dayBookings.length > 4 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{dayBookings.length - 4} {t('more')}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
