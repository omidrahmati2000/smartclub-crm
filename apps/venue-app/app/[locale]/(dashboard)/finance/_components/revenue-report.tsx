'use client';

import { useTranslations } from 'next-intl';
import { ReportPeriod, BookingSource } from '@smartclub/types';
import { SummaryCards } from './summary-cards';
import { RevenueCharts } from './revenue-charts';
import { CancellationReport } from './cancellation-report';
import { DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@smartclub/utils';

interface RevenueReportProps {
  period: ReportPeriod;
  locale: string;
}

export function RevenueReport({ period, locale }: RevenueReportProps) {
  const t = useTranslations('venue-admin.finance');

  // TODO: Replace with actual API call
  // Mock data for demonstration
  const mockData = {
    summary: {
      totalRevenue: 125000000,
      totalBookings: 245,
      averageBookingValue: 510204,
      growthPercentage: 12.5,
      completedBookings: 220,
      cancelledBookings: 25,
      currency: 'IRR',
    },
    byAssetType: [
      { assetType: 'PADEL', assetTypeName: 'پادل', revenue: 50000000, bookings: 100, percentage: 40, averageValue: 500000 },
      { assetType: 'TENNIS', assetTypeName: 'تنیس', revenue: 37500000, bookings: 75, percentage: 30, averageValue: 500000 },
      { assetType: 'POOL', assetTypeName: 'استخر', revenue: 25000000, bookings: 50, percentage: 20, averageValue: 500000 },
      { assetType: 'BILLIARDS', assetTypeName: 'بیلیارد', revenue: 12500000, bookings: 20, percentage: 10, averageValue: 625000 },
    ],
    bySource: [
      { source: BookingSource.ONLINE, sourceName: 'آنلاین', revenue: 75000000, bookings: 150, percentage: 60 },
      { source: BookingSource.WALK_IN, sourceName: 'حضوری', revenue: 37500000, bookings: 75, percentage: 30 },
      { source: BookingSource.PHONE, sourceName: 'تلفنی', revenue: 12500000, bookings: 20, percentage: 10 },
    ],
    byPaymentMethod: [
      { method: 'CARD', methodName: 'کارت بانکی', revenue: 62500000, bookings: 125, percentage: 50 },
      { method: 'WALLET', methodName: 'کیف پول', revenue: 50000000, bookings: 100, percentage: 40 },
      { method: 'CASH', methodName: 'نقدی', revenue: 12500000, bookings: 20, percentage: 10 },
    ],
    daily: [
      { date: '2026-01-22', revenue: 15000000, bookings: 30, completedBookings: 28, cancelledBookings: 2 },
      { date: '2026-01-23', revenue: 18000000, bookings: 36, completedBookings: 34, cancelledBookings: 2 },
      { date: '2026-01-24', revenue: 17000000, bookings: 34, completedBookings: 31, cancelledBookings: 3 },
      { date: '2026-01-25', revenue: 16000000, bookings: 32, completedBookings: 30, cancelledBookings: 2 },
      { date: '2026-01-26', revenue: 20000000, bookings: 40, completedBookings: 38, cancelledBookings: 2 },
      { date: '2026-01-27', revenue: 19000000, bookings: 38, completedBookings: 35, cancelledBookings: 3 },
      { date: '2026-01-28', revenue: 20000000, bookings: 35, completedBookings: 24, cancelledBookings: 11 },
    ],
    cancellations: {
      totalCancellations: 25,
      cancellationRate: 10.2,
      totalRefunds: 10000000,
      lostRevenue: 12500000,
      cancellationsByReason: [
        { reason: 'بیماری', count: 10, percentage: 40 },
        { reason: 'تغییر برنامه', count: 8, percentage: 32 },
        { reason: 'شرایط آب و هوا', count: 5, percentage: 20 },
        { reason: 'سایر', count: 2, percentage: 8 },
      ],
    },
  };

  const summaryCards = [
    {
      title: t('summary.totalRevenue'),
      value: mockData.summary.totalRevenue,
      trend: mockData.summary.growthPercentage,
      icon: <DollarSign className="h-4 w-4" />,
      formatValue: (v: string | number) => formatCurrency(Number(v), locale),
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
      formatValue: (v: string | number) => formatCurrency(Number(v), locale),
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
        locale={locale}
      />
      <CancellationReport data={mockData.cancellations} locale={locale} />
    </div>
  );
}
