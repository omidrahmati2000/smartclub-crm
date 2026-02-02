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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-background border shadow-lg rounded-lg p-4 flex items-center gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">
            {selectedSlots.length} {t('slotsSelected', { defaultValue: 'slots selected' })}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('duration', { defaultValue: 'Duration' })}: {durationText}
          </p>
        </div>

        <div className="flex items-center gap-2 border-s ps-4">
          <Button
            size="sm"
            onClick={onCreateBooking}
            disabled={!allSameAsset || !allSameDate}
          >
            <Calendar className="h-4 w-4 me-2" />
            {t('createBooking', { defaultValue: 'Create Booking' })}
          </Button>

          <Button size="sm" variant="outline" onClick={onClear}>
            <X className="h-4 w-4 me-2" />
            {t('clear', { defaultValue: 'Clear' })}
          </Button>
        </div>

        {(!allSameAsset || !allSameDate) && (
          <div className="text-xs text-orange-600 border-s ps-4">
            {t('selectContinuousSlots', {
              defaultValue: 'Select continuous slots on same asset',
            })}
          </div>
        )}
      </div>
    </div>
  );
}
