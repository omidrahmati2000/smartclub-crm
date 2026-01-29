'use client';

import { Card } from '@smartclub/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart,
  Area,
} from 'recharts';
import type { ReportPeriod } from './period-selector';

interface PerformanceReportProps {
  period: ReportPeriod;
  locale: string;
}

// Mock data
const revenueVsBookings = [
  { month: 'فروردین', revenue: 45, bookings: 120 },
  { month: 'اردیبهشت', revenue: 52, bookings: 145 },
  { month: 'خرداد', revenue: 48, bookings: 132 },
  { month: 'تیر', revenue: 61, bookings: 168 },
  { month: 'مرداد', revenue: 55, bookings: 155 },
  { month: 'شهریور', revenue: 67, bookings: 189 },
];

const occupancyByHour = [
  { hour: '۸', rate: 25 },
  { hour: '۹', rate: 35 },
  { hour: '۱۰', rate: 55 },
  { hour: '۱۱', rate: 70 },
  { hour: '۱۲', rate: 45 },
  { hour: '۱۳', rate: 40 },
  { hour: '۱۴', rate: 50 },
  { hour: '۱۵', rate: 65 },
  { hour: '۱۶', rate: 80 },
  { hour: '۱۷', rate: 95 },
  { hour: '۱۸', rate: 90 },
  { hour: '۱۹', rate: 85 },
  { hour: '۲۰', rate: 75 },
  { hour: '۲۱', rate: 60 },
  { hour: '۲۲', rate: 40 },
];

const assetPerformance = [
  { asset: 'زمین پدل ۱', revenue: 18500000, occupancy: 78 },
  { asset: 'زمین پدل ۲', revenue: 16200000, occupancy: 72 },
  { asset: 'زمین تنیس', revenue: 12800000, occupancy: 65 },
  { asset: 'سالن VIP', revenue: 22400000, occupancy: 58 },
];

const weeklyComparison = [
  { week: 'هفته ۱', thisMonth: 42, lastMonth: 38 },
  { week: 'هفته ۲', thisMonth: 48, lastMonth: 45 },
  { week: 'هفته ۳', thisMonth: 52, lastMonth: 41 },
  { week: 'هفته ۴', thisMonth: 58, lastMonth: 48 },
];

export function PerformanceReport({ period, locale }: PerformanceReportProps) {
  const totalRevenue = 67000000;
  const avgOccupancy = 68;
  const peakHour = '۱۷:۰۰';
  const bestAsset = 'سالن VIP';

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('fa-IR').format(value / 1000000) + 'M';
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">درآمد کل</p>
          <p className="text-2xl font-bold text-green-600">
            {new Intl.NumberFormat('fa-IR').format(totalRevenue)} تومان
          </p>
          <p className="text-xs text-green-600">+۲۲٪ نسبت به ماه قبل</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">میانگین اشغال</p>
          <p className="text-2xl font-bold">{avgOccupancy}٪</p>
          <p className="text-xs text-blue-600">+۵٪ بهبود</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">ساعت پیک</p>
          <p className="text-2xl font-bold">{peakHour}</p>
          <p className="text-xs text-muted-foreground">بیشترین تقاضا</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">بهترین امکانات</p>
          <p className="text-2xl font-bold">{bestAsset}</p>
          <p className="text-xs text-muted-foreground">بیشترین درآمد</p>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue vs Bookings */}
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">درآمد و رزرو ماهانه</h3>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={revenueVsBookings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="revenue" fill="#3b82f6" name="درآمد (میلیون)" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#ef4444" name="رزرو" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        {/* Occupancy by Hour */}
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">نرخ اشغال بر اساس ساعت</h3>
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
          <h3 className="mb-4 font-semibold">عملکرد امکانات</h3>
          <div className="space-y-3">
            {assetPerformance.map((asset, index) => (
              <div key={index} className="rounded-lg border p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{asset.asset}</p>
                  <p className="text-sm text-green-600">
                    {new Intl.NumberFormat('fa-IR').format(asset.revenue)} تومان
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${asset.occupancy}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-12">
                    {asset.occupancy}% اشغال
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly Comparison */}
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">مقایسه هفتگی با ماه قبل</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="thisMonth" fill="#3b82f6" name="این ماه" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lastMonth" fill="#94a3b8" name="ماه قبل" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
