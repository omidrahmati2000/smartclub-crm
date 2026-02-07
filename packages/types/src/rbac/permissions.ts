export const Permission = {
  // Venue
  VENUE_VIEW: 'venue:view',
  VENUE_EDIT: 'venue:edit',
  VENUE_DELETE: 'venue:delete',
  VENUE_SETTINGS: 'venue:settings',

  // Bookings
  BOOKING_VIEW: 'booking:view',
  BOOKING_CREATE: 'booking:create',
  BOOKING_EDIT: 'booking:edit',
  BOOKING_CANCEL: 'booking:cancel',

  // Calendar
  CALENDAR_VIEW: 'calendar:view',
  CALENDAR_MANAGE: 'calendar:manage',

  // Assets
  ASSET_VIEW: 'asset:view',
  ASSET_CREATE: 'asset:create',
  ASSET_EDIT: 'asset:edit',
  ASSET_DELETE: 'asset:delete',

  // Customers
  CUSTOMER_VIEW: 'customer:view',
  CUSTOMER_MANAGE: 'customer:manage',

  // Staff
  STAFF_VIEW: 'staff:view',
  STAFF_MANAGE: 'staff:manage',

  // Coaches
  COACH_VIEW: 'coach:view',
  COACH_MANAGE: 'coach:manage',

  // Finance
  FINANCE_VIEW: 'finance:view',
  FINANCE_MANAGE: 'finance:manage',

  // Pricing
  PRICING_VIEW: 'pricing:view',
  PRICING_MANAGE: 'pricing:manage',

  // Reports
  REPORTS_VIEW: 'reports:view',

  // Tournaments
  TOURNAMENT_VIEW: 'tournament:view',
  TOURNAMENT_CREATE: 'tournament:create',
  TOURNAMENT_MANAGE: 'tournament:manage',

  // Platform (Admin)
  PLATFORM_VENUES: 'platform:venues',
  PLATFORM_USERS: 'platform:users',
  PLATFORM_FINANCE: 'platform:finance',
  PLATFORM_MODERATION: 'platform:moderation',
  PLATFORM_SETTINGS: 'platform:settings',
  PLATFORM_ADMINS: 'platform:admins',
} as const;

export type PermissionKey = (typeof Permission)[keyof typeof Permission];
