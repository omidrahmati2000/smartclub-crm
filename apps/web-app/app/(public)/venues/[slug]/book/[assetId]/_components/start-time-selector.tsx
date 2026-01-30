'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, Clock } from 'lucide-react';
import { Button } from '@smartclub/ui/button';
import { cn } from '@smartclub/utils';

interface StartTimeSelectorProps {
  assetId: string;
  selectedDate: Date;
  selectedStartTime: string | null;
  onStartTimeChange: (time: string | null) => void;
  duration: number;
}

export function StartTimeSelector({
  assetId,
  selectedDate,
  selectedStartTime,
  onStartTimeChange,
  duration,
}: StartTimeSelectorProps) {
  const t = useTranslations('booking.durationBased');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableTimes();
    }
  }, [selectedDate, assetId, duration]);

  const fetchAvailableTimes = async () => {
    setIsLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await fetch(
        `/api/assets/${assetId}/available-times?date=${dateStr}&duration=${duration}`
      );
      const data = await response.json();

      if (data.success) {
        setAvailableTimes(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch available times:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeClick = (time: string) => {
    if (selectedStartTime === time) {
      onStartTimeChange(null);
    } else {
      onStartTimeChange(time);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (availableTimes.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">{t('noTimesAvailable')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-6">
      {availableTimes.map((time) => {
        const isSelected = selectedStartTime === time;

        return (
          <Button
            key={time}
            variant={isSelected ? 'default' : 'outline'}
            className={cn(
              'h-auto py-3 px-2',
              isSelected && 'ring-2 ring-primary ring-offset-2'
            )}
            onClick={() => handleTimeClick(time)}
          >
            <div className="text-center font-medium">{time}</div>
          </Button>
        );
      })}
    </div>
  );
}
