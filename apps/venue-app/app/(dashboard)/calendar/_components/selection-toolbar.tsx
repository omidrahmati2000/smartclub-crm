'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@smartclub/ui/button';
import { Calendar, X } from 'lucide-react';
import type { TimeSlot } from '../_hooks/use-calendar-selection';

interface SelectionToolbarProps {
  selectedSlots: TimeSlot[];
  onCreateBooking: () => void;
  onClear: () => void;
}

export function SelectionToolbar({
  selectedSlots,
  onCreateBooking,
  onClear,
}: SelectionToolbarProps) {
  const t = useTranslations('venue-admin.calendar');

  if (selectedSlots.length === 0) return null;

  // Get time range
  const firstSlot = selectedSlots[0];
  const allSameAsset = selectedSlots.every((s) => s.assetId === firstSlot.assetId);
  const allSameDate = selectedSlots.every((s) => s.date === firstSlot.date);

  // Calculate total duration
  const totalMinutes = selectedSlots.length * 30;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const durationText =
    hours > 0
      ? minutes > 0
        ? `${hours}h ${minutes}m`
        : `${hours}h`
      : `${minutes}m`;

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 w-[calc(100%-2rem)] sm:w-auto max-w-lg sm:max-w-none">
      <div className="bg-background border shadow-lg rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div className="flex flex-col gap-0.5 sm:gap-1">
          <p className="text-xs sm:text-sm font-medium">
            {selectedSlots.length} {t('slotsSelected', { defaultValue: 'slots selected' })}
          </p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            {t('duration', { defaultValue: 'Duration' })}: {durationText}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:border-s sm:ps-4 w-full sm:w-auto">
          <Button
            size="sm"
            onClick={onCreateBooking}
            disabled={!allSameAsset || !allSameDate}
            className="flex-1 sm:flex-none text-xs"
          >
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 me-1.5 sm:me-2" />
            {t('createBooking', { defaultValue: 'Create Booking' })}
          </Button>

          <Button size="sm" variant="outline" onClick={onClear} className="shrink-0">
            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 me-0 sm:me-2" />
            <span className="hidden sm:inline">{t('clear', { defaultValue: 'Clear' })}</span>
          </Button>
        </div>

        {(!allSameAsset || !allSameDate) && (
          <div className="text-[10px] sm:text-xs text-orange-600 sm:border-s sm:ps-4">
            {t('selectContinuousSlots', {
              defaultValue: 'Select continuous slots on same asset',
            })}
          </div>
        )}
      </div>
    </div>
  );
}
