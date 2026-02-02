'use client';

import { useTranslations } from 'next-intl';
import { Card } from '@smartclub/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from 'recharts';
import { formatCurrency } from '@smartclub/utils';
import type { ReportPeriod } from './period-selector';

interface PerformanceReportProps {
  period: ReportPeriod;
}

// Monthly revenue in thousands AED & booking counts
const revenueVsBookings = [
  { month: 'Aug', revenue: 18.5, bookings: 120 },
  { month: 'Sep', revenue: 21.4, bookings: 145 },
  { month: 'Oct', revenue: 19.8, bookings: 132 },
  { month: 'Nov', revenue: 25.1, bookings: 168 },
  { month: 'Dec', revenue: 22.7, bookings: 155 },
  { month: 'Jan', revenue: 27.6, bookings: 189 },
];

const occupancyByHour = [
  { hour: '8', rate: 25 },
  { hour: '9', rate: 35 },
  { hour: '10', rate: 55 },
  { hour: '11', rate: 70 },
  { hour: '12', rate: 45 },
  { hour: '13', rate: 40 },
  { hour: '14', rate: 50 },
  { hour: '15', rate: 65 },
  { hour: '16', rate: 80 },
  { hour: '17', rate: 95 },
  { hour: '18', rate: 90 },
  { hour: '19', rate: 85 },
  { hour: '20', rate: 75 },
  { hour: '21', rate: 60 },
  { hour: '22', rate: 40 },
];

const assetPerformance = [
  { asset: 'Padel Court 1', revenue: 7620, occupancy: 78 },
  { asset: 'Padel Court 2', revenue: 6670, occupancy: 72 },
  { asset: 'Tennis Court', revenue: 5270, occupancy: 65 },
  { asset: 'VIP Lounge', revenue: 9220, occupancy: 58 },
];

const weeklyComparison = [
  { week: 'Week 1', thisMonth: 42, lastMonth: 38 },
  { week: 'Week 2', thisMonth: 48, lastMonth: 45 },
  { week: 'Week 3', thisMonth: 52, lastMonth: 41 },
  { week: 'Week 4', thisMonth: 58, lastMonth: 48 },
];

export function PerformanceReport({ period }: PerformanceReportProps) {
  const t = useTranslations('venue-admin.reports');

  const totalRevenue = 27600;
  const avgOccupancy = 68;
  const peakHour = '17:00';
  const bestAsset = 'VIP Lounge';

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">{t('totalRevenue')}</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(totalRevenue, 'AED')}
          </p>
          <p className="text-xs text-green-600">{t('vsLastMonth', { percent: 22 })}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">{t('avgOccupancy')}</p>
          <p className="text-2xl font-bold">{avgOccupancy}%</p>
          <p className="text-xs text-blue-600">{t('improvement', { percent: 5 })}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">{t('peakHour')}</p>
          <p className="text-2xl font-bold">{peakHour}</p>
          <p className="text-xs text-muted-foreground">{t('highestDemand')}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">{t('bestAsset')}</p>
          <p className="text-2xl font-bold">{bestAsset}</p>
          <p className="text-xs text-muted-foreground">{t('highestRevenue')}</p>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue vs Bookings */}
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">{t('monthlyRevenueBookings')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={revenueVsBookings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name={t('revenueKAed')} radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#ef4444" name={t('bookings')} strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        {/* Occupancy by Hour */}
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">{t('occupancyByHour')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={occupancyByHour}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis unit="%" />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="rate" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Asset Performance Table */}
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">{t('assetPerformance')}</h3>
          <div className="space-y-3">
            {assetPerformance.map((asset, index) => (
              <div key={index} className="rounded-lg border p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{asset.asset}</p>
                  <p className="text-sm text-green-600">
                    {formatCurrency(asset.revenue, 'AED')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${asset.occupancy}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-20">
                    {t('occupied', { percent: asset.occupancy })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly Comparison */}
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">{t('weeklyComparison')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="thisMonth" fill="#3b82f6" name={t('thisMonth')} radius={[4, 4, 0, 0]} />
              <Bar dataKey="lastMonth" fill="#94a3b8" name={t('lastMonth')} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
