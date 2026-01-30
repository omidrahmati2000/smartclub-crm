'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@smartclub/ui/card';
import { format } from 'date-fns-jalali';
import { OccupancyHeatmapCell } from '@smartclub/types';
import { cn } from '@smartclub/utils';

interface OccupancyHeatmapProps {
  data: OccupancyHeatmapCell[];
}

export function OccupancyHeatmap({ data }: OccupancyHeatmapProps) {
  const t = useTranslations('venue-admin.finance.occupancy');
  const locale = useLocale();

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('heatmap')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">{t('noData')}</div>
        </CardContent>
      </Card>
    );
  }

  // Get unique dates and hours
  const dates = Array.from(new Set(data.map((d) => d.date))).sort();
  const hours = Array.from(new Set(data.map((d) => d.hour))).sort((a, b) => a - b);

  // Create a map for quick lookup
  const dataMap = new Map<string, OccupancyHeatmapCell>();
  data.forEach((cell) => {
    const key = `${cell.date}-${cell.hour}`;
    dataMap.set(key, cell);
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return locale === 'fa' ? format(date, 'd MMM') : format(date, 'MMM d');
  };

  const getColor = (occupancyRate: number) => {
    if (occupancyRate >= 80) return 'bg-green-600';
    if (occupancyRate >= 60) return 'bg-green-500';
    if (occupancyRate >= 40) return 'bg-yellow-500';
    if (occupancyRate >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTextColor = (occupancyRate: number) => {
    if (occupancyRate >= 40) return 'text-white';
    return 'text-gray-900';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('heatmap')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(${dates.length}, minmax(60px, 1fr))` }}>
              {/* Header row */}
              <div className="sticky right-0 bg-background p-2 text-sm font-medium">
                {t('hour')}
              </div>
              {dates.map((date) => (
                <div key={date} className="p-2 text-center text-sm font-medium">
                  {formatDate(date)}
                </div>
              ))}

              {/* Data rows */}
              {hours.map((hour) => (
                <>
                  <div
                    key={`hour-${hour}`}
                    className="sticky right-0 bg-background p-2 text-sm font-medium"
                  >
                    {hour}:00
                  </div>
                  {dates.map((date) => {
                    const key = `${date}-${hour}`;
                    const cell = dataMap.get(key);
                    const occupancyRate = cell?.occupancyRate ?? 0;

                    return (
                      <div
                        key={key}
                        className={cn(
                          'p-2 text-center text-xs font-medium rounded transition-all hover:scale-105 cursor-pointer',
                          getColor(occupancyRate),
                          getTextColor(occupancyRate),
                        )}
                        title={`${formatDate(date)} ${hour}:00 - ${occupancyRate.toFixed(1)}%`}
                      >
                        {occupancyRate > 0 ? `${occupancyRate.toFixed(0)}%` : '-'}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-4 text-sm">
          <span className="text-muted-foreground">{t('occupancyRate')}:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded" />
            <span>0-20%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded" />
            <span>20-40%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded" />
            <span>40-60%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span>60-80%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded" />
            <span>80-100%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
