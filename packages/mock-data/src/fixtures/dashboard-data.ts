import { mockBookings } from './bookings';
import type { Booking } from '@smartclub/types';
import { BookingStatus } from '@smartclub/types';

export interface DashboardKPIs {
  todayBookings: {
    count: number;
    change: number; // Percentage change from yesterday
  };
  todayRevenue: {
    amount: number;
    change: number; // Percentage change from yesterday
  };
  occupancyRate: {
    percentage: number;
  };
  pendingBookings: {
    count: number;
  };
}

export interface DashboardData {
  kpis: DashboardKPIs;
  recentBookings: Booking[];
}

export function generateDashboardData(venueId: string): DashboardData {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  // Filter bookings for this venue
  const venueBookings = mockBookings.filter((b) => b.venueId === venueId);

  // Today's bookings
  const todayBookings = venueBookings.filter((b) => b.date === today);
  const yesterdayBookings = venueBookings.filter((b) => b.date === yesterday);

  // Calculate today's revenue
  const todayRevenue = todayBookings
    .filter((b) => b.status !== BookingStatus.CANCELLED)
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const yesterdayRevenue = yesterdayBookings
    .filter((b) => b.status !== BookingStatus.CANCELLED)
    .reduce((sum, b) => sum + b.totalPrice, 0);

  // Calculate changes
  const bookingChange =
    yesterdayBookings.length > 0
      ? ((todayBookings.length - yesterdayBookings.length) /
          yesterdayBookings.length) *
        100
      : todayBookings.length > 0
        ? 100
        : 0;

  const revenueChange =
    yesterdayRevenue > 0
      ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
      : todayRevenue > 0
        ? 100
        : 0;

  // Calculate occupancy rate (assuming 10 available slots per day)
  const totalSlots = 10;
  const bookedSlots = todayBookings.filter(
    (b) => b.status !== BookingStatus.CANCELLED,
  ).length;
  const occupancyRate = (bookedSlots / totalSlots) * 100;

  // Pending bookings
  const pendingBookings = venueBookings.filter(
    (b) => b.status === BookingStatus.PENDING,
  );

  // Recent bookings (last 5)
  const recentBookings = [...venueBookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return {
    kpis: {
      todayBookings: {
        count: todayBookings.length,
        change: Math.round(bookingChange * 10) / 10,
      },
      todayRevenue: {
        amount: todayRevenue,
        change: Math.round(revenueChange * 10) / 10,
      },
      occupancyRate: {
        percentage: Math.round(occupancyRate * 10) / 10,
      },
      pendingBookings: {
        count: pendingBookings.length,
      },
    },
    recentBookings,
  };
}
