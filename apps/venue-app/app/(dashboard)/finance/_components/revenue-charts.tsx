'use client';

import { useTranslations, useLocale } from 'next-intl';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@smartclub/ui/card';
import { formatCurrency } from '@smartclub/utils';
import { format } from 'date-fns-jalali';
import {
  RevenueByAssetType,
  RevenueBySource,
  RevenueByPaymentMethod,
  DailyRevenue,
} from '@smartclub/types';

interface RevenueChartsProps {
  byAssetType: RevenueByAssetType[];
  bySource: RevenueBySource[];
  byPaymentMethod: RevenueByPaymentMethod[];
  daily: DailyRevenue[];
}

const COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  cyan: '#06b6d4',
  pink: '#ec4899',
  indigo: '#6366f1',
};

const COLOR_ARRAY = [
  COLORS.primary,
  COLORS.success,
  COLORS.warning,
  COLORS.purple,
  COLORS.cyan,
  COLORS.pink,
  COLORS.indigo,
  COLORS.danger,
];

export function RevenueCharts({
  byAssetType,
  bySource,
  byPaymentMethod,
  daily,
}: RevenueChartsProps) {
  const t = useTranslations('venue-admin.finance');
  const locale = useLocale();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return locale === 'fa' ? format(date, 'd MMM') : format(date, 'MMM d');
  };

  const formatTooltipValue = (value: number | undefined) => {
    if (value === undefined) return '';
    return formatCurrency(value, 'AED', 'en');
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Asset Type Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('revenue.byAssetType')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={byAssetType}
                dataKey="revenue"
                nameKey="assetTypeName"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(entry) => `${entry.percent}%`}
              >
                {byAssetType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLOR_ARRAY[index % COLOR_ARRAY.length]} />
                ))}
              </Pie>
              <Tooltip formatter={formatTooltipValue} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Source Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('revenue.bySource')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bySource}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sourceName" />
              <YAxis />
              <Tooltip formatter={formatTooltipValue} />
              <Legend />
              <Bar dataKey="revenue" fill={COLORS.primary} name={t('revenue.revenue')} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Payment Method Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('revenue.byPaymentMethod')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={byPaymentMethod}
                dataKey="revenue"
                nameKey="methodName"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(entry) => `${entry.percent}%`}
              >
                {byPaymentMethod.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLOR_ARRAY[index % COLOR_ARRAY.length]} />
                ))}
              </Pie>
              <Tooltip formatter={formatTooltipValue} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Daily Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('revenue.dailyTrend')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={daily}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis />
              <Tooltip
                formatter={formatTooltipValue}
                labelFormatter={(label) => formatDate(label as string)}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={COLORS.primary}
                strokeWidth={2}
                name={t('revenue.revenue')}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
