'use client';

import { useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { Booking } from '@smartclub/types';
import { cn } from '@smartclub/utils';
import { BookingStatus } from '@smartclub/types';
import { Calendar as CalendarIcon, ChevronRight } from 'lucide-react';

interface MonthViewProps {
  currentDate: Date;
  bookings: Booking[];
  onBookingClick: (booking: Booking) => void;
  onDayClick: (date: Date) => void;
}

const statusColors: Record<string, string> = {
  [BookingStatus.PENDING]: 'bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.4)]',
  [BookingStatus.CONFIRMED]: 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.4)]',
  [BookingStatus.CHECKED_IN]: 'bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.4)]',
  [BookingStatus.COMPLETED]: 'bg-slate-500 shadow-[0_0_5px_rgba(100,116,139,0.4)]',
  [BookingStatus.CANCELLED]: 'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.4)]',
  [BookingStatus.NO_SHOW]: 'bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.4)]',
  [BookingStatus.FROZEN]: 'bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.4)]',
  [BookingStatus.MAINTENANCE]: 'bg-zinc-500 shadow-[0_0_5px_rgba(113,113,122,0.4)]',
};

export function MonthView({ currentDate, bookings, onBookingClick, onDayClick }: MonthViewProps) {
  const locale = useLocale();
  const t = useTranslations('venue-admin.calendar');

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
  const dayKeys = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;
  const dayNames = dayKeys.map(key => t(`weekdays.${key}`));

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
    <div className="p-2 sm:p-4 bg-background">
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2 sm:mb-4">
        {dayNames.map((day, index) => (
          <div
            key={index}
            className="text-center text-[8px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-[0.1em] sm:tracking-[0.2em] py-1 sm:py-2 truncate px-0.5"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 border rounded-xl overflow-hidden shadow-inner bg-muted/20">
        {calendarDays.map((date, index) => {
          if (!date) {
            return (
              <div
                key={index}
                className="min-h-[60px] sm:min-h-[120px] border-b border-e bg-muted/10 opacity-40"
              />
            );
          }

          const dayBookings = getBookingsForDate(date);
          const summary = getBookingSummary(date);
          const today = isToday(date);
          const currentMonth = isCurrentMonth(date);

          return (
            <div
              key={index}
              className={cn(
                'min-h-[60px] sm:min-h-[120px] border-b border-e p-1 sm:p-2 cursor-pointer transition-all duration-300 group hover:shadow-[inset_0_0_20px_rgba(0,0,0,0.02)]',
                today ? 'bg-primary/5' : 'bg-card',
                !currentMonth && 'bg-muted/30 opacity-60 grayscale-[0.5]'
              )}
              onClick={() => onDayClick(date)}
            >
              {/* Date number */}
              <div className="flex items-start justify-between mb-1 sm:mb-2">
                <span
                  className={cn(
                    'text-[10px] sm:text-sm font-black w-5 h-5 sm:w-8 sm:h-8 flex items-center justify-center transition-all tabular-nums',
                    today
                      ? 'bg-primary text-primary-foreground rounded sm:rounded-lg shadow-lg shadow-primary/30 scale-110'
                      : 'text-foreground/80 group-hover:text-primary group-hover:scale-110'
                  )}
                >
                  {formatDate(date)}
                </span>
                {dayBookings.length > 0 && (
                  <div className="flex items-center gap-0.5 bg-muted/40 px-1 py-0.5 rounded-full border border-muted-foreground/10">
                    <CalendarIcon className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-muted-foreground hidden sm:block" />
                    <span className="text-[8px] sm:text-[10px] font-bold text-muted-foreground">
                      {dayBookings.length}
                    </span>
                  </div>
                )}
              </div>

              {/* Booking summary dots - mobile only shows dots */}
              {summary.length > 0 && (
                <div className="flex flex-wrap gap-0.5 sm:gap-1 mb-1 sm:mb-2">
                  {summary.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-0.5 sm:gap-1 group/dot px-0.5 sm:px-1 rounded-sm hover:bg-muted/50 transition-colors"
                      title={`${item.count} ${item.status}`}
                    >
                      <div
                        className={cn(
                          'w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ring-1 ring-background',
                          statusColors[item.status] || 'bg-gray-500'
                        )}
                      />
                      <span className="text-[8px] sm:text-[9px] font-black opacity-0 group-hover/dot:opacity-100 transition-opacity truncate max-w-[30px] sm:max-w-[40px] hidden sm:inline">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* First few bookings preview - hidden on mobile, visible on sm+ */}
              <div className="space-y-1 hidden sm:block">
                {dayBookings.slice(0, 2).map((booking) => (
                  <div
                    key={booking.id}
                    className="text-[10px] bg-muted/60 hover:bg-primary/10 hover:text-primary rounded-md px-2 py-1 truncate font-bold border border-transparent hover:border-primary/20 transition-all flex items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookingClick(booking);
                    }}
                  >
                    <div className={cn("w-1 h-1 rounded-full shrink-0", statusColors[booking.status])} />
                    {booking.startTime}
                  </div>
                ))}
                {dayBookings.length > 2 && (
                  <button className="w-full text-[9px] font-black text-muted-foreground/70 hover:text-primary hover:bg-primary/5 py-0.5 rounded transition-all uppercase tracking-tighter flex items-center justify-center gap-0.5">
                    <span>+{dayBookings.length - 2} {t('more')}</span>
                    <ChevronRight className="w-2 h-2" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modern Legend */}
      <div className="mt-4 sm:mt-8 flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-8 gap-y-2 sm:gap-y-3 p-2 sm:p-4 bg-muted/5 rounded-2xl border border-dashed">
        {[
          { key: 'pending', color: 'bg-amber-500' },
          { key: 'confirmed', color: 'bg-emerald-500' },
          { key: 'checkedIn', color: 'bg-blue-500' },
          { key: 'completed', color: 'bg-slate-500' },
          { key: 'cancelled', color: 'bg-rose-500' },
          { key: 'frozen', color: 'bg-cyan-500' },
          { key: 'maintenance', color: 'bg-zinc-500' },
        ].map(item => (
          <div key={item.key} className="flex items-center gap-1.5 sm:gap-2 group cursor-help">
            <div className={cn("w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full", item.color, "shadow-[0_0_8px_rgba(0,0,0,0.1)] group-hover:scale-150 transition-transform")} />
            <span className="text-[8px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-wider sm:tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
              {t(`statusLegend.${item.key}`)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
