'use client';

import { useTranslations } from 'next-intl';
import { Input } from '@smartclub/ui/input';
import { Label } from '@smartclub/ui/label';
import { Switch } from '@smartclub/ui/switch';
import type { OperatingHours } from '@smartclub/types';

interface OperatingHoursSectionProps {
  hours: OperatingHours[];
  onHoursChange: (hours: OperatingHours[]) => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export function OperatingHoursSection({
  hours,
  onHoursChange,
}: OperatingHoursSectionProps) {
  const t = useTranslations('venue-admin.assets');

  const updateDay = (dayOfWeek: number, updates: Partial<OperatingHours>) => {
    const existing = hours.find((h) => h.dayOfWeek === dayOfWeek);

    if (existing) {
      onHoursChange(
        hours.map((h) =>
          h.dayOfWeek === dayOfWeek ? { ...h, ...updates } : h
        )
      );
    } else {
      onHoursChange([
        ...hours,
        {
          dayOfWeek,
          openTime: '08:00',
          closeTime: '22:00',
          isClosed: false,
          ...updates,
        },
      ]);
    }
  };

  const getDayHours = (dayOfWeek: number): OperatingHours => {
    return (
      hours.find((h) => h.dayOfWeek === dayOfWeek) || {
        dayOfWeek,
        openTime: '08:00',
        closeTime: '22:00',
        isClosed: false,
      }
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {t('operatingHoursDescription')}
      </p>

      {DAYS_OF_WEEK.map((day) => {
        const dayHours = getDayHours(day.value);

        return (
          <div
            key={day.value}
            className="flex items-center gap-4 p-4 border rounded-lg"
          >
            <div className="w-32">
              <Label>{day.label}</Label>
            </div>

            <Switch
              checked={!dayHours.isClosed}
              onCheckedChange={(checked) =>
                updateDay(day.value, { isClosed: !checked })
              }
            />

            {!dayHours.isClosed && (
              <>
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-muted-foreground">From</Label>
                  <Input
                    type="time"
                    value={dayHours.openTime}
                    onChange={(e) =>
                      updateDay(day.value, { openTime: e.target.value })
                    }
                    className="w-32"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm text-muted-foreground">To</Label>
                  <Input
                    type="time"
                    value={dayHours.closeTime}
                    onChange={(e) =>
                      updateDay(day.value, { closeTime: e.target.value })
                    }
                    className="w-32"
                  />
                </div>
              </>
            )}

            {dayHours.isClosed && (
              <span className="text-sm text-muted-foreground">Closed</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
