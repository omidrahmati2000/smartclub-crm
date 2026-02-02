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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { formatCurrency } from '@smartclub/utils';
import type { ReportPeriod } from './period-selector';

interface CustomersReportProps {
  period: ReportPeriod;
}

const customersByType = [
  { name: 'Regular', value: 245, color: '#3b82f6' },
  { name: 'VIP', value: 42, color: '#8b5cf6' },
  { name: 'Inactive', value: 38, color: '#94a3b8' },
  { name: 'Blocked', value: 5, color: '#ef4444' },
];

const newCustomersTrend = [
  { date: 'Aug', customers: 28 },
  { date: 'Sep', customers: 35 },
  { date: 'Oct', customers: 42 },
  { date: 'Nov', customers: 38 },
  { date: 'Dec', customers: 52 },
  { date: 'Jan', customers: 48 },
];

const topCustomers = [
  { name: 'Ahmed Al Sharif', bookings: 24, spent: 12500 },
  { name: 'Sara Abdullah', bookings: 18, spent: 9800 },
  { name: 'Rashid Kareem', bookings: 15, spent: 8200 },
  { name: 'Mariam Hassan', bookings: 12, spent: 6500 },
  { name: 'Hussein Al Rashid', bookings: 10, spent: 5400 },
];

const retentionData = [
  { month: 'Month 1', rate: 100 },
  { month: 'Month 2', rate: 72 },
  { month: 'Month 3', rate: 58 },
  { month: 'Month 4', rate: 48 },
  { month: 'Month 5', rate: 42 },
  { month: 'Month 6', rate: 38 },
];

export function CustomersReport({ period }: CustomersReportProps) {
  const t = useTranslations('venue-admin.reports');
  const totalCustomers = 330;
  const newCustomers = 48;
  const activeCustomers = 287;
  const avgBookingsPerCustomer = 3.2;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">{t('totalCustomers')}</p>
          <p className="text-2xl font-bold">{totalCustomers}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">{t('newCustomers')}</p>
          <p className="text-2xl font-bold text-green-600">{newCustomers}</p>
          <p className="text-xs text-green-600">{t('vsLastPeriod', { percent: 15 })}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">{t('activeCustomers')}</p>
          <p className="text-2xl font-bold text-blue-600">{activeCustomers}</p>
          <p className="text-xs text-muted-foreground">{Math.round((activeCustomers / totalCustomers) * 100)}%</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">{t('avgBookingsPerCustomer')}</p>
          <p className="text-2xl font-bold">{avgBookingsPerCustomer}</p>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">{t('customersByType')}</h3>
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

        <Card className="p-6">
          <h3 className="mb-4 font-semibold">{t('newCustomersTrend')}</h3>
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
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">{t('topCustomers')}</h3>
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
                      {t('bookingsCount', { count: customer.bookings })}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium text-green-600">
                  {formatCurrency(customer.spent, 'AED')}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 font-semibold">{t('retentionRate')}</h3>
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
