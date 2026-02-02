import type { Booking } from '@smartclub/types';
import { BookingStatus, BookingType, PaymentMethod, PaymentStatus } from '@smartclub/types';

/**
 * Pricing Reference (base prices)
 * ================================
 * Asset 1 — Padel Court 1 (venue-1): 120 AED / 90-min slot
 * Asset 2 — PS5 Station 1 (venue-2):  80 AED / hour
 * Asset 3 — Swimming Session (venue-3): 35 AED / session
 * Asset 4 — Billiard Table 1 (venue-2): 60 AED / hour
 *
 * Pricing Rules (venue-1, all active):
 *   pricing-1: Peak Hours +25%       Wed–Fri 17:00–22:00
 *   pricing-2: Weekday Morning -15%  Sun–Wed 08:00–12:00
 *   pricing-3: Friday Premium +30%   Fridays (all day)
 *   pricing-5: Last Minute -25%      booked <2h before
 *   pricing-6: Early Bird -10%       booked 7+ days before
 *
 * Tax: 5% UAE VAT
 * Platform Service Fee: 10%
 *
 * Formula: total = (subtotal - discount) × 1.05 × 1.10
 *  ... simplified as: taxableAmt + tax + fee
 *  ... where taxableAmt = subtotal - discount
 *
 * Customers (from customers.ts):
 *   1 Ahmed Al Sharif    2 Sara Abdullah     3 Rashid Kareem
 *   4 Mariam Hassan      5 Hussein Al Rashid 6 Fatima Al Nouri
 *   7 Omar Sadiq
 */

// ── Helper: date strings relative to today ──────────────────────
const today = new Date();
const day = (offset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
};
const iso = (offset: number, hoursAgo = 0) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  d.setHours(d.getHours() - hoursAgo);
  return d.toISOString();
};

