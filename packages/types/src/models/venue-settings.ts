export interface VenueSettings {
  id: string;
  venueId: string;

  // Booking Rules
  bookingRules: BookingRules;

  // White-label Settings
  whiteLabelSettings: WhiteLabelSettings;

  // Notification Preferences
  notificationPreferences: NotificationPreferences;

  updatedAt: string;
  updatedBy: string;
}

export interface BookingRules {
  // Duration constraints
  minBookingDuration: number; // minutes
  maxBookingDuration: number; // minutes

  // Advance booking
  advanceBookingDays: number; // how many days ahead can users book
  minAdvanceHours: number; // minimum hours before booking (e.g., can't book 30 mins from now)

  // Cancellation policy
  cancellationPolicy: CancellationPolicy;
  freeCancellationHours: number; // hours before start time for free cancellation
  cancellationFeePercentage: number; // 0-100

  // No-show
  noShowPenaltyEnabled: boolean;
  noShowPenaltyAmount: number;

  // Participants
  minParticipants: number;
  maxParticipants: number;

  // Other
  allowRecurringBookings: boolean;
  requireApproval: boolean; // manual approval for bookings
  instantExtensionEnabled: boolean;
}

export enum CancellationPolicy {
  FLEXIBLE = 'FLEXIBLE', // Free cancellation up to X hours before
  MODERATE = 'MODERATE', // Partial refund
  STRICT = 'STRICT', // No refund
  NO_CANCELLATION = 'NO_CANCELLATION',
}

export interface WhiteLabelSettings {
  enabled: boolean;
  subdomain: string; // e.g., "myvenue" for myvenue.smartclub.ir
  customDomain?: string; // optional custom domain

  // Branding
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string; // hex color
  secondaryColor: string;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;

  // Social
  instagramUrl?: string;
  telegramUrl?: string;
  whatsappNumber?: string;
}

export interface NotificationPreferences {
  // Email notifications
  emailNotificationsEnabled: boolean;
  notifyOnNewBooking: boolean;
  notifyOnCancellation: boolean;
  notifyOnNoShow: boolean;
  notificationEmail: string;

  // SMS notifications
  smsNotificationsEnabled: boolean;
  notificationPhone: string;

  // Booking reminders to customers
  sendCustomerReminders: boolean;
  reminderHoursBefore: number; // e.g., 24 hours before

  // Marketing
  sendPromotionalEmails: boolean;
}
