import {
  RevenueReport,
  OccupancyReport,
  ReportPeriod,
  BookingSource,
} from '@smartclub/types';

// Helper to generate daily revenue for a period
function generateDailyRevenue(days: number) {
  const daily = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const bookings = Math.floor(Math.random() * 15) + 5;
    const revenue = bookings * (Math.random() * 150000 + 200000);

    daily.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(revenue),
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

  return {
    venueId,
    period,
    startDate: daily[0].date,
    endDate: daily[daily.length - 1].date,
    summary: {
      totalRevenue,
      totalBookings,
      completedBookings,
      cancelledBookings,
      averageBookingValue: Math.floor(totalRevenue / totalBookings),
      currency: 'IRR',
      growthPercentage: Math.random() * 20 - 5, // -5% to +15%
    },
    byAssetType: [
      {
        assetType: 'PADEL',
        assetTypeName: 'پادل',
        revenue: Math.floor(totalRevenue * 0.45),
        bookings: Math.floor(totalBookings * 0.4),
        percentage: 45,
        averageValue: 350000,
      },
      {
        assetType: 'TENNIS',
        assetTypeName: 'تنیس',
        revenue: Math.floor(totalRevenue * 0.30),
        bookings: Math.floor(totalBookings * 0.35),
        percentage: 30,
        averageValue: 280000,
      },
      {
        assetType: 'PS5',
        assetTypeName: 'پلی‌استیشن 5',
        revenue: Math.floor(totalRevenue * 0.15),
        bookings: Math.floor(totalBookings * 0.15),
        percentage: 15,
        averageValue: 200000,
      },
      {
        assetType: 'BILLIARDS',
        assetTypeName: 'بیلیارد',
        revenue: Math.floor(totalRevenue * 0.10),
        bookings: Math.floor(totalBookings * 0.10),
        percentage: 10,
        averageValue: 180000,
      },
    ],
    bySource: [
      {
        source: BookingSource.ONLINE,
        sourceName: 'رزرو آنلاین',
        revenue: Math.floor(totalRevenue * 0.65),
        bookings: Math.floor(totalBookings * 0.70),
        percentage: 65,
      },
      {
        source: BookingSource.WALK_IN,
        sourceName: 'حضوری',
        revenue: Math.floor(totalRevenue * 0.25),
        bookings: Math.floor(totalBookings * 0.20),
        percentage: 25,
      },
      {
        source: BookingSource.PHONE,
        sourceName: 'تلفنی',
        revenue: Math.floor(totalRevenue * 0.10),
        bookings: Math.floor(totalBookings * 0.10),
        percentage: 10,
      },
    ],
    byPaymentMethod: [
      {
        method: 'WALLET',
        methodName: 'کیف پول',
        revenue: Math.floor(totalRevenue * 0.55),
        bookings: Math.floor(totalBookings * 0.60),
        percentage: 55,
      },
      {
        method: 'CARD',
        methodName: 'کارت بانکی',
        revenue: Math.floor(totalRevenue * 0.30),
        bookings: Math.floor(totalBookings * 0.25),
        percentage: 30,
      },
      {
        method: 'CASH',
        methodName: 'نقدی',
        revenue: Math.floor(totalRevenue * 0.15),
        bookings: Math.floor(totalBookings * 0.15),
        percentage: 15,
      },
    ],
    daily,
    cancellations: {
      totalCancellations: cancelledBookings,
      cancellationRate: (cancelledBookings / totalBookings) * 100,
      totalRefunds: Math.floor(totalRevenue * 0.08),
      lostRevenue: Math.floor(totalRevenue * 0.12),
      cancellationsByReason: [
        {
          reason: 'درخواست مشتری',
          count: Math.floor(cancelledBookings * 0.50),
          percentage: 50,
        },
        {
          reason: 'شرایط آب و هوایی',
          count: Math.floor(cancelledBookings * 0.20),
          percentage: 20,
        },
        {
          reason: 'بیماری',
          count: Math.floor(cancelledBookings * 0.15),
          percentage: 15,
        },
        {
          reason: 'دیگر',
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
        assetName: 'زمین پادل 1',
        assetType: 'پادل',
        occupancyRate: 75,
        totalSlots: Math.floor(totalAvailableSlots / 4),
        bookedSlots: Math.floor((totalAvailableSlots / 4) * 0.75),
      },
      {
        assetId: 'asset-2',
        assetName: 'زمین پادل 2',
        assetType: 'پادل',
        occupancyRate: 72,
        totalSlots: Math.floor(totalAvailableSlots / 4),
        bookedSlots: Math.floor((totalAvailableSlots / 4) * 0.72),
      },
      {
        assetId: 'asset-3',
        assetName: 'پلی‌استیشن 5',
        assetType: 'PS5',
        occupancyRate: 65,
        totalSlots: Math.floor(totalAvailableSlots / 4),
        bookedSlots: Math.floor((totalAvailableSlots / 4) * 0.65),
      },
      {
        assetId: 'asset-4',
        assetName: 'میز بیلیارد',
        assetType: 'بیلیارد',
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
      { dayOfWeek: 6, dayName: 'شنبه', occupancyRate: 65, bookings: 45 },
      { dayOfWeek: 0, dayName: 'یکشنبه', occupancyRate: 62, bookings: 42 },
      { dayOfWeek: 1, dayName: 'دوشنبه', occupancyRate: 58, bookings: 38 },
      { dayOfWeek: 2, dayName: 'سه‌شنبه', occupancyRate: 60, bookings: 40 },
      { dayOfWeek: 3, dayName: 'چهارشنبه', occupancyRate: 70, bookings: 50 },
      { dayOfWeek: 4, dayName: 'پنج‌شنبه', occupancyRate: 85, bookings: 65 },
      { dayOfWeek: 5, dayName: 'جمعه', occupancyRate: 90, bookings: 70 },
    ],
    heatmap: {
      data: heatmapData,
    },
    generatedAt: new Date().toISOString(),
  };
}
