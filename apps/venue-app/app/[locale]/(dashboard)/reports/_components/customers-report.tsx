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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import type { ReportPeriod } from './period-selector';

interface CustomersReportProps {
  period: ReportPeriod;
  locale: string;
}

// Mock data
const customersByType = [
  { name: 'عادی', value: 245, color: '#3b82f6' },
  { name: 'VIP', value: 42, color: '#8b5cf6' },
  { name: 'غیرفعال', value: 38, color: '#94a3b8' },
  { name: 'مسدود', value: 5, color: '#ef4444' },
];

const newCustomersTrend = [
  { date: 'فروردین', customers: 28 },
  { date: 'اردیبهشت', customers: 35 },
  { date: 'خرداد', customers: 42 },
  { date: 'تیر', customers: 38 },
  { date: 'مرداد', customers: 52 },
  { date: 'شهریور', customers: 48 },
];

const topCustomers = [
  { name: 'علی احمدی', bookings: 24, spent: 12500000 },
  { name: 'مریم رضایی', bookings: 18, spent: 9800000 },
  { name: 'محمد کریمی', bookings: 15, spent: 8200000 },
  { name: 'سارا محمدی', bookings: 12, spent: 6500000 },
  { name: 'رضا نوری', bookings: 10, spent: 5400000 },
];

const retentionData = [
  { month: 'ماه ۱', rate: 100 },
  { month: 'ماه ۲', rate: 72 },
  { month: 'ماه ۳', rate: 58 },
  { month: 'ماه ۴', rate: 48 },
  { month: 'ماه ۵', rate: 42 },
  { month: 'ماه ۶', rate: 38 },
];

export function CustomersReport({ period, locale }: CustomersReportProps) {
  const totalCustomers = 330;
  const newCustomers = 48;
  const activeCustomers = 287;
  const avgBookingsPerCustomer = 3.2;

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('fa-IR').format(value) + ' تومان';
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">کل مشتریان</p>
          <p className="text-2xl font-bold">{totalCustomers}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">مشتریان جدید</p>
          <p className="text-2xl font-bold text-green-600">{newCustomers}</p>
          <p className="text-xs text-green-600">+۱۵٪ نسبت به ماه قبل</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">مشتریان فعال</p>
          <p className="text-2xl font-bold text-blue-600">{activeCustomers}</p>
          <p className="text-xs text-muted-foreground">{Math.round((activeCustomers / totalCustomers) * 100)}٪</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">میانگین رزرو/مشتری</p>
          <p className="text-2xl font-bold">{avgBookingsPerCustomer}</p>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Customers by Type */}
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">مشتریان بر اساس نوع</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={customersByType}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {customersByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* New Customers Trend */}
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">روند مشتریان جدید</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={newCustomersTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="customers"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Customers Table */}
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">برترین مشتریان</h3>
          <div className="space-y-3">
            {topCustomers.map((customer, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {customer.bookings} رزرو
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium text-green-600">
                  {formatPrice(customer.spent)}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Retention Rate */}
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">نرخ نگهداشت مشتری</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis unit="%" />
              <Tooltip formatter={(value) => `${value}%`} />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
