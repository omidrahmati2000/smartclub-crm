'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import {
  Eye,
  Edit,
  Copy,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
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

  const menuItems = [
    {
      icon: Eye,
      label: 'View Details',
      onClick: onViewDetails,
    },
    {
      icon: Edit,
      label: 'Edit',
      onClick: onEdit,
      disabled: booking.status === BookingStatus.COMPLETED,
    },
    {
      icon: Copy,
      label: 'Duplicate',
      onClick: onDuplicate,
    },
    { divider: true },
    {
      icon: CheckCircle,
      label: 'Mark as Confirmed',
      onClick: () => onChangeStatus(BookingStatus.CONFIRMED),
      disabled: booking.status === BookingStatus.CONFIRMED,
    },
    {
      icon: Clock,
      label: 'Mark as Checked In',
      onClick: () => onChangeStatus(BookingStatus.CHECKED_IN),
      disabled: booking.status === BookingStatus.CHECKED_IN,
    },
    {
      icon: XCircle,
      label: 'Cancel',
      onClick: () => onChangeStatus(BookingStatus.CANCELLED),
      disabled: booking.status === BookingStatus.CANCELLED,
    },
    { divider: true },
    {
      icon: Trash2,
      label: 'Delete',
      onClick: onDelete,
      danger: true,
    },
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[200px] bg-background border rounded-lg shadow-lg py-1 animate-in fade-in-0 zoom-in-95"
      style={{ left: position.x, top: position.y }}
    >
      {menuItems.map((item, index) => {
        if ('divider' in item) {
          return <div key={index} className="h-px bg-border my-1" />;
        }

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
              'w-full flex items-center gap-3 px-4 py-2 text-sm text-start transition-colors',
              item.disabled && 'opacity-50 cursor-not-allowed',
              !item.disabled && !item.danger && 'hover:bg-accent',
              !item.disabled && item.danger && 'hover:bg-destructive/10 text-destructive'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
