'use client';

import { useTranslations } from 'next-intl';
import type { Venue } from '@smartclub/types';
import { Badge } from '@smartclub/ui/badge';

interface VenueHoursProps {
  operatingHours: Venue['operatingHours'];
}

export function VenueHours({ operatingHours }: VenueHoursProps) {
  const t = useTranslations('venue.hours');

  // Get current status
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const todayHours = operatingHours.find((h) => h.dayOfWeek === currentDay);

  let isOpenNow = false;
  let statusText = t('closedNow');

  if (todayHours && !todayHours.isClosed) {
    const [openHour, openMin] = todayHours.openTime.split(':').map(Number);
    const [closeHour, closeMin] = todayHours.closeTime.split(':').map(Number);
    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;

    // Handle closing after midnight
    if (closeTime < openTime) {
      isOpenNow = currentTime >= openTime || currentTime < closeTime;
    } else {
      isOpenNow = currentTime >= openTime && currentTime < closeTime;
    }

    if (isOpenNow) {
      statusText = t('openNow');
    } else if (currentTime < openTime) {
      statusText = t('opensAt', { time: todayHours.openTime });
    } else {
      statusText = t('closesAt', { time: todayHours.closeTime });
    }
  }

  return (
    <div className="space-y-3">
      {/* Status badge */}
      <Badge variant={isOpenNow ? 'default' : 'secondary'} className="mb-2">
        {statusText}
      </Badge>

      {/* Hours list */}
      <div className="space-y-2">
        {operatingHours.map((hours) => {
          const isToday = hours.dayOfWeek === currentDay;
          return (
            <div
              key={hours.dayOfWeek}
              className={`flex justify-between text-sm ${
                isToday ? 'font-medium' : 'text-muted-foreground'
              }`}
            >
              <span>{t(`days.${hours.dayOfWeek}`)}</span>
              <span>
                {hours.isClosed
                  ? t('closed')
                  : `${hours.openTime} - ${hours.closeTime}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