export const mockBookings: Booking[] = [
  // ═══════════════════════════════════════════════════════════════
  //  TODAY — 5 bookings across all 3 venues & 4 assets
  // ═══════════════════════════════════════════════════════════════

  // 1. Padel Court, 09:00 morning, regular price
  //    subtotal=120, tax=6, fee=12 → total=138
  {
    id: 'booking-1',
    venueId: 'venue-1',
    assetId: 'asset-1',
    userId: 'user-customer-1',
    customerId: 'user-customer-1',
    date: day(0),
    startTime: '09:00',
    endTime: '10:30',
    duration: 90,
    status: BookingStatus.CONFIRMED,
    bookingType: BookingType.SLOT_BASED,
    subtotal: 120,
    taxRate: 5,
    taxAmount: 6,
    serviceFee: 12,
    totalPrice: 138,
    currency: 'AED',
    participants: [
      { userId: 'user-customer-1', name: 'Ahmed Al Sharif', isHost: true, paymentStatus: PaymentStatus.COMPLETED },
      { userId: 'user-customer-5', name: 'Hussein Al Rashid', isHost: false, paymentAmount: 34.5, paymentStatus: PaymentStatus.COMPLETED },
    ],
    paymentMethod: PaymentMethod.ONLINE,
    paymentStatus: PaymentStatus.COMPLETED,
    createdAt: iso(0, 2),
    updatedAt: iso(0, 2),
  },

  // 2. Padel Court, 11:00 checked-in
  //    subtotal=120, tax=6, fee=12 → total=138
  {
    id: 'booking-2',
    venueId: 'venue-1',
    assetId: 'asset-1',
    userId: 'user-customer-6',
    customerId: 'user-customer-6',
    date: day(0),
    startTime: '11:00',
    endTime: '12:30',
    duration: 90,
    status: BookingStatus.CHECKED_IN,
    bookingType: BookingType.SLOT_BASED,
    subtotal: 120,
    taxRate: 5,
    taxAmount: 6,
    serviceFee: 12,
    totalPrice: 138,
    currency: 'AED',
    participants: [
      { userId: 'user-customer-6', name: 'Fatima Al Nouri', isHost: true, paymentStatus: PaymentStatus.COMPLETED },
    ],
    paymentMethod: PaymentMethod.ONLINE,
    paymentStatus: PaymentStatus.COMPLETED,
    createdAt: iso(0, 6),
    updatedAt: iso(0, 1),
  },

  // 3. Padel Court, 14:00 pending
  //    subtotal=120, tax=6, fee=12 → total=138
  {
    id: 'booking-3',
    venueId: 'venue-1',
    assetId: 'asset-1',
    userId: 'user-customer-2',
    customerId: 'user-customer-2',
    date: day(0),
    startTime: '14:00',
    endTime: '15:30',
    duration: 90,
    status: BookingStatus.PENDING,
    bookingType: BookingType.SLOT_BASED,
    subtotal: 120,
    taxRate: 5,
    taxAmount: 6,
    serviceFee: 12,
    totalPrice: 138,
    currency: 'AED',
    participants: [
      { userId: 'user-customer-2', name: 'Sara Abdullah', isHost: true, paymentStatus: PaymentStatus.PENDING },
    ],
    paymentMethod: PaymentMethod.WALLET,
    paymentStatus: PaymentStatus.PENDING,
    createdAt: iso(0, 0.5),
    updatedAt: iso(0, 0.5),
  },

  // 4. PS5 Station, 2 hours, duration-based
  //    subtotal=160 (80×2h), tax=8, fee=16 → total=184
  {
    id: 'booking-4',
    venueId: 'venue-2',
    assetId: 'asset-2',
    userId: 'user-customer-3',
    customerId: 'user-customer-3',
    date: day(0),
    startTime: '16:00',
    endTime: '18:00',
    duration: 120,
    status: BookingStatus.CONFIRMED,
    bookingType: BookingType.DURATION_BASED,
    subtotal: 160,
    taxRate: 5,
    taxAmount: 8,
    serviceFee: 16,
    totalPrice: 184,
    currency: 'AED',
    participants: [
      { userId: 'user-customer-3', name: 'Rashid Kareem', isHost: true, paymentStatus: PaymentStatus.COMPLETED },
    ],
    paymentMethod: PaymentMethod.CASH,
    paymentStatus: PaymentStatus.COMPLETED,
    createdAt: iso(0, 4),
    updatedAt: iso(0, 4),
  },

  // 5. Swimming Session, capacity-based
  //    subtotal=35, tax=1.75, fee=3.50 → total=40.25
  {
    id: 'booking-5',
    venueId: 'venue-3',
    assetId: 'asset-3',
    userId: 'user-customer-7',
    customerId: 'user-customer-7',
    date: day(0),
    startTime: '07:00',
    endTime: '08:00',
    duration: 60,
    status: BookingStatus.CONFIRMED,
    bookingType: BookingType.CAPACITY_BASED,
    subtotal: 35,
    taxRate: 5,
    taxAmount: 1.75,
    serviceFee: 3.5,
    totalPrice: 40.25,
    currency: 'AED',
    participants: [
      { userId: 'user-customer-7', name: 'Omar Sadiq', isHost: true, paymentStatus: PaymentStatus.COMPLETED },
    ],
    paymentMethod: PaymentMethod.ONLINE,
    paymentStatus: PaymentStatus.COMPLETED,
    createdAt: iso(-1, 0),
    updatedAt: iso(-1, 0),
  },

  // ═══════════════════════════════════════════════════════════════
  //  YESTERDAY — 3 bookings: completed + cancelled
  // ═══════════════════════════════════════════════════════════════

  // 6. Padel Court, yesterday morning, Early Bird -10%
  //    base=120, discount=12 → taxable=108, tax=5.40, fee=10.80 → total=124.20
  {
    id: 'booking-6',
    venueId: 'venue-1',
    assetId: 'asset-1',
    userId: 'user-customer-4',
    customerId: 'user-customer-4',
    date: day(-1),
    startTime: '10:00',
    endTime: '11:30',
    duration: 90,
    status: BookingStatus.COMPLETED,
    bookingType: BookingType.SLOT_BASED,
    subtotal: 120,
    discount: 12,
    discountLabel: 'Early Bird -10%',
    taxRate: 5,
    taxAmount: 5.4,
    serviceFee: 10.8,
    totalPrice: 124.2,
    currency: 'AED',
    participants: [
      { userId: 'user-customer-4', name: 'Mariam Hassan', isHost: true, paymentStatus: PaymentStatus.COMPLETED },
    ],
    paymentMethod: PaymentMethod.ONLINE,
    paymentStatus: PaymentStatus.COMPLETED,
    createdAt: iso(-8, 0),
    updatedAt: iso(-1, 0),
  },

  // 7. Padel Court, yesterday peak 18:00 (+25%)
  //    subtotal=150 (120+25%), tax=7.50, fee=15 → total=172.50
  {
    id: 'booking-7',
    venueId: 'venue-1',
    assetId: 'asset-1',
    userId: 'user-customer-5',
    customerId: 'user-customer-5',
    date: day(-1),
    startTime: '18:00',
    endTime: '19:30',
    duration: 90,
    status: BookingStatus.COMPLETED,
    bookingType: BookingType.SLOT_BASED,
    subtotal: 150,
    taxRate: 5,
    taxAmount: 7.5,
    serviceFee: 15,
    totalPrice: 172.5,
    currency: 'AED',
    participants: [
      { userId: 'user-customer-5', name: 'Hussein Al Rashid', isHost: true, paymentStatus: PaymentStatus.COMPLETED },
      { userId: 'user-customer-1', name: 'Ahmed Al Sharif', isHost: false, paymentAmount: 43.13, paymentStatus: PaymentStatus.COMPLETED },
    ],
    paymentMethod: PaymentMethod.CARD_ON_SITE,
    paymentStatus: PaymentStatus.COMPLETED,
    createdAt: iso(-2, 0),
    updatedAt: iso(-1, 0),
  },

  // 8. Billiard Table, yesterday — CANCELLED by customer
  //    subtotal=90 (60×1.5h), tax=4.50, fee=9 → total=103.50 (refunded)
  {
    id: 'booking-8',
    venueId: 'venue-2',
    assetId: 'asset-4',
    userId: 'user-customer-3',
    customerId: 'user-customer-3',
    date: day(-1),
    startTime: '15:00',
    endTime: '16:30',
    duration: 90,
    status: BookingStatus.CANCELLED,
    bookingType: BookingType.DURATION_BASED,
    subtotal: 90,
    taxRate: 5,
    taxAmount: 4.5,
    serviceFee: 9,
    totalPrice: 103.5,
    currency: 'AED',
    notes: 'Customer requested cancellation — schedule conflict',
    participants: [
      { userId: 'user-customer-3', name: 'Rashid Kareem', isHost: true, paymentStatus: PaymentStatus.REFUNDED },
    ],
    paymentMethod: PaymentMethod.ONLINE,
    paymentStatus: PaymentStatus.REFUNDED,
    createdAt: iso(-3, 0),
    updatedAt: iso(-1, 2),
  },

  // ═══════════════════════════════════════════════════════════════
  //  2 DAYS AGO — Weekday Morning Discount scenario (-15%)
  // ═══════════════════════════════════════════════════════════════

  // 9. Padel Court, 09:00 weekday morning → -15%
  //    base=120, morning disc=18 → subtotal=102, tax=5.10, fee=10.20 → total=117.30
  {
    id: 'booking-9',
    venueId: 'venue-1',
    assetId: 'asset-1',
    userId: 'user-customer-2',
    customerId: 'user-customer-2',
    date: day(-2),
    startTime: '09:00',
    endTime: '10:30',
    duration: 90,
    status: BookingStatus.COMPLETED,
    bookingType: BookingType.SLOT_BASED,
    subtotal: 102,
    discount: 18,
    discountLabel: 'Weekday Morning -15%',
    taxRate: 5,
    taxAmount: 4.2,
    serviceFee: 8.4,
    totalPrice: 96.6,
    currency: 'AED',
    participants: [
      { userId: 'user-customer-2', name: 'Sara Abdullah', isHost: true, paymentStatus: PaymentStatus.COMPLETED },
      { userId: 'user-customer-6', name: 'Fatima Al Nouri', isHost: false, paymentAmount: 24.15, paymentStatus: PaymentStatus.COMPLETED },
      { userId: 'user-customer-1', name: 'Ahmed Al Sharif', isHost: false, paymentAmount: 24.15, paymentStatus: PaymentStatus.COMPLETED },
    ],
    paymentMethod: PaymentMethod.WALLET,
    paymentStatus: PaymentStatus.COMPLETED,
    createdAt: iso(-3, 0),
    updatedAt: iso(-2, 0),
  },

  // ═══════════════════════════════════════════════════════════════
  //  3 DAYS AGO — Last Minute Discount scenario (-25%)
  // ═══════════════════════════════════════════════════════════════

  // 10. Billiard Table, last-minute booking → -25%
  //     base=90 (60×1.5h), disc=22.50, taxable=67.50, tax=3.38, fee=6.75 → total=77.63
  {
    id: 'booking-10',
    venueId: 'venue-2',
    assetId: 'asset-4',
    userId: 'user-customer-7',
    customerId: 'user-customer-7',
    date: day(-3),
    startTime: '14:00',
    endTime: '15:30',
    duration: 90,
    status: BookingStatus.COMPLETED,
    bookingType: BookingType.DURATION_BASED,
    subtotal: 90,
    discount: 22.5,
    discountLabel: 'Last Minute -25%',
    taxRate: 5,
    taxAmount: 3.38,
    serviceFee: 6.75,
    totalPrice: 77.63,
    currency: 'AED',
    participants: [
      { userId: 'user-customer-7', name: 'Omar Sadiq', isHost: true, paymentStatus: PaymentStatus.COMPLETED },
    ],
    paymentMethod: PaymentMethod.WALLET,
    paymentStatus: PaymentStatus.COMPLETED,
    createdAt: iso(-3, 1),
    updatedAt: iso(-3, 0),
  },

  // ═══════════════════════════════════════════════════════════════
  //  4 DAYS AGO (assumed Friday) — Friday Premium +30%
  // ═══════════════════════════════════════════════════════════════

  // 11. Padel Court, Friday premium pricing
  //     base=120, +30%=156, tax=7.80, fee=15.60 → total=179.40
  {
    id: 'booking-11',
    venueId: 'venue-1',
    assetId: 'asset-1',
    userId: 'user-customer-1',
    customerId: 'user-customer-1',
    date: day(-4),
    startTime: '10:00',
    endTime: '11:30',
    duration: 90,
    status: BookingStatus.COMPLETED,
    bookingType: BookingType.SLOT_BASED,
    subtotal: 156,
    taxRate: 5,
    taxAmount: 7.8,
    serviceFee: 15.6,
    totalPrice: 179.4,
    currency: 'AED',
    participants: [
      { userId: 'user-customer-1', name: 'Ahmed Al Sharif', isHost: true, paymentStatus: PaymentStatus.COMPLETED },
      { userId: 'user-customer-5', name: 'Hussein Al Rashid', isHost: false, paymentAmount: 44.85, paymentStatus: PaymentStatus.COMPLETED },
      { userId: 'user-customer-6', name: 'Fatima Al Nouri', isHost: false, paymentAmount: 44.85, paymentStatus: PaymentStatus.COMPLETED },
      { userId: 'user-customer-2', name: 'Sara Abdullah', isHost: false, paymentAmount: 44.85, paymentStatus: PaymentStatus.COMPLETED },
    ],
    paymentMethod: PaymentMethod.ONLINE,
    paymentStatus: PaymentStatus.COMPLETED,
    createdAt: iso(-6, 0),
    updatedAt: iso(-4, 0),
  },

  // 12. Swimming Session, Friday
  //     subtotal=35, tax=1.75, fee=3.50 → total=40.25
  {
    id: 'booking-12',
    venueId: 'venue-3',
    assetId: 'asset-3',
    userId: 'user-customer-4',
    customerId: 'user-customer-4',
    date: day(-4),
    startTime: '07:00',
    endTime: '08:00',
    duration: 60,
    status: BookingStatus.COMPLETED,
    bookingType: BookingType.CAPACITY_BASED,
    subtotal: 35,
    taxRate: 5,
    taxAmount: 1.75,
    serviceFee: 3.5,
    totalPrice: 40.25,
    currency: 'AED',
    participants: [
      { userId: 'user-customer-4', name: 'Mariam Hassan', isHost: true, paymentStatus: PaymentStatus.COMPLETED },
    ],
    paymentMethod: PaymentMethod.CASH,
    paymentStatus: PaymentStatus.COMPLETED,
    createdAt: iso(-5, 0),
    updatedAt: iso(-4, 0),
  },

  // ═══════════════════════════════════════════════════════════════
  //  5 DAYS AGO — Peak Hours + normal
  // ═══════════════════════════════════════════════════════════════

  // 13. PS5 Station, 3 hours evening
  //     subtotal=240 (80×3h), tax=12, fee=24 → total=276
  {
    id: 'booking-13',
    venueId: 'venue-2',
    assetId: 'asset-2',
    userId: 'user-customer-5',
    customerId: 'user-customer-5',
    date: day(-5),
    startTime: '18:00',
    endTime: '21:00',
    duration: 180,
    status: BookingStatus.COMPLETED,
    bookingType: BookingType.DURATION_BASED,
    subtotal: 240,
    taxRate: 5,
    taxAmount: 12,
    serviceFee: 24,
    totalPrice: 276,
    currency: 'AED',
    participants: [
      { userId: 'user-customer-5', name: 'Hussein Al Rashid', isHost: true, paymentStatus: PaymentStatus.COMPLETED },
    ],
    paymentMethod: PaymentMethod.CARD_ON_SITE,
    paymentStatus: PaymentStatus.COMPLETED,
    createdAt: iso(-6, 0),
    updatedAt: iso(-5, 0),
  },

  // ═══════════════════════════════════════════════════════════════
  //  6 DAYS AGO — NO-SHOW scenario
  // ═══════════════════════════════════════════════════════════════

  // 14. Padel Court — customer didn't show up (Mariam — problematic)
  //     subtotal=120, tax=6, fee=12 → total=138 (charged, no refund)
  {
    id: 'booking-14',
    venueId: 'venue-1',
    assetId: 'asset-1',
    userId: 'user-customer-4',
    customerId: 'user-customer-4',
    date: day(-6),
    startTime: '14:00',
    endTime: '15:30',
    duration: 90,
    status: BookingStatus.NO_SHOW,
    bookingType: BookingType.SLOT_BASED,
    subtotal: 120,
    taxRate: 5,
    taxAmount: 6,
    serviceFee: 12,
    totalPrice: 138,
    currency: 'AED',
    notes: 'No-show — second occurrence for this customer',
    participants: [
      { userId: 'user-customer-4', name: 'Mariam Hassan', isHost: true, paymentStatus: PaymentStatus.COMPLETED },
    ],
    paymentMethod: PaymentMethod.ONLINE,
    paymentStatus: PaymentStatus.COMPLETED,
    createdAt: iso(-7, 0),
    updatedAt: iso(-6, 0),
  },

  // ═══════════════════════════════════════════════════════════════
  //  TOMORROW — Future bookings
  // ═══════════════════════════════════════════════════════════════

  // 15. Padel Court, tomorrow morning — confirmed
  //     subtotal=120, tax=6, fee=12 → total=138
  {
    id: 'booking-15',
    venueId: 'venue-1',
    assetId: 'asset-1',
    userId: 'user-customer-2',
    customerId: 'user-customer-2',
    date: day(1),
    startTime: '09:00',
    endTime: '10:30',
    duration: 90,
    status: BookingStatus.CONFIRMED,
    bookingType: BookingType.SLOT_BASED,
    subtotal: 120,
    taxRate: 5,
    taxAmount: 6,
    serviceFee: 12,
    totalPrice: 138,
    currency: 'AED',
    participants: [
      { userId: 'user-customer-2', name: 'Sara Abdullah', isHost: true, paymentStatus: PaymentStatus.COMPLETED },
      { userId: 'user-customer-1', name: 'Ahmed Al Sharif', isHost: false, paymentAmount: 34.5, paymentStatus: PaymentStatus.COMPLETED },
    ],
    paymentMethod: PaymentMethod.ONLINE,
    paymentStatus: PaymentStatus.COMPLETED,
    createdAt: iso(0, 1),
    updatedAt: iso(0, 1),
  },

  // 16. Swimming Session, tomorrow — pending payment
  //     subtotal=35, tax=1.75, fee=3.50 → total=40.25
  {
    id: 'booking-16',
    venueId: 'venue-3',
    assetId: 'asset-3',
    userId: 'user-customer-6',
    customerId: 'user-customer-6',
    date: day(1),
    startTime: '07:00',
    endTime: '08:00',
    duration: 60,
    status: BookingStatus.PENDING,
    bookingType: BookingType.CAPACITY_BASED,
    subtotal: 35,
    taxRate: 5,
    taxAmount: 1.75,
    serviceFee: 3.5,
    totalPrice: 40.25,
    currency: 'AED',
    participants: [
      { userId: 'user-customer-6', name: 'Fatima Al Nouri', isHost: true, paymentStatus: PaymentStatus.PENDING },
    ],
    paymentMethod: PaymentMethod.WALLET,
    paymentStatus: PaymentStatus.PENDING,
    createdAt: iso(0, 0.5),
    updatedAt: iso(0, 0.5),
  },
];
