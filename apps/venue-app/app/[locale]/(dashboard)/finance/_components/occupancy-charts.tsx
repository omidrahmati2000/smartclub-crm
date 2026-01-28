'use client';

import { useTranslations } from 'next-intl';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@smartclub/ui/card';
import {
  OccupancyByAsset,
  OccupancyByHour,
  OccupancyByDayOfWeek,
} from '@smartclub/types';

interface OccupancyChartsProps {
  byAsset: OccupancyByAsset[];
  byHour: OccupancyByHour[];
  byDayOfWeek: OccupancyByDayOfWeek[];
  locale: string;
}

const COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
};

export function OccupancyCharts({
  byAsset,
  byHour,
  byDayOfWeek,
  locale,
}: OccupancyChartsProps) {
  const t = useTranslations('venue-admin.finance.occupancy');

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Asset Occupancy Chart */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>{t('byAsset')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byAsset}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="assetName" />
              <YAxis />
              <Tooltip formatter={(value) => formatPercent(value as number)} />
              <Legend />
              <Bar
                dataKey="occupancyRate"
                fill={COLORS.primary}
                name={t('occupancyRate')}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Hourly Occupancy Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('byHour')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={byHour}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="hour"
                tickFormatter={(hour) => `${hour}:00`}
              />
              <YAxis />
              <Tooltip
                formatter={(value) => formatPercent(value as number)}
                labelFormatter={(hour) => `${t('hour')}: ${hour}:00`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="occupancyRate"
                stroke={COLORS.primary}
                strokeWidth={2}
                name={t('occupancyRate')}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Day of Week Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('byDayOfWeek')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byDayOfWeek}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dayName" />
              <YAxis />
              <Tooltip formatter={(value) => formatPercent(value as number)} />
              <Legend />
              <Bar
                dataKey="occupancyRate"
                fill={COLORS.success}
                name={t('occupancyRate')}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
