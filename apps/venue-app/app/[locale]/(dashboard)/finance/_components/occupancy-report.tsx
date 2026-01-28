'use client';

import { useTranslations } from 'next-intl';
import { ReportPeriod } from '@smartclub/types';
import { SummaryCards } from './summary-cards';
import { OccupancyCharts } from './occupancy-charts';
import { OccupancyHeatmap } from './occupancy-heatmap';
import { Activity, Clock, TrendingDown } from 'lucide-react';

interface OccupancyReportProps {
  period: ReportPeriod;
  locale: string;
}

export function OccupancyReport({ period, locale }: OccupancyReportProps) {
  const t = useTranslations('venue-admin.finance');

  // TODO: Replace with actual API call
  // Mock data for demonstration
  const mockData = {
    summary: {
      averageOccupancy: 68.5,
      totalAvailableSlots: 500,
      totalBookedSlots: 342,
      peakOccupancy: 92.3,
      peakOccupancyTime: '18:00-20:00',
      lowestOccupancy: 23.1,
      lowestOccupancyTime: '08:00-10:00',
    },
    byAsset: [
      {
        assetId: '1',
        assetName: 'زمین پادل 1',
        assetType: 'PADEL',
        occupancyRate: 75.5,
        totalSlots: 100,
        bookedSlots: 75,
      },
      {
        assetId: '2',
        assetName: 'زمین پادل 2',
        assetType: 'PADEL',
        occupancyRate: 68.0,
        totalSlots: 100,
        bookedSlots: 68,
      },
      {
        assetId: '3',
        assetName: 'زمین تنیس',
        assetType: 'TENNIS',
        occupancyRate: 62.0,
        totalSlots: 100,
        bookedSlots: 62,
      },
      {
        assetId: '4',
        assetName: 'استخر',
        assetType: 'POOL',
        occupancyRate: 71.0,
        totalSlots: 200,
        bookedSlots: 142,
      },
    ],
    byHour: [
      { hour: 8, occupancyRate: 23.1, bookings: 5 },
      { hour: 9, occupancyRate: 34.5, bookings: 8 },
      { hour: 10, occupancyRate: 45.2, bookings: 12 },
      { hour: 11, occupancyRate: 56.8, bookings: 15 },
      { hour: 12, occupancyRate: 48.3, bookings: 13 },
      { hour: 13, occupancyRate: 38.7, bookings: 10 },
      { hour: 14, occupancyRate: 52.4, bookings: 14 },
      { hour: 15, occupancyRate: 61.9, bookings: 16 },
      { hour: 16, occupancyRate: 73.5, bookings: 20 },
      { hour: 17, occupancyRate: 84.2, bookings: 23 },
      { hour: 18, occupancyRate: 92.3, bookings: 25 },
      { hour: 19, occupancyRate: 89.6, bookings: 24 },
      { hour: 20, occupancyRate: 78.1, bookings: 21 },
      { hour: 21, occupancyRate: 65.4, bookings: 18 },
    ],
    byDayOfWeek: [
      { dayOfWeek: 0, dayName: 'شنبه', occupancyRate: 72.3, bookings: 45 },
      { dayOfWeek: 1, dayName: 'یکشنبه', occupancyRate: 68.5, bookings: 42 },
      { dayOfWeek: 2, dayName: 'دوشنبه', occupancyRate: 64.2, bookings: 38 },
      { dayOfWeek: 3, dayName: 'سه‌شنبه', occupancyRate: 66.8, bookings: 40 },
      { dayOfWeek: 4, dayName: 'چهارشنبه', occupancyRate: 69.1, bookings: 43 },
      { dayOfWeek: 5, dayName: 'پنج‌شنبه', occupancyRate: 75.6, bookings: 48 },
      { dayOfWeek: 6, dayName: 'جمعه', occupancyRate: 58.3, bookings: 35 },
    ],
    heatmap: {
      data: generateHeatmapData(),
    },
  };

  const summaryCards = [
    {
      title: t('summary.averageOccupancy'),
      value: `${mockData.summary.averageOccupancy.toFixed(1)}%`,
      icon: <Activity className="h-4 w-4" />,
    },
    {
      title: t('summary.totalBookedSlots'),
      value: mockData.summary.totalBookedSlots,
      icon: <Clock className="h-4 w-4" />,
    },
    {
      title: t('summary.peakOccupancyTime'),
      value: mockData.summary.peakOccupancyTime,
      icon: <TrendingDown className="h-4 w-4" />,
    },
    {
      title: t('summary.lowestOccupancyTime'),
      value: mockData.summary.lowestOccupancyTime,
      icon: <TrendingDown className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      <SummaryCards cards={summaryCards} />
      <OccupancyCharts
        byAsset={mockData.byAsset}
        byHour={mockData.byHour}
        byDayOfWeek={mockData.byDayOfWeek}
        locale={locale}
      />
      <OccupancyHeatmap data={mockData.heatmap.data} locale={locale} />
    </div>
  );
}

// Helper function to generate mock heatmap data
function generateHeatmapData() {
  const data = [];
  const dates = [
    '2026-01-22',
    '2026-01-23',
    '2026-01-24',
    '2026-01-25',
    '2026-01-26',
    '2026-01-27',
    '2026-01-28',
  ];
  const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

  for (const date of dates) {
    for (const hour of hours) {
      // Generate semi-realistic occupancy rates
      let occupancyRate = 50;
      if (hour >= 17 && hour <= 19) {
        occupancyRate = 70 + Math.random() * 25; // Peak hours
      } else if (hour >= 14 && hour <= 16) {
        occupancyRate = 50 + Math.random() * 25;
      } else if (hour >= 20 || hour <= 10) {
        occupancyRate = 20 + Math.random() * 30; // Off-peak
      } else {
        occupancyRate = 40 + Math.random() * 30;
      }

      data.push({
        date,
        hour,
        occupancyRate: Math.round(occupancyRate),
        bookings: Math.floor(occupancyRate / 5),
      });
    }
  }

  return data;
}
