'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import {
  Eye,
  Edit,
  Copy,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  MoreHorizontal,
  ArrowRightLeft,
  Calendar as CalendarIcon,
  Crown,
  Snowflake,
  Wrench,
} from 'lucide-react';
import { cn } from '@smartclub/utils';
import type { Booking } from '@smartclub/types';
import { BookingStatus } from '@smartclub/types';

interface ContextMenuProps {
  booking: Booking;
  position: { x: number; y: number };
  onClose: () => void;
  onViewDetails: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onChangeStatus: (status: BookingStatus) => void;
  onToggleVip?: (bookingId: string) => void;
}

export function ContextMenu({
  booking,
  position,
  onClose,
  onViewDetails,
  onEdit,
  onDuplicate,
  onDelete,
  onChangeStatus,
  onToggleVip,
}: ContextMenuProps) {
  const t = useTranslations('venue-admin.calendar');
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Adjust position to prevent overflow
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let { x, y } = position;

      if (x + rect.width > viewportWidth) {
        x = viewportWidth - rect.width - 10;
      }

      if (y + rect.height > viewportHeight) {
        y = viewportHeight - rect.height - 10;
      }

      menuRef.current.style.left = `${x}px`;
      menuRef.current.style.top = `${y}px`;
    }
  }, [position]);

  type MenuItem = {
    icon: typeof Eye;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    shortcut?: string;
    danger?: boolean;
    variant?: string;
  };

  type MenuGroup = {
    label: string;
    items: MenuItem[];
  };

  const menuGroups: MenuGroup[] = [
    {
      label: t('actions'),
      items: [
        {
          icon: Eye,
          label: t('viewDetails'),
          onClick: onViewDetails,
          shortcut: 'V'
        },
        {
          icon: Edit,
          label: t('edit'),
          onClick: onEdit,
          disabled: booking.status === BookingStatus.COMPLETED,
          shortcut: 'E'
        },
        {
          icon: Copy,
          label: t('duplicate'),
          onClick: onDuplicate,
        },
      ]
    },
    {
      label: t('statusTitle'),
      items: [
        {
          icon: CheckCircle2,
          label: t('confirm'),
          onClick: () => onChangeStatus(BookingStatus.CONFIRMED),
          disabled: booking.status === BookingStatus.CONFIRMED,
          variant: 'success'
        },
        {
          icon: Clock,
          label: t('checkIn'),
          onClick: () => onChangeStatus(BookingStatus.CHECKED_IN),
          disabled: booking.status === BookingStatus.CHECKED_IN,
          variant: 'info'
        },
        {
          icon: XCircle,
          label: t('cancel'),
          onClick: () => onChangeStatus(BookingStatus.CANCELLED),
          disabled: booking.status === BookingStatus.CANCELLED,
          variant: 'warning'
        },
      ]
    },
    {
      label: t('professional'),
      items: [
        {
          icon: Crown,
          label: booking.isVip ? t('removeVip') : t('markAsVip'),
          onClick: () => onToggleVip?.(booking.id),
          disabled: !onToggleVip,
        },
        {
          icon: Snowflake,
          label: t('freezeTime'),
          onClick: () => onChangeStatus(BookingStatus.FROZEN),
          disabled: booking.status === BookingStatus.FROZEN,
        },
        {
          icon: Wrench,
          label: t('blockForMaintenance'),
          onClick: () => onChangeStatus(BookingStatus.MAINTENANCE),
          disabled: booking.status === BookingStatus.MAINTENANCE,
        },
      ]
    },
    {
      label: t('danger'),
      items: [
        {
          icon: Trash2,
          label: t('delete'),
          onClick: onDelete,
          danger: true,
          shortcut: 'DEL'
        },
      ]
    }

  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] min-w-[220px] bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl py-2 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
      style={{ left: position.x, top: position.y }}
    >
      {/* Header */}
      <div className="px-4 py-3 mb-1 border-b bg-muted/30">
        <div className="flex items-center gap-2 mb-0.5">
          <CalendarIcon className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('bookingOptions')}</span>
        </div>
        <div className="text-xs font-bold text-foreground truncate">
          {booking.participants?.[0]?.name || t('customer')}
        </div>
      </div>

      <div className="px-1.5 space-y-1.5">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            <div className="px-2.5 py-1">
              <span className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground/60">{group.label}</span>
            </div>
            {group.items.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (!item.disabled) {
                      item.onClick();
                      onClose();
                    }
                  }}
                  disabled={item.disabled}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all group',
                    item.disabled && 'opacity-40 cursor-not-allowed',
                    !item.disabled && !item.danger && 'hover:bg-primary/10 hover:text-primary',
                    !item.disabled && item.danger && 'hover:bg-rose-500/10 text-rose-500',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn(
                      "h-4 w-4 transition-transform group-hover:scale-110",
                      !item.disabled && !item.danger && "text-muted-foreground group-hover:text-primary",
                      item.danger && "text-rose-500"
                    )} />
                    <span>{item.label}</span>
                  </div>
                  {item.shortcut && (
                    <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-tighter group-hover:text-primary/40">
                      {item.shortcut}
                    </span>
                  )}
                </button>
              );
            })}
            {groupIdx < menuGroups.length - 1 && <div className="h-px bg-border/40 mx-2 my-1" />}
          </div>
        ))}
      </div>

      {/* Footer Decoration */}
      <div className="mt-2 pt-2 border-t px-4 pb-1">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-tight">SmartClub CRM</span>
          <MoreHorizontal className="w-3 h-3 text-muted-foreground/20" />
        </div>
      </div>
    </div>
  );
}
