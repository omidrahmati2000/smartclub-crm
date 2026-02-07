'use client';

import { useTranslations, useLocale } from 'next-intl';
import { cn, formatCurrency } from '@smartclub/utils';
import type { Booking } from '@smartclub/types';
import { BookingStatus } from '@smartclub/types';
import {
  Clock,
  Timer,
  CreditCard,
  User,
  StickyNote,
  CalendarDays,
  Crown,
  Tag,
  Globe,
  AlertTriangle,
} from 'lucide-react';

interface BookingTooltipProps {
  booking: Booking;
  position: { x: number; y: number };
}

export function BookingTooltip({ booking, position }: BookingTooltipProps) {
  const t = useTranslations('venue-admin.calendar');
  const locale = useLocale();

  const getStatusLabel = (status: BookingStatus) => t(`status.${status.toLowerCase()}`, { defaultValue: status });

  const getStatusStyles = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]';
      case BookingStatus.PENDING:
        return 'bg-amber-500/10 text-amber-700 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]';
      case BookingStatus.CHECKED_IN:
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]';
      case BookingStatus.COMPLETED:
        return 'bg-slate-500/10 text-slate-700 border-slate-500/20';
      case BookingStatus.CANCELLED:
        return 'bg-rose-500/10 text-rose-700 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]';
      case BookingStatus.NO_SHOW:
        return 'bg-orange-500/10 text-orange-700 border-orange-500/20';
      case BookingStatus.FROZEN:
        return 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]';
      case BookingStatus.MAINTENANCE:
        return 'bg-zinc-500/10 text-zinc-700 border-zinc-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
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
      className="fixed z-[110] bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-0 min-w-[220px] sm:min-w-[280px] max-w-[280px] sm:max-w-[320px] animate-in fade-in-0 zoom-in-95 pointer-events-none overflow-hidden"
      style={{
        left: Math.min(position.x, typeof window !== 'undefined' ? window.innerWidth - 300 : position.x),
        top: Math.max(position.y, 100),
        transform: 'translateY(-100%) translateY(-12px) translateX(-50%)',
      }}
    >
      {/* Header Decoration */}
      <div className="h-1.5 w-full bg-primary/20" />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <User className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('customer')}</span>
              {booking.isVip && (
                <Crown className="w-3 h-3 text-amber-500 fill-amber-400" />
              )}
            </div>
            <h4 className="font-black text-sm text-foreground truncate leading-tight">
              {booking.participants?.[0]?.name || t('customer')}
            </h4>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div
              className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tighter border transition-all',
                getStatusStyles(booking.status)
              )}
            >
              {getStatusLabel(booking.status)}
            </div>
            {booking.priority && booking.priority !== 'normal' && (
              <div className={cn(
                'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tight',
                booking.priority === 'urgent' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'
              )}>
                <AlertTriangle className="w-2 h-2" />
                {t(`priority.${booking.priority}`, { defaultValue: booking.priority })}
              </div>
            )}
          </div>
        </div>

        {/* Grid Details */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="space-y-1 bg-muted/30 p-2 rounded-xl border border-border/30">
            <div className="flex items-center gap-1 opacity-70">
              <Clock className="w-2.5 h-2.5" />
              <span className="text-[9px] font-black uppercase tracking-tight">{t('time', { defaultValue: 'Time' })}</span>
            </div>
            <span className="text-xs font-bold tabular-nums">
              {booking.startTime} - {booking.endTime}
            </span>
          </div>

          <div className="space-y-1 bg-muted/30 p-2 rounded-xl border border-border/30">
            <div className="flex items-center gap-1 opacity-70">
              <Timer className="w-2.5 h-2.5" />
              <span className="text-[9px] font-black uppercase tracking-tight">{t('duration', { defaultValue: 'Duration' })}</span>
            </div>
            <span className="text-xs font-bold">{durationText}</span>
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t">
          {booking.totalPrice && (
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <CreditCard className="w-3 h-3 text-muted-foreground/60" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{t('investment')}</span>
              </div>
              <span className="text-xs font-black text-primary tabular-nums">
                {formatCurrency(booking.totalPrice, booking.currency || 'AED', 'en')}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-3 h-3 text-muted-foreground/60" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{t('reference')}</span>
            </div>
            <span className="text-xs font-black text-muted-foreground/80 tabular-nums uppercase tracking-tighter">
              #{booking.id.substring(0, 6)}
            </span>
          </div>

          {booking.bookingSource && (
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3 text-muted-foreground/60" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{t('source')}</span>
              </div>
              <span className="text-xs font-black text-muted-foreground/80 uppercase tracking-tighter">
                {t(`bookingSource.${booking.bookingSource}`, { defaultValue: booking.bookingSource })}
              </span>
            </div>
          )}

          {booking.tags && booking.tags.length > 0 && (
            <div className="flex items-start gap-2 px-1">
              <Tag className="w-3 h-3 text-muted-foreground/60 shrink-0 mt-0.5" />
              <div className="flex flex-wrap gap-1">
                {booking.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 text-[8px] font-bold bg-muted rounded-md text-muted-foreground uppercase tracking-tight"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {booking.notes && (
            <div className="bg-primary/5 p-2 rounded-lg border border-primary/20 flex gap-2">
              <StickyNote className="w-3 h-3 text-primary shrink-0" />
              <p className="text-[10px] font-bold text-primary/80 italic leading-tight">{booking.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Arrow Decoration */}
      <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-background border-r border-b border-border/50 rotate-45" />
    </div>
  );
}
