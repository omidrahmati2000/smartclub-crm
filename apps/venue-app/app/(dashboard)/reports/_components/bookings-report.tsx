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
  LineChart,
  Line,
} from 'recharts';
import type { ReportPeriod } from './period-selector';

interface BookingsReportProps {
  period: ReportPeriod;
}

// Mock data
const bookingsByDay = [
  { day: 'شنبه', bookings: 12 },
  { day: 'یک‌شنبه', bookings: 19 },
  { day: 'دوشنبه', bookings: 15 },
  { day: 'سه‌شنبه', bookings: 22 },
  { day: 'چهارشنبه', bookings: 18 },
  { day: 'پنج‌شنبه', bookings: 28 },
  { day: 'جمعه', bookings: 35 },
];

const bookingsByStatus = [
  { name: 'تکمیل شده', value: 156, color: '#22c55e' },
  { name: 'لغو شده', value: 23, color: '#ef4444' },
  { name: 'عدم حضور', value: 8, color: '#f97316' },
  { name: 'در انتظار', value: 12, color: '#eab308' },
];

const bookingsByAsset = [
  { asset: 'زمین پدل ۱', bookings: 45 },
  { asset: 'زمین پدل ۲', bookings: 38 },
  { asset: 'زمین تنیس', bookings: 32 },
  { asset: 'سالن VIP', bookings: 28 },
];

const dailyTrend = [
  { date: '۱', bookings: 8 },
  { date: '۲', bookings: 12 },
  { date: '۳', bookings: 10 },
  { date: '۴', bookings: 15 },
  { date: '۵', bookings: 18 },
  { date: '۶', bookings: 14 },
  { date: '۷', bookings: 22 },
  { date: '۸', bookings: 19 },
  { date: '۹', bookings: 25 },
  { date: '۱۰', bookings: 28 },
];

export function BookingsReport({ period }: BookingsReportProps) {
  const totalBookings = 199;
  const completedBookings = 156;
  const cancelledBookings = 23;
  const noShowBookings = 8;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">کل رزروها</p>
          <p className="text-2xl font-bold">{totalBookings}</p>
          <p className="text-xs text-green-600">+۱۲٪ نسبت به دوره قبل</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">تکمیل شده</p>
          <p className="text-2xl font-bold text-green-600">{completedBookings}</p>
          <p className="text-xs text-muted-foreground">{Math.round((completedBookings / totalBookings) * 100)}٪</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">لغو شده</p>
          <p className="text-2xl font-bold text-red-600">{cancelledBookings}</p>
          <p className="text-xs text-muted-foreground">{Math.round((cancelledBookings / totalBookings) * 100)}٪</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">عدم حضور</p>
          <p className="text-2xl font-bold text-orange-600">{noShowBookings}</p>
          <p className="text-xs text-muted-foreground">{Math.round((noShowBookings / totalBookings) * 100)}٪</p>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bookings by Day */}
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">رزرو بر اساس روز هفته</h3>
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

        {/* Bookings by Status */}
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">وضعیت رزروها</h3>
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
        {/* Bookings by Asset */}
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">رزرو بر اساس امکانات</h3>
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

        {/* Daily Trend */}
        <Card className="p-6">
          <h3 className="mb-4 font-semibold">روند روزانه رزروها</h3>
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
