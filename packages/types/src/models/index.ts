export type { BaseUser, Customer, Coach, VenueStaff, PlatformAdmin, User } from './user';
export { CustomerStatus } from './customer-profile';
export { StaffStatus, InvitationStatus } from './staff-member';
export { BookingSource, ReportPeriod } from './financial-reports';
export { PricingRuleType, PricingRuleStatus, AdjustmentType } from './pricing-rule';
export type {
  CustomerProfile,
  CustomerStats,
  CustomerTag,
  CustomerNote,
  CustomerFilters,
  CustomerListItem,
} from './customer-profile';
export type {
  StaffMember,
  StaffActivity,
  StaffInvitation,
  StaffFilters,
  CreateStaffDTO,
  UpdateStaffDTO,
  RolePermissions,
} from './staff-member';
export type {
  RevenueReport,
  RevenueSummary,
  RevenueByAssetType,
  RevenueBySource,
  RevenueByPaymentMethod,
  DailyRevenue,
  CancellationReport,
  CancellationByReason,
  OccupancyReport,
  OccupancySummary,
  OccupancyByAsset,
  OccupancyByHour,
  OccupancyByDayOfWeek,
  OccupancyHeatmap,
  OccupancyHeatmapCell,
  ReportFilters,
  ExportOptions,
} from './financial-reports';
export type {
  PricingRule,
  PricingCondition,
  PricingTimeSlot,
  PriceAdjustment,
  CreatePricingRuleDTO,
  UpdatePricingRuleDTO,
  PricePreview,
  AppliedPricingRule,
  PricingRuleFilters,
} from './pricing-rule';
export type { Venue, OperatingHours, Asset, Amenity, AssetImage, AssetFacility } from './venue';
export {
  venueRequiresGDPR,
  getVenueCountry,
  getVenueTimezone,
  getVenueCurrency,
} from './venue';
export { CancellationPolicy } from './venue-settings';
export type {
  VenueSettings,
  BookingRules,
  WhiteLabelSettings,
  NotificationPreferences,
} from './venue-settings';
export type { Booking, BookingParticipant, TimeSlot } from './booking';
export { PaymentMethod } from './payment';
export type { Payment, Wallet, WalletTransaction } from './payment';
export type {
  OpenMatch,
  FeedPost,
  Reaction,
  Team,
  ChatConversation,
  ChatMessage,
} from './social';
export { TournamentStatus } from './tournament';
export type {
  Tournament,
  TournamentParticipant,
  TournamentRound,
  TournamentMatch,
  MatchSet,
  TournamentStanding,
} from './tournament';
export type {
  CoachProfile,
  Certification,
  VenueAffiliation,
  CoachSession,
} from './coach';
export type { Notification, NotificationType } from './notification';

// Multi-region support
export type {
  VenueLocation,
  StateProvince,
  PostalCodeConfig,
  City,
  CountryInfo,
} from './location';
export {
  POSTAL_CODE_CONFIGS,
  validatePostalCode,
  formatAddress,
} from './location';

export type {
  VenueTaxSettings,
  TaxRateCategory,
  VenueTaxExemption,
  TaxExemptionCondition,
  TaxInvoiceSettings,
  CountryTaxConfig,
  TaxCalculation,
} from './tax-settings';
export {
  COUNTRY_TAX_CONFIGS,
  getCountryTaxConfig,
  validateTaxId,
} from './tax-settings';

export type {
  VenueComplianceSettings,
  GDPRSettings,
  DataProtectionOfficer,
  ConsentCategory,
  ParentalConsentSettings,
  CookieConsentSettings,
  ThirdPartyDisclosure,
  CountrySpecificCompliance,
  CustomerConsent,
  DataDeletionRequest,
  DataExportRequest,
  DataBreachRecord,
  ComplianceRequirement,
} from './compliance';
export type {
  ConsentType,
  LegalBasis,
  DataExportFormat,
  DataRequestStatus,
} from './compliance';
export {
  COMPLIANCE_REQUIREMENTS,
  getComplianceRequirements,
  isGDPRRequiredForCountry,
  getDefaultGDPRSettings,
} from './compliance';

export type {
  VenuePaymentSettings,
  GatewayCredentials,
} from './payment-settings';
export { DEFAULT_PAYMENT_SETTINGS } from './payment-settings';

export type {
  Product,
  ProductCategory,
  StockAdjustment,
  Sale,
  SaleItem,
  SalesReport,
} from './product';
export { ProductStatus, StockAdjustmentType } from './product';
