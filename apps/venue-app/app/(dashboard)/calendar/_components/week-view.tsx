'use client';

import { useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { Booking, Asset } from '@smartclub/types';
import { cn } from '@smartclub/utils';
import { BookingStatus } from '@smartclub/types';
import { User, Clock, ChevronRight, Crown, Wrench } from 'lucide-react';

interface WeekViewProps {
  startDate: Date;
  assets: Asset[];
  bookings: Booking[];
  onBookingClick: (booking: Booking) => void;
}

const statusStyles: Record<string, { container: string; icon: string }> = {
  [BookingStatus.PENDING]: {
    container: 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200 text-amber-900',
    icon: 'text-amber-600'
  },
  [BookingStatus.CONFIRMED]: {
    container: 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-900',
    icon: 'text-emerald-600'
  },
  [BookingStatus.CHECKED_IN]: {
    container: 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-900',
    icon: 'text-blue-600'
  },
  [BookingStatus.COMPLETED]: {
    container: 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 text-slate-700',
    icon: 'text-slate-500'
  },
  [BookingStatus.CANCELLED]: {
    container: 'bg-gradient-to-r from-rose-50 to-rose-100 border-rose-200 text-rose-900 opacity-75',
    icon: 'text-rose-600'
  },
  [BookingStatus.NO_SHOW]: {
    container: 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 text-orange-900',
    icon: 'text-orange-600'
  },
  [BookingStatus.FROZEN]: {
    container: 'bg-gradient-to-r from-cyan-50 to-cyan-100 border-cyan-200 text-cyan-900',
    icon: 'text-cyan-600'
  },
  [BookingStatus.MAINTENANCE]: {
    container: 'bg-gradient-to-r from-zinc-100 to-zinc-200 border-zinc-300 text-zinc-700',
    icon: 'text-zinc-600'
  },
};

export function WeekView({ startDate, assets, bookings, onBookingClick }: WeekViewProps) {
  const locale = useLocale();
  const t = useTranslations('venue-admin.calendar');

  // Generate week days
  const weekDays = useMemo(() => {
    const days: Date[] = [];
    const start = new Date(startDate);
    // Set to start of week (Saturday for Persian calendar)
    const dayOfWeek = start.getDay();
    const diff = dayOfWeek === 6 ? 0 : (dayOfWeek + 1);
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
    const dayKeys = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;
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
      <div className="flex items-center justify-center h-64 text-muted-foreground bg-muted/5 rounded-lg border border-dashed">
        <div className="text-center">
          <p className="text-lg font-medium mb-1">{t('noAssets')}</p>
          <p className="text-sm opacity-70">{t('pleaseAddAssets')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto rounded-lg border shadow-sm bg-card -mx-px sm:mx-0">
      <div className="min-w-[600px] sm:min-w-[800px] lg:min-w-[1000px]">
        {/* Header with day names */}
        <div
          className="sticky top-0 z-20 grid border-b bg-background/95 backdrop-blur shadow-sm"
          style={{ gridTemplateColumns: `100px repeat(7, 1fr)` }}
        >
          <div className="p-2 sm:p-4 text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-center border-e bg-muted/10">
            {t('assets')}
          </div>
          {weekDays.map((day, index) => {
            const today = isToday(day);
            return (
              <div
                key={index}
                className={cn(
                  'p-1.5 sm:p-3 text-center border-e flex flex-col items-center justify-center gap-0.5 transition-colors',
                  today && 'bg-primary/5'
                )}
              >
                <span className={cn(
                  "text-[9px] sm:text-[10px] font-bold uppercase tracking-tight",
                  today ? "text-primary" : "text-muted-foreground"
                )}>
                  {getDayName(day)}
                </span>
                <span className={cn(
                  'text-base sm:text-xl font-black tabular-nums',
                  today ? 'text-primary' : 'text-foreground'
                )}>
                  {formatDate(day)}
                </span>
                {today && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5 sm:mt-1 shadow-[0_0_8px_rgba(var(--primary),0.5)]" />}
              </div>
            );
          })}
        </div>

        {/* Asset rows */}
        <div className="divide-y">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="grid hover:bg-muted/5 transition-colors group/row"
              style={{ gridTemplateColumns: `100px repeat(7, 1fr)` }}
            >
              <div className="p-2 sm:p-4 border-e bg-muted/5 flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform group-hover/row:scale-110">
                  <span className="text-[8px] sm:text-[10px] font-bold">{asset.name.substring(0, 2).toUpperCase()}</span>
                </div>
                <div className="min-w-0 hidden sm:block">
                  <p className="text-sm font-semibold truncate text-foreground/90">{asset.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                    {asset.type ? t(`sportTypes.${asset.type.toLowerCase()}`, { defaultValue: asset.type }) : t('standardAsset')}
                  </p>
                </div>
              </div>

              {weekDays.map((day, dayIndex) => {
                const dayBookings = getBookingsForDate(day).filter(
                  (b) => b.assetId === asset.id
                );
                const today = isToday(day);

                return (
                  <div
                    key={dayIndex}
                    className={cn(
                      'min-h-[80px] sm:min-h-[140px] p-1 sm:p-2 border-e relative overflow-hidden',
                      today && 'bg-primary/[0.02]'
                    )}
                  >
                    <div className="space-y-1 sm:space-y-1.5 relative z-10">
                      {dayBookings.slice(0, 3).map((booking) => {
                        const style = statusStyles[booking.status] || { container: 'bg-gray-50 border-gray-200', icon: 'text-gray-400' };
                        return (
                          <div
                            key={booking.id}
                            className={cn(
                              'text-[9px] sm:text-[10px] p-1 sm:p-1.5 rounded-md border shadow-sm cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:shadow-md flex flex-col gap-0.5',
                              style.container
                            )}
                            onClick={() => onBookingClick(booking)}
                          >
                            <div className="flex items-center gap-0.5 sm:gap-1">
                              {booking.status === BookingStatus.MAINTENANCE ? (
                                <Wrench className={cn("w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0", style.icon)} />
                              ) : (
                                <User className={cn("w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0", style.icon)} />
                              )}
                              <span className="font-bold truncate leading-tight">
                                {booking.status === BookingStatus.FROZEN
                                  ? t('reserved')
                                  : booking.status === BookingStatus.MAINTENANCE
                                    ? t('maintenanceBlock')
                                    : booking.participants?.[0]?.name || t('customer')}
                              </span>
                              {booking.isVip && (
                                <Crown className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-amber-500 fill-amber-400 shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-0.5 sm:gap-1 opacity-80">
                              <Clock className={cn("w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0", style.icon)} />
                              <span className="font-medium">{booking.startTime}</span>
                            </div>
                          </div>
                        );
                      })}

                      {dayBookings.length > 3 && (
                        <button
                          className="w-full py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-0.5 bg-muted/20 rounded-md"
                          onClick={() => {
                            // Logic to switch to day view for this date?
                          }}
                        >
                          <span>+{dayBookings.length - 3} {t('more')}</span>
                          <ChevronRight className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                        </button>
                      )}
                    </div>

                    {/* Background decorations */}
                    {dayBookings.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/row:opacity-10 pointer-events-none transition-opacity">
                        <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest -rotate-12">{t('available')}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
