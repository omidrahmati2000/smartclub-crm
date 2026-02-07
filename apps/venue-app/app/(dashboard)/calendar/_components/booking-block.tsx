'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@smartclub/utils';
import type { Booking } from '@smartclub/types';
import { BookingStatus } from '@smartclub/types';
import { User, Clock, Crown, Repeat, Wrench } from 'lucide-react';

interface BookingBlockProps {
  booking: Booking;
  onClick: () => void;
  isDragging?: boolean;
  onResizeStart?: (edge: 'start' | 'end') => void;
  showResizeHandles?: boolean;
  compact?: boolean;
}

export function BookingBlock({
  booking,
  onClick,
  isDragging = false,
  onResizeStart,
  showResizeHandles = true,
  compact = false,
}: BookingBlockProps) {
  const t = useTranslations('venue-admin.calendar');

  const getStatusStyles = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return {
          container: 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-300/50 text-emerald-900 shadow-sm hover:from-emerald-100 hover:to-emerald-200 hover:shadow-md hover:border-emerald-400',
          icon: 'text-emerald-700'
        };
      case BookingStatus.PENDING:
        return {
          container: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300/50 text-amber-900 shadow-sm hover:from-amber-100 hover:to-amber-200 hover:shadow-md hover:border-amber-400',
          icon: 'text-amber-700'
        };
      case BookingStatus.CHECKED_IN:
        return {
          container: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300/50 text-blue-900 shadow-sm hover:from-blue-100 hover:to-blue-200 hover:shadow-md hover:border-blue-400',
          icon: 'text-blue-700'
        };
      case BookingStatus.COMPLETED:
        return {
          container: 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-300/50 text-slate-700 shadow-sm hover:from-slate-100 hover:to-slate-200 hover:shadow-md hover:border-slate-400',
          icon: 'text-slate-600'
        };
      case BookingStatus.CANCELLED:
        return {
          container: 'bg-gradient-to-br from-red-50 to-rose-100 border-rose-300/50 text-rose-900 shadow-sm hover:from-rose-100 hover:to-rose-200 hover:shadow-md hover:border-rose-400 opacity-80',
          icon: 'text-rose-700'
        };
      case BookingStatus.NO_SHOW:
        return {
          container: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300/50 text-orange-900 shadow-sm hover:from-orange-100 hover:to-orange-200 hover:shadow-md hover:border-orange-400',
          icon: 'text-orange-700'
        };
      case BookingStatus.FROZEN:
        return {
          container: 'bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-300/50 text-cyan-900 shadow-sm hover:from-cyan-100 hover:to-cyan-200 hover:shadow-md hover:border-cyan-400',
          icon: 'text-cyan-700'
        };
      case BookingStatus.MAINTENANCE:
        return {
          container: 'bg-gradient-to-br from-zinc-100 to-zinc-200 border-zinc-400/50 text-zinc-700 shadow-sm hover:from-zinc-200 hover:to-zinc-300 hover:shadow-md hover:border-zinc-500',
          icon: 'text-zinc-600'
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100',
          icon: 'text-gray-500'
        };
    }
  };

  const getPriorityStyles = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return 'ring-2 ring-red-500/40';
      case 'high':
        return 'ring-2 ring-amber-500/40';
      default:
        return '';
    }
  };

  const styles = getStatusStyles(booking.status);
  const priorityStyles = getPriorityStyles(booking.priority);
  const isFrozen = booking.status === BookingStatus.FROZEN;
  const isMaintenance = booking.status === BookingStatus.MAINTENANCE;

  const displayName = isFrozen
    ? t('reserved')
    : isMaintenance
      ? t('maintenanceBlock')
      : booking.participants?.[0]?.name || t('customer');

  const DisplayIcon = isMaintenance ? Wrench : User;

  return (
    <div className="relative w-full h-full group">
      {/* Top resize handle */}
      {showResizeHandles && onResizeStart && !isMaintenance && (
        <div
          className="absolute -top-1.5 left-0 right-0 h-4 sm:h-3 cursor-ns-resize z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity touch-none"
          onMouseDown={(e) => {
            e.stopPropagation();
            onResizeStart('start');
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            onResizeStart('start');
          }}
        >
          <div className="w-10 sm:w-12 h-1 bg-primary/50 rounded-full backdrop-blur-sm shadow-sm" />
        </div>
      )}

      <button
        onClick={onClick}
        className={cn(
          'w-full h-full rounded-md border flex flex-col justify-start items-start text-start transition-all duration-200 min-h-[24px] relative overflow-hidden',
          compact ? 'p-0.5 sm:p-1' : 'p-1.5 sm:p-2',
          styles.container,
          priorityStyles,
          isDragging && 'cursor-move ring-2 ring-primary ring-offset-2 opacity-80 scale-[1.02] z-50 shadow-xl',
          isMaintenance && 'bg-[repeating-linear-gradient(135deg,transparent,transparent_4px,rgba(0,0,0,0.04)_4px,rgba(0,0,0,0.04)_8px)]'
        )}
      >
        {/* VIP badge */}
        {booking.isVip && (
          <div className="absolute top-0.5 end-0.5 z-10">
            <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 fill-amber-400 drop-shadow-sm" />
          </div>
        )}

        <div className="flex items-center gap-1 sm:gap-1.5 w-full mb-0.5">
          <DisplayIcon className={cn("shrink-0", styles.icon, compact ? "w-2.5 h-2.5" : "w-3 h-3 sm:w-3.5 sm:h-3.5")} />
          <span className={cn("font-semibold truncate leading-tight", compact ? "text-[8px] sm:text-[9px]" : "text-[10px] sm:text-xs")}>
            {displayName}
          </span>
          {booking.isRecurring && (
            <Repeat className={cn("shrink-0 opacity-60", styles.icon, compact ? "w-2 h-2" : "w-2.5 h-2.5 sm:w-3 sm:h-3")} />
          )}
        </div>

        {!compact && (
          <div className="flex items-center gap-1 sm:gap-1.5 w-full text-[9px] sm:text-[10px] opacity-90 font-medium">
            <Clock className={cn("w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0", styles.icon)} />
            <span className="truncate">
              {booking.startTime} - {booking.endTime}
            </span>
          </div>
        )}
      </button>

      {/* Bottom resize handle */}
      {showResizeHandles && onResizeStart && !isMaintenance && (
        <div
          className="absolute -bottom-1.5 left-0 right-0 h-4 sm:h-3 cursor-ns-resize z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity touch-none"
          onMouseDown={(e) => {
            e.stopPropagation();
            onResizeStart('end');
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            onResizeStart('end');
          }}
        >
          <div className="w-10 sm:w-12 h-1 bg-primary/50 rounded-full backdrop-blur-sm shadow-sm" />
        </div>
      )}
    </div>
  );
}
