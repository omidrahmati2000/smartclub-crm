import {
  VenueSettings,
  CancellationPolicy,
  type Venue,
} from '@smartclub/types';

export const mockVenueSettings: Record<string, VenueSettings> = {
  // Padel Tehran settings
  'venue-1': {
    id: 'settings-1',
    venueId: 'venue-1',
    bookingRules: {
      minBookingDuration: 60,
      maxBookingDuration: 180,
      advanceBookingDays: 30,
      minAdvanceHours: 2,
      cancellationPolicy: CancellationPolicy.FLEXIBLE,
      freeCancellationHours: 24,
      cancellationFeePercentage: 0,
      noShowPenaltyEnabled: true,
      noShowPenaltyAmount: 100000,
      minParticipants: 2,
      maxParticipants: 4,
      allowRecurringBookings: true,
      requireApproval: false,
      instantExtensionEnabled: true,
    },
    whiteLabelSettings: {
      enabled: true,
      subdomain: 'padel-tehran',
      primaryColor: '#10b981',
      secondaryColor: '#059669',
      logoUrl: 'https://via.placeholder.com/200x80?text=Padel+Tehran',
      metaTitle: 'پادل تهران - بهترین زمین‌های پادل در تهران',
      metaDescription: 'رزرو آنلاین زمین پادل در تهران با بهترین امکانات',
      metaKeywords: 'پادل، رزرو زمین پادل، پادل تهران',
      instagramUrl: 'https://instagram.com/padeltehran',
      telegramUrl: 'https://t.me/padeltehran',
      whatsappNumber: '+989121234567',
    },
    notificationPreferences: {
      emailNotificationsEnabled: true,
      notifyOnNewBooking: true,
      notifyOnCancellation: true,
      notifyOnNoShow: true,
      notificationEmail: 'admin@padeltehran.ir',
      smsNotificationsEnabled: true,
      notificationPhone: '09121234567',
      sendCustomerReminders: true,
      reminderHoursBefore: 24,
      sendPromotionalEmails: false,
    },
    updatedAt: new Date().toISOString(),
    updatedBy: 'user-owner-1',
  },

  // GameLand Pasdaran settings
  'venue-2': {
    id: 'settings-2',
    venueId: 'venue-2',
    bookingRules: {
      minBookingDuration: 30,
      maxBookingDuration: 240,
      advanceBookingDays: 14,
      minAdvanceHours: 1,
      cancellationPolicy: CancellationPolicy.MODERATE,
      freeCancellationHours: 12,
      cancellationFeePercentage: 30,
      noShowPenaltyEnabled: true,
      noShowPenaltyAmount: 50000,
      minParticipants: 1,
      maxParticipants: 6,
      allowRecurringBookings: false,
      requireApproval: false,
      instantExtensionEnabled: true,
    },
    whiteLabelSettings: {
      enabled: true,
      subdomain: 'gameland-pasdaran',
      primaryColor: '#3b82f6',
      secondaryColor: '#2563eb',
      logoUrl: 'https://via.placeholder.com/200x80?text=GameLand',
      metaTitle: 'گیم‌لند پاسداران - پلی‌استیشن و بیلیارد',
      metaDescription: 'رزرو آنلاین پلی‌استیشن، بیلیارد و VR در پاسداران',
      instagramUrl: 'https://instagram.com/gamelandpasdaran',
      telegramUrl: 'https://t.me/gamelandpasdaran',
    },
    notificationPreferences: {
      emailNotificationsEnabled: true,
      notifyOnNewBooking: true,
      notifyOnCancellation: true,
      notifyOnNoShow: false,
      notificationEmail: 'info@gameland.ir',
      smsNotificationsEnabled: false,
      notificationPhone: '',
      sendCustomerReminders: true,
      reminderHoursBefore: 12,
      sendPromotionalEmails: true,
    },
    updatedAt: new Date().toISOString(),
    updatedBy: 'user-owner-2',
  },

  // Abi Pool settings
  'venue-3': {
    id: 'settings-3',
    venueId: 'venue-3',
    bookingRules: {
      minBookingDuration: 60,
      maxBookingDuration: 120,
      advanceBookingDays: 7,
      minAdvanceHours: 4,
      cancellationPolicy: CancellationPolicy.STRICT,
      freeCancellationHours: 48,
      cancellationFeePercentage: 50,
      noShowPenaltyEnabled: true,
      noShowPenaltyAmount: 200000,
      minParticipants: 1,
      maxParticipants: 30,
      allowRecurringBookings: true,
      requireApproval: true,
      instantExtensionEnabled: false,
    },
    whiteLabelSettings: {
      enabled: false,
      subdomain: 'abi-pool',
      primaryColor: '#06b6d4',
      secondaryColor: '#0891b2',
      metaTitle: 'استخر آبی - شنای حرفه‌ای و تفریحی',
      metaDescription: 'رزرو آنلاین استخر در تهران',
    },
    notificationPreferences: {
      emailNotificationsEnabled: true,
      notifyOnNewBooking: true,
      notifyOnCancellation: true,
      notifyOnNoShow: true,
      notificationEmail: 'manager@abipool.ir',
      smsNotificationsEnabled: true,
      notificationPhone: '09123456789',
      sendCustomerReminders: true,
      reminderHoursBefore: 48,
      sendPromotionalEmails: false,
    },
    updatedAt: new Date().toISOString(),
    updatedBy: 'user-owner-3',
  },
};

// Helper to get settings by venue ID
export function getVenueSettings(venueId: string): VenueSettings | undefined {
  return mockVenueSettings[venueId];
}

// Helper to update settings
export function updateVenueSettings(
  venueId: string,
  updates: Partial<VenueSettings>
): VenueSettings {
  const current = mockVenueSettings[venueId];
  if (!current) {
    throw new Error('Venue settings not found');
  }

  const updated = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  mockVenueSettings[venueId] = updated;
  return updated;
}
