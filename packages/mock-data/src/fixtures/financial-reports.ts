import {
  RevenueReport,
  OccupancyReport,
  ReportPeriod,
  BookingSource,
} from '@smartclub/types';

/**
 * Revenue calculation basis (AED):
 * - Padel Court:   120 AED/slot  (avg with peak: ~135 AED)
 * - Tennis Court:   100 AED/slot  (avg with peak: ~112 AED)
 * - PS5 Station:    80 AED/hour  (avg session 1.5h = 120 AED)
 * - Billiards:      60 AED/hour  (avg session 1.5h = 90 AED)
 * - Swimming:       35 AED/session
 *
 * Average booking value across all assets: ~105 AED
 * Daily bookings: 8-22 (weekdays low, weekends high)
 * Daily revenue range: ~840 - 2,310 AED
 */

// Helper to generate daily revenue for a period
function generateDailyRevenue(days: number) {
  const daily = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const dayOfWeek = date.getDay();
    // Thu/Fri (weekend in UAE) have more bookings
    const isWeekend = dayOfWeek === 4 || dayOfWeek === 5;
    const minBookings = isWeekend ? 14 : 8;
    const maxBookings = isWeekend ? 22 : 16;

    const bookings = Math.floor(Math.random() * (maxBookings - minBookings + 1)) + minBookings;
    // Average booking value ~105 AED, with some variance
    const avgValue = 95 + Math.random() * 20; // 95-115 AED
    const revenue = bookings * avgValue;

    daily.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.round(revenue * 100) / 100,
      bookings,
      completedBookings: Math.floor(bookings * 0.9),
      cancelledBookings: Math.floor(bookings * 0.1),
    });
  }

  return daily;
}

// Generate revenue report for venue
export function generateRevenueReport(
  venueId: string,
  period: ReportPeriod = ReportPeriod.LAST_30_DAYS
): RevenueReport {
  const daily = generateDailyRevenue(30);

  const totalRevenue = daily.reduce((sum, d) => sum + d.revenue, 0);
  const totalBookings = daily.reduce((sum, d) => sum + d.bookings, 0);
  const completedBookings = daily.reduce((sum, d) => sum + d.completedBookings, 0);
  const cancelledBookings = daily.reduce((sum, d) => sum + d.cancelledBookings, 0);

  const averageBookingValue = Math.round((totalRevenue / totalBookings) * 100) / 100;

  return {
    venueId,
    period,
    startDate: daily[0].date,
    endDate: daily[daily.length - 1].date,
    summary: {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalBookings,
      completedBookings,
      cancelledBookings,
      averageBookingValue,
      currency: 'AED',
      growthPercentage: Math.round((Math.random() * 20 - 5) * 100) / 100, // -5% to +15%
    },
    byAssetType: [
      {
        assetType: 'PADEL',
        assetTypeName: 'Padel',
        revenue: Math.round(totalRevenue * 0.45 * 100) / 100,
        bookings: Math.floor(totalBookings * 0.4),
        percentage: 45,
        averageValue: 135, // 120 AED base + peak hours avg
      },
      {
        assetType: 'TENNIS',
        assetTypeName: 'Tennis',
        revenue: Math.round(totalRevenue * 0.25 * 100) / 100,
        bookings: Math.floor(totalBookings * 0.25),
        percentage: 25,
        averageValue: 112, // 100 AED base + peak hours avg
      },
      {
        assetType: 'PS5',
        assetTypeName: 'PlayStation 5',
        revenue: Math.round(totalRevenue * 0.18 * 100) / 100,
        bookings: Math.floor(totalBookings * 0.2),
        percentage: 18,
        averageValue: 120, // 80/hr × 1.5h avg session
      },
      {
        assetType: 'BILLIARDS',
        assetTypeName: 'Billiards',
        revenue: Math.round(totalRevenue * 0.12 * 100) / 100,
        bookings: Math.floor(totalBookings * 0.15),
        percentage: 12,
        averageValue: 90, // 60/hr × 1.5h avg session
      },
    ],
    bySource: [
      {
        source: BookingSource.ONLINE,
        sourceName: 'Online Booking',
        revenue: Math.round(totalRevenue * 0.65 * 100) / 100,
        bookings: Math.floor(totalBookings * 0.70),
        percentage: 65,
      },
      {
        source: BookingSource.WALK_IN,
        sourceName: 'Walk-in',
        revenue: Math.round(totalRevenue * 0.25 * 100) / 100,
        bookings: Math.floor(totalBookings * 0.20),
        percentage: 25,
      },
      {
        source: BookingSource.PHONE,
        sourceName: 'Phone',
        revenue: Math.round(totalRevenue * 0.10 * 100) / 100,
        bookings: Math.floor(totalBookings * 0.10),
        percentage: 10,
      },
    ],
    byPaymentMethod: [
      {
        method: 'ONLINE',
        methodName: 'Online Payment',
        revenue: Math.round(totalRevenue * 0.45 * 100) / 100,
        bookings: Math.floor(totalBookings * 0.45),
        percentage: 45,
      },
      {
        method: 'CARD_ON_SITE',
        methodName: 'Card on Site',
        revenue: Math.round(totalRevenue * 0.25 * 100) / 100,
        bookings: Math.floor(totalBookings * 0.25),
        percentage: 25,
      },
      {
        method: 'WALLET',
        methodName: 'Wallet',
        revenue: Math.round(totalRevenue * 0.15 * 100) / 100,
        bookings: Math.floor(totalBookings * 0.15),
        percentage: 15,
      },
      {
        method: 'CASH',
        methodName: 'Cash',
        revenue: Math.round(totalRevenue * 0.15 * 100) / 100,
        bookings: Math.floor(totalBookings * 0.15),
        percentage: 15,
      },
    ],
    daily,
    cancellations: {
      totalCancellations: cancelledBookings,
      cancellationRate: Math.round((cancelledBookings / totalBookings) * 10000) / 100,
      totalRefunds: Math.round(totalRevenue * 0.08 * 100) / 100,
      lostRevenue: Math.round(totalRevenue * 0.12 * 100) / 100,
      cancellationsByReason: [
        {
          reason: 'Customer Request',
          count: Math.floor(cancelledBookings * 0.50),
          percentage: 50,
        },
        {
          reason: 'Weather Conditions',
          count: Math.floor(cancelledBookings * 0.20),
          percentage: 20,
        },
        {
          reason: 'Illness',
          count: Math.floor(cancelledBookings * 0.15),
          percentage: 15,
        },
        {
          reason: 'Other',
          count: Math.floor(cancelledBookings * 0.15),
          percentage: 15,
        },
      ],
    },
    generatedAt: new Date().toISOString(),
  };
}

