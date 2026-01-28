'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, Clock } from 'lucide-react';
import type { TimeSlot } from '@smartclub/types';
import { Button } from '@smartclub/ui/button';
import { Badge } from '@smartclub/ui/badge';
import { cn } from '@smartclub/utils';

interface SlotSelectorProps {
  assetId: string;
  selectedDate: Date;
  selectedSlot: { startTime: string; endTime: string; price: number } | null;
  onSlotChange: (slot: { startTime: string; endTime: string; price: number } | null) => void;
  slotDuration: number;
}

export function SlotSelector({
  assetId,
  selectedDate,
  selectedSlot,
  onSlotChange,
  slotDuration,
}: SlotSelectorProps) {
  const t = useTranslations('booking.slotBased');
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      fetchSlots();
    }
  }, [selectedDate, assetId]);

  const fetchSlots = async () => {
    setIsLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await fetch(`/api/assets/${assetId}/slots?date=${dateStr}`);
      const data = await response.json();

      if (data.success) {
        setSlots(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch slots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlotClick = (slot: TimeSlot) => {
    if (!slot.isAvailable) return;

    const isSameSlot =
      selectedSlot?.startTime === slot.startTime && selectedSlot?.endTime === slot.endTime;

    if (isSameSlot) {
      onSlotChange(null);
    } else {
      onSlotChange({
        startTime: slot.startTime,
        endTime: slot.endTime,
        price: slot.price,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">{t('noSlotsAvailable')}</p>
      </div>
    );
  }

  const availableCount = slots.filter((s) => s.isAvailable).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {t('slotDuration', { duration: slotDuration })}
        </p>
        <Badge variant="outline">
          {availableCount} {t('available')}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-6">
        {slots.map((slot) => {
          const isSelected =
            selectedSlot?.startTime === slot.startTime && selectedSlot?.endTime === slot.endTime;

          return (
            <Button
              key={`${slot.startTime}-${slot.endTime}`}
              variant={isSelected ? 'default' : slot.isAvailable ? 'outline' : 'ghost'}
              className={cn(
                'h-auto py-3 px-2',
                !slot.isAvailable && 'opacity-40 cursor-not-allowed',
                isSelected && 'ring-2 ring-primary ring-offset-2'
              )}
              disabled={!slot.isAvailable}
              onClick={() => handleSlotClick(slot)}
            >
              <div className="text-center">
                <div className="font-medium">{slot.startTime}</div>
                {!slot.isAvailable && (
                  <div className="text-xs text-muted-foreground mt-1">{t('booked')}</div>
                )}
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
