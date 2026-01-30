'use client';

import { useMemo } from 'react';
import { useLocale } from 'next-intl';
import type { Booking } from '@smartclub/types';
import { cn } from '@smartclub/utils';
import { BookingStatus } from '@smartclub/types';

interface MonthViewProps {
  currentDate: Date;
  bookings: Booking[];
  onBookingClick: (booking: Booking) => void;
  onDayClick: (date: Date) => void;
}

const statusColors: Record<string, string> = {
  [BookingStatus.PENDING]: 'bg-yellow-500',
  [BookingStatus.CONFIRMED]: 'bg-blue-500',
  [BookingStatus.CHECKED_IN]: 'bg-green-500',
  [BookingStatus.COMPLETED]: 'bg-gray-500',
  [BookingStatus.CANCELLED]: 'bg-red-500',
  [BookingStatus.NO_SHOW]: 'bg-orange-500',
};

export function MonthView({ currentDate, bookings, onBookingClick, onDayClick }: MonthViewProps) {
  const locale = useLocale();
  // Generate calendar days for the month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of month
    const firstDay = new Date(year, month, 1);
    // Last day of month
    const lastDay = new Date(year, month + 1, 0);

    // Start from Saturday (for Persian calendar)
    const startOffset = firstDay.getDay() === 6 ? 0 : firstDay.getDay() + 1;

    const days: (Date | null)[] = [];

    // Add empty slots for days before the month starts
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    // Fill remaining slots to complete the grid (6 rows * 7 days)
    while (days.length < 42) {
      days.push(null);
    }

    return days;
  }, [currentDate]);

  // Day names
  const dayNames = locale === 'fa'
    ? ['شنبه', 'یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه']
    : ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  // Get bookings for a specific date
  const getBookingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter((b) => b.date === dateStr);
  };

  // Check if date is today
  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  // Check if date is in current month
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      day: 'numeric',
    }).format(date);
  };

  // Group bookings by status for summary dots
  const getBookingSummary = (date: Date) => {
    const dayBookings = getBookingsForDate(date);
    const summary: { status: string; count: number }[] = [];

    const statusCounts: Record<string, number> = {};
    dayBookings.forEach((b) => {
      statusCounts[b.status] = (statusCounts[b.status] || 0) + 1;
    });

    Object.entries(statusCounts).forEach(([status, count]) => {
      summary.push({ status, count });
    });

    return summary;
  };

  return (
    <div className="p-4">
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {dayNames.map((day, index) => (
          <div
            key={index}
            className="text-center text-sm font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 border rounded-lg overflow-hidden">
        {calendarDays.map((date, index) => {
          if (!date) {
            return (
              <div
                key={index}
                className="min-h-[100px] border-b border-e bg-muted/20"
              />
            );
          }

          const dayBookings = getBookingsForDate(date);
          const summary = getBookingSummary(date);

          return (
            <div
              key={index}
              className={cn(
                'min-h-[100px] border-b border-e p-2 cursor-pointer hover:bg-muted/50 transition-colors',
                isToday(date) && 'bg-primary/10',
                !isCurrentMonth(date) && 'opacity-50'
              )}
              onClick={() => onDayClick(date)}
            >
              {/* Date number */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={cn(
                    'text-sm font-medium',
                    isToday(date) && 'bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center'
                  )}
                >
                  {formatDate(date)}
                </span>
                {dayBookings.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {dayBookings.length} رزرو
                  </span>
                )}
              </div>

              {/* Booking summary dots */}
              {summary.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {summary.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1"
                      title={`${item.count} ${item.status}`}
                    >
                      <div
                        className={cn(
                          'w-2 h-2 rounded-full',
                          statusColors[item.status] || 'bg-gray-500'
                        )}
                      />
                      <span className="text-xs">{item.count}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* First few bookings preview */}
              <div className="mt-1 space-y-1">
                {dayBookings.slice(0, 2).map((booking) => (
                  <div
                    key={booking.id}
                    className="text-xs bg-muted rounded px-1 py-0.5 truncate"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookingClick(booking);
                    }}
                  >
                    {booking.startTime}
                  </div>
                ))}
                {dayBookings.length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{dayBookings.length - 2} دیگر
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span>در انتظار</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>تأیید شده</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>حاضر شده</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gray-500" />
          <span>تکمیل شده</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>لغو شده</span>
        </div>
      </div>
    </div>
  );
}