// Generate occupancy report
export function generateOccupancyReport(
  venueId: string,
  period: ReportPeriod = ReportPeriod.LAST_7_DAYS
): OccupancyReport {
  const days = 7;
  const hoursPerDay = 15; // 8 AM - 11 PM
  const assets = 4;

  const totalAvailableSlots = days * hoursPerDay * assets * 2; // 2 slots per hour
  const totalBookedSlots = Math.floor(totalAvailableSlots * 0.68); // 68% occupancy

  // Generate heatmap data
  const heatmapData = [];
  const today = new Date();

  for (let d = days - 1; d >= 0; d--) {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    const dateStr = date.toISOString().split('T')[0];

    for (let hour = 8; hour < 23; hour++) {
      // Higher occupancy in evening (17-22)
      let baseRate = 0.5;
      if (hour >= 17 && hour <= 22) {
        baseRate = 0.85;
      } else if (hour >= 10 && hour <= 16) {
        baseRate = 0.60;
      }

      const occupancyRate = baseRate + (Math.random() * 0.2 - 0.1);
      const bookings = Math.floor(assets * 2 * Math.max(0, Math.min(1, occupancyRate)));

      heatmapData.push({
        date: dateStr,
        hour,
        occupancyRate: Math.floor(occupancyRate * 100),
        bookings,
      });
    }
  }

  return {
    venueId,
    period,
    startDate: heatmapData[0].date,
    endDate: heatmapData[heatmapData.length - 1].date,
    summary: {
      averageOccupancy: 68,
      totalAvailableSlots,
      totalBookedSlots,
      peakOccupancy: 95,
      peakOccupancyTime: '20:00',
      lowestOccupancy: 25,
      lowestOccupancyTime: '09:00',
    },
    byAsset: [
      {
        assetId: 'asset-1',
        assetName: 'Padel Court 1',
        assetType: 'Padel',
        occupancyRate: 75,
        totalSlots: Math.floor(totalAvailableSlots / 4),
        bookedSlots: Math.floor((totalAvailableSlots / 4) * 0.75),
      },
      {
        assetId: 'asset-2',
        assetName: 'PS5 Station 1',
        assetType: 'PlayStation 5',
        occupancyRate: 72,
        totalSlots: Math.floor(totalAvailableSlots / 4),
        bookedSlots: Math.floor((totalAvailableSlots / 4) * 0.72),
      },
      {
        assetId: 'asset-3',
        assetName: 'Morning Swimming Session',
        assetType: 'Swimming',
        occupancyRate: 65,
        totalSlots: Math.floor(totalAvailableSlots / 4),
        bookedSlots: Math.floor((totalAvailableSlots / 4) * 0.65),
      },
      {
        assetId: 'asset-4',
        assetName: 'Billiard Table 1',
        assetType: 'Billiards',
        occupancyRate: 58,
        totalSlots: Math.floor(totalAvailableSlots / 4),
        bookedSlots: Math.floor((totalAvailableSlots / 4) * 0.58),
      },
    ],
    byHour: Array.from({ length: 15 }, (_, i) => {
      const hour = i + 8;
      let rate = 50;
      if (hour >= 17 && hour <= 22) rate = 85;
      else if (hour >= 10 && hour <= 16) rate = 60;

      return {
        hour,
        occupancyRate: rate + Math.floor(Math.random() * 10 - 5),
        bookings: Math.floor((assets * 2 * rate) / 100),
      };
    }),
    byDayOfWeek: [
      { dayOfWeek: 0, dayName: 'Sunday', occupancyRate: 62, bookings: 42 },
      { dayOfWeek: 1, dayName: 'Monday', occupancyRate: 58, bookings: 38 },
      { dayOfWeek: 2, dayName: 'Tuesday', occupancyRate: 60, bookings: 40 },
      { dayOfWeek: 3, dayName: 'Wednesday', occupancyRate: 70, bookings: 50 },
      { dayOfWeek: 4, dayName: 'Thursday', occupancyRate: 85, bookings: 65 },
      { dayOfWeek: 5, dayName: 'Friday', occupancyRate: 90, bookings: 70 },
      { dayOfWeek: 6, dayName: 'Saturday', occupancyRate: 65, bookings: 45 },
    ],
    heatmap: {
      data: heatmapData,
    },
    generatedAt: new Date().toISOString(),
  };
}
