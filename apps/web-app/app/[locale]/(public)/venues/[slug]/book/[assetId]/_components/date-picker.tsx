'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@smartclub/ui/button';
import { cn } from '@smartclub/utils';

interface DatePickerProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  locale: string;
}

export function DatePicker({ selectedDate, onDateChange, locale }: DatePickerProps) {
  const t = useTranslations('booking.calendar');

  // Generate next 14 days
  const dates: Date[] = [];
  for (let i = 0; i < 14; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date);
  }

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return t('today');
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return t('tomorrow');
    }

    return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getDayName = (date: Date) => {
    return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      weekday: 'short',
    }).format(date);
  };

  const isSameDay = (date1: Date | null, date2: Date) => {
    if (!date1) return false;
    return date1.toDateString() === date2.toDateString();
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2 pb-2">
        {dates.map((date) => (
          <Button
            key={date.toISOString()}
            variant={isSameDay(selectedDate, date) ? 'default' : 'outline'}
            className={cn(
              'flex-shrink-0 flex-col h-auto py-3 px-4 min-w-[80px]',
              isSameDay(selectedDate, date) && 'ring-2 ring-primary ring-offset-2'
            )}
            onClick={() => onDateChange(date)}
          >
            <span className="text-xs font-normal opacity-80">{getDayName(date)}</span>
            <span className="text-base font-semibold mt-1">{formatDate(date)}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
