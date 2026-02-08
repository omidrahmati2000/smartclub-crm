import type { Notification } from '@smartclub/types'

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'booking_confirmed',
    title: 'New Booking Confirmed',
    message: 'Ahmed Al Sharif booked Padel Court 1 for February 8, 2026',
    data: {
      customerId: 'cust-1',
      bookingId: 'booking-1',
      assetId: 'asset-1',
    },
    isRead: false,
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(), // 10 mins ago
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    type: 'payment_received',
    title: 'Payment Received',
    message: 'Payment of AED 150 received from Sara Abdullah for membership',
    data: {
      amount: '150',
      currency: 'AED',
      customerId: 'cust-2',
    },
    isRead: false,
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(), // 25 mins ago
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    type: 'booking_reminder',
    title: 'Upcoming Booking Reminder',
    message: 'Reminder: Padel Court 2 booking in 2 hours',
    data: {
      bookingId: 'booking-3',
      assetId: 'asset-2',
    },
    isRead: false,
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(), // 45 mins ago
  },
  {
    id: 'notif-4',
    userId: 'user-1',
    type: 'booking_cancelled',
    title: 'Booking Cancelled',
    message: 'Rashid Kareem cancelled his booking for Tennis Court on February 9',
    data: {
      customerId: 'cust-3',
      bookingId: 'booking-4',
    },
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
  },
  {
    id: 'notif-5',
    userId: 'user-1',
    type: 'tournament_update',
    title: 'Tournament Update: Finals Schedule',
    message: 'Padel Masters tournament finals schedule has been updated',
    data: {
      tournamentId: 'tournament-1',
    },
    isRead: true,
    createdAt: new Date(Date.now() - 4 * 60 * 60000).toISOString(), // 4 hours ago
  },
  {
    id: 'notif-6',
    userId: 'user-1',
    type: 'system',
    title: 'System Maintenance Scheduled',
    message: 'Scheduled maintenance on February 10 from 2:00 AM to 4:00 AM',
    data: {
      maintenanceId: 'maint-1',
    },
    isRead: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60000).toISOString(), // 6 hours ago
  },
  {
    id: 'notif-7',
    userId: 'user-1',
    type: 'match_invitation',
    title: 'Match Invitation',
    message: 'Mariam Hassan invited you to a friendly padel match',
    data: {
      userId: 'user-4',
      matchId: 'match-1',
    },
    isRead: true,
    createdAt: new Date(Date.now() - 8 * 60 * 60000).toISOString(), // 8 hours ago
  },
  {
    id: 'notif-8',
    userId: 'user-1',
    type: 'achievement',
    title: 'Achievement Unlocked',
    message: 'You\'ve reached 50 bookings! Golden Member badge awarded',
    data: {
      achievementId: 'achievement-50-bookings',
    },
    isRead: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60000).toISOString(), // 1 day ago
  },
]
