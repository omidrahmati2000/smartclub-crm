'use client';

import { useTranslations, useLocale } from 'next-intl';
import { ReportPeriod, BookingSource } from '@smartclub/types';
import { SummaryCards } from './summary-cards';
import { RevenueCharts } from './revenue-charts';
import { CancellationReport } from './cancellation-report';
import { DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@smartclub/utils';

interface RevenueReportProps {
  period: ReportPeriod;
}

export function RevenueReport({ period }: RevenueReportProps) {
  const t = useTranslations('venue-admin.finance');
  const locale = useLocale();

  // TODO: Replace with actual API call using generateRevenueReport()
  // Mock data for demonstration — 7-day snapshot for Dubai Sports Hub
  // Average booking value ~105 AED, daily bookings 8-22
  const mockData = {
    summary: {
      totalRevenue: 25480, // ~7 days × ~15 bookings × ~105 AED avg = ~11,025/week (realistic for small venue)
      totalBookings: 245,
      averageBookingValue: 104,
      growthPercentage: 12.5,
      completedBookings: 220,
      cancelledBookings: 25,
      currency: 'AED',
    },
    byAssetType: [
      { assetType: 'PADEL', assetTypeName: 'Padel', revenue: 11466, bookings: 100, percentage: 45, averageValue: 135 },
      { assetType: 'TENNIS', assetTypeName: 'Tennis', revenue: 6370, bookings: 61, percentage: 25, averageValue: 112 },
      { assetType: 'PS5', assetTypeName: 'PlayStation 5', revenue: 4586, bookings: 49, percentage: 18, averageValue: 120 },
      { assetType: 'BILLIARDS', assetTypeName: 'Billiards', revenue: 3058, bookings: 35, percentage: 12, averageValue: 90 },
    ],
    bySource: [
      { source: BookingSource.ONLINE, sourceName: 'Online Booking', revenue: 16562, bookings: 172, percentage: 65 },
      { source: BookingSource.WALK_IN, sourceName: 'Walk-in', revenue: 6370, bookings: 49, percentage: 25 },
      { source: BookingSource.PHONE, sourceName: 'Phone', revenue: 2548, bookings: 24, percentage: 10 },
    ],
    byPaymentMethod: [
      { method: 'ONLINE', methodName: 'Online Payment', revenue: 11466, bookings: 110, percentage: 45 },
      { method: 'CARD_ON_SITE', methodName: 'Card on Site', revenue: 6370, bookings: 61, percentage: 25 },
      { method: 'WALLET', methodName: 'Wallet', revenue: 3822, bookings: 37, percentage: 15 },
      { method: 'CASH', methodName: 'Cash', revenue: 3822, bookings: 37, percentage: 15 },
    ],
    daily: [
      { date: '2026-01-25', revenue: 2940, bookings: 10, completedBookings: 9, cancelledBookings: 1 },  // Sun
      { date: '2026-01-26', revenue: 2520, bookings: 9, completedBookings: 8, cancelledBookings: 1 },   // Mon
      { date: '2026-01-27', revenue: 2730, bookings: 11, completedBookings: 10, cancelledBookings: 1 },  // Tue
      { date: '2026-01-28', revenue: 3150, bookings: 13, completedBookings: 12, cancelledBookings: 1 },  // Wed
      { date: '2026-01-29', revenue: 4620, bookings: 18, completedBookings: 16, cancelledBookings: 2 },  // Thu (weekend)
      { date: '2026-01-30', revenue: 5250, bookings: 20, completedBookings: 18, cancelledBookings: 2 },  // Fri (weekend)
      { date: '2026-01-31', revenue: 4270, bookings: 14, completedBookings: 13, cancelledBookings: 1 },  // Sat
    ],
    cancellations: {
      totalCancellations: 25,
      cancellationRate: 10.2,
      totalRefunds: 2038,  // ~8% of revenue
      lostRevenue: 3058,   // ~12% of revenue
      cancellationsByReason: [
        { reason: 'Customer Request', count: 10, percentage: 40 },
        { reason: 'Schedule Change', count: 8, percentage: 32 },
        { reason: 'Weather Conditions', count: 5, percentage: 20 },
        { reason: 'Other', count: 2, percentage: 8 },
      ],
    },
  };

  const summaryCards = [
    {
      title: t('summary.totalRevenue'),
      value: mockData.summary.totalRevenue,
      trend: mockData.summary.growthPercentage,
      icon: <DollarSign className="h-4 w-4" />,
      formatValue: (v: string | number) => formatCurrency(Number(v), 'AED', 'en'),
    },
    {
      title: t('summary.totalBookings'),
      value: mockData.summary.totalBookings,
      icon: <ShoppingCart className="h-4 w-4" />,
    },
    {
      title: t('summary.completedBookings'),
      value: mockData.summary.completedBookings,
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      title: t('summary.averageBookingValue'),
      value: mockData.summary.averageBookingValue,
      icon: <DollarSign className="h-4 w-4" />,
      formatValue: (v: string | number) => formatCurrency(Number(v), 'AED', 'en'),
    },
  ];

  return (
    <div className="space-y-6">
      <SummaryCards cards={summaryCards} />
      <RevenueCharts
        byAssetType={mockData.byAssetType}
        bySource={mockData.bySource}
        byPaymentMethod={mockData.byPaymentMethod}
        daily={mockData.daily}
      />
      <CancellationReport data={mockData.cancellations} />
    </div>
  );
}
