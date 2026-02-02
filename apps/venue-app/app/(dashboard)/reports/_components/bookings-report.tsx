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
  LineChart,
  Line,
} from 'recharts';
import type { ReportPeriod } from './period-selector';

interface BookingsReportProps {
  period: ReportPeriod;
}

const bookingsByDay = [
  { day: 'Sat', bookings: 12 },
  { day: 'Sun', bookings: 19 },
  { day: 'Mon', bookings: 15 },
  { day: 'Tue', bookings: 22 },
  { day: 'Wed', bookings: 18 },
  { day: 'Thu', bookings: 28 },
  { day: 'Fri', bookings: 35 },
];

const bookingsByStatus = [
  { name: 'Completed', value: 156, color: '#22c55e' },
  { name: 'Cancelled', value: 23, color: '#ef4444' },
  { name: 'No Show', value: 8, color: '#f97316' },
  { name: 'Pending', value: 12, color: '#eab308' },
];

const bookingsByAsset = [
  { asset: 'Padel Court 1', bookings: 45 },
  { asset: 'Padel Court 2', bookings: 38 },
  { asset: 'Tennis Court', bookings: 32 },
  { asset: 'VIP Lounge', bookings: 28 },
];

const dailyTrend = [
  { date: '1', bookings: 8 },
  { date: '2', bookings: 12 },
  { date: '3', bookings: 10 },
  { date: '4', bookings: 15 },
  { date: '5', bookings: 18 },
  { date: '6', bookings: 14 },
  { date: '7', bookings: 22 },
  { date: '8', bookings: 19 },
  { date: '9', bookings: 25 },
  { date: '10', bookings: 28 },
];

export function BookingsReport({ period }: BookingsReportProps) {
  const t = useTranslations('venue-admin.reports');
  const totalBookings = 199;
  const completedBookings = 156;
  const cancelledBookings = 23;
  const noShowBookings = 8;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">{t('totalBookings')}</p>
          <p className="text-2xl font-bold">{totalBookings}</p>
          <p className="text-xs text-green-600">{t('vsLastPeriod', { percent: 12 })}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">{t('completed')}</p>
          <p className="text-2xl font-bold text-green-600">{completedBookings}</p>
          <p className="text-xs text-muted-foreground">{Math.round((completedBookings / totalBookings) * 100)}%</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">{t('cancelled')}</p>
          <p className="text-2xl font-bold text-red-600">{cancelledBookings}</p>
          <p className="text-xs text-muted-foreground">{Math.round((cancelledBookings / totalBookings) * 100)}%</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">{t('noShow')}</p>
          <p className="text-2xl font-bold text-orange-600">{noShowBookings}</p>
          <p className="text-xs text-muted-foreground">{Math.round((noShowBookings / totalBookings) * 100)}%</p>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">{t('bookingsByDay')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={bookingsByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 font-semibold">{t('bookingStatus')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={bookingsByStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {bookingsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">{t('bookingsByAsset')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={bookingsByAsset} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="asset" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 font-semibold">{t('dailyTrend')}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
