'use client';

import { useTranslations } from 'next-intl';
import { Clock, DollarSign } from 'lucide-react';
import { Button } from '@smartclub/ui/button';
import { Badge } from '@smartclub/ui/badge';
import { cn } from '@smartclub/utils';

interface DurationSelectorProps {
  minDuration: number;
  maxDuration: number;
  selectedDuration: number;
  onDurationChange: (duration: number) => void;
  pricePerHour: number;
  currency: string;
}

export function DurationSelector({
  minDuration,
  maxDuration,
  selectedDuration,
  onDurationChange,
  pricePerHour,
  currency,
}: DurationSelectorProps) {
  const t = useTranslations('booking.durationBased');

  // Generate duration options in 30-minute increments
  const durations: number[] = [];
  for (let d = minDuration; d <= maxDuration; d += 30) {
    durations.push(d);
  }

  const formatPrice = (price: number) => {
    if (currency === 'IRT' || currency === 'IRR') {
      return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(price);
  };

  const calculatePrice = (duration: number) => {
    return (pricePerHour / 60) * duration;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} ${t('minutes')}`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-4">
      {/* Info */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{t('minDuration', { min: minDuration })}</span>
          <span>•</span>
          <span>{t('maxDuration', { max: maxDuration })}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {t('pricePerHour', { price: formatPrice(pricePerHour) })}
          </span>
        </div>
      </div>

      {/* Duration buttons */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {durations.map((duration) => {
          const isSelected = selectedDuration === duration;
          const price = calculatePrice(duration);

          return (
            <Button
              key={duration}
              variant={isSelected ? 'default' : 'outline'}
              className={cn(
                'h-auto py-4 px-3 flex flex-col items-start gap-2',
                isSelected && 'ring-2 ring-primary ring-offset-2'
              )}
              onClick={() => onDurationChange(duration)}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold">{formatDuration(duration)}</span>
                {isSelected && (
                  <Badge variant="secondary" className="text-xs">
                    {t('selected')}
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {formatPrice(price)}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
