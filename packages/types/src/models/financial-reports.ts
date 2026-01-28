export interface RevenueReport {
  venueId: string;
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  summary: RevenueSummary;
  byAssetType: RevenueByAssetType[];
  bySource: RevenueBySource[];
  byPaymentMethod: RevenueByPaymentMethod[];
  daily: DailyRevenue[];
  cancellations: CancellationReport;
  generatedAt: string;
}

export interface RevenueSummary {
  totalRevenue: number;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  averageBookingValue: number;
  currency: string;
  growthPercentage?: number; // Compared to previous period
}

export interface RevenueByAssetType {
  assetType: string;
  assetTypeName: string;
  revenue: number;
  bookings: number;
  percentage: number;
  averageValue: number;
}

export interface RevenueBySource {
  source: BookingSource;
  sourceName: string;
  revenue: number;
  bookings: number;
  percentage: number;
}

export enum BookingSource {
  ONLINE = 'ONLINE',
  WALK_IN = 'WALK_IN',
  PHONE = 'PHONE',
  APP = 'APP',
}

export interface RevenueByPaymentMethod {
  method: string;
  methodName: string;
  revenue: number;
  bookings: number;
  percentage: number;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
  bookings: number;
  completedBookings: number;
  cancelledBookings: number;
}

export interface CancellationReport {
  totalCancellations: number;
  cancellationRate: number; // Percentage
  totalRefunds: number;
  lostRevenue: number;
  cancellationsByReason: CancellationByReason[];
}

export interface CancellationByReason {
  reason: string;
  count: number;
  percentage: number;
}

export interface OccupancyReport {
  venueId: string;
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  summary: OccupancySummary;
  byAsset: OccupancyByAsset[];
  byHour: OccupancyByHour[];
  byDayOfWeek: OccupancyByDayOfWeek[];
  heatmap: OccupancyHeatmap;
  generatedAt: string;
}

export interface OccupancySummary {
  averageOccupancy: number; // Percentage
  totalAvailableSlots: number;
  totalBookedSlots: number;
  peakOccupancy: number;
  peakOccupancyTime: string;
  lowestOccupancy: number;
  lowestOccupancyTime: string;
}

export interface OccupancyByAsset {
  assetId: string;
  assetName: string;
  assetType: string;
  occupancyRate: number;
  totalSlots: number;
  bookedSlots: number;
}

export interface OccupancyByHour {
  hour: number; // 0-23
  occupancyRate: number;
  bookings: number;
}

export interface OccupancyByDayOfWeek {
  dayOfWeek: number; // 0-6 (0=Saturday for Persian)
  dayName: string;
  occupancyRate: number;
  bookings: number;
}

export interface OccupancyHeatmap {
  data: OccupancyHeatmapCell[];
}

export interface OccupancyHeatmapCell {
  date: string;
  hour: number;
  occupancyRate: number;
  bookings: number;
}

export enum ReportPeriod {
  TODAY = 'TODAY',
  YESTERDAY = 'YESTERDAY',
  LAST_7_DAYS = 'LAST_7_DAYS',
  LAST_30_DAYS = 'LAST_30_DAYS',
  THIS_WEEK = 'THIS_WEEK',
  LAST_WEEK = 'LAST_WEEK',
  THIS_MONTH = 'THIS_MONTH',
  LAST_MONTH = 'LAST_MONTH',
  THIS_YEAR = 'THIS_YEAR',
  CUSTOM = 'CUSTOM',
}

export interface ReportFilters {
  venueId: string;
  period: ReportPeriod;
  startDate?: string; // For CUSTOM period
  endDate?: string; // For CUSTOM period
  assetTypes?: string[];
  includeOccupancy?: boolean;
}

export interface ExportOptions {
  format: 'CSV' | 'PDF';
  reportType: 'REVENUE' | 'OCCUPANCY' | 'COMBINED';
  includeCharts?: boolean;
}
