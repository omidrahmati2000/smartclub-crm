export interface PricingRule {
  id: string;
  venueId: string;
  name: string;
  description?: string;
  type: PricingRuleType;
  status: PricingRuleStatus;
  priority: number; // Higher priority rules apply first

  // Target selection
  targetAssets: string[]; // Empty array = all assets
  targetAssetTypes?: string[]; // Apply to specific asset types

  // Time-based conditions
  conditions: PricingCondition;

  // Price adjustment
  adjustment: PriceAdjustment;

  // Validity period
  validFrom: string;
  validUntil?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export enum PricingRuleType {
  PEAK_HOURS = 'PEAK_HOURS', // Peak/off-peak pricing
  DAY_OF_WEEK = 'DAY_OF_WEEK', // Different prices per day
  SPECIAL_DATE = 'SPECIAL_DATE', // Holidays, events
  LAST_MINUTE = 'LAST_MINUTE', // Discounts for last-minute bookings
  PROMOTIONAL = 'PROMOTIONAL', // Time-limited campaigns
  EARLY_BIRD = 'EARLY_BIRD', // Discounts for advance bookings
}

export enum PricingRuleStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SCHEDULED = 'SCHEDULED', // Not yet active
  EXPIRED = 'EXPIRED',
}

export interface PricingCondition {
  // Time of day
  timeSlots?: PricingTimeSlot[];

  // Days of week (0-6, 0=Saturday for Persian)
  daysOfWeek?: number[];

  // Specific dates
  specificDates?: string[];

  // Date range
  dateRange?: {
    start: string;
    end: string;
  };

  // Booking timing (for last-minute/early-bird)
  bookingWindow?: {
    minHoursBefore?: number; // Min hours before booking time
    maxHoursBefore?: number; // Max hours before booking time
  };

  // Minimum booking duration
  minDuration?: number; // minutes
}

export interface PricingTimeSlot {
  startTime: string; // "HH:mm" format
  endTime: string; // "HH:mm" format
}

export interface PriceAdjustment {
  type: AdjustmentType;
  value: number; // Percentage or fixed amount
  currency?: string; // For fixed amount adjustments

  // Override base price completely
  overridePrice?: number;
}

export enum AdjustmentType {
  PERCENTAGE_INCREASE = 'PERCENTAGE_INCREASE', // +20%
  PERCENTAGE_DECREASE = 'PERCENTAGE_DECREASE', // -15%
  FIXED_INCREASE = 'FIXED_INCREASE', // +50000 IRR
  FIXED_DECREASE = 'FIXED_DECREASE', // -30000 IRR
  OVERRIDE = 'OVERRIDE', // Set exact price
}

// DTO for creating/updating pricing rules
export interface CreatePricingRuleDTO {
  name: string;
  description?: string;
  type: PricingRuleType;
  targetAssets: string[];
  targetAssetTypes?: string[];
  conditions: PricingCondition;
  adjustment: PriceAdjustment;
  validFrom: string;
  validUntil?: string;
  priority?: number;
}

export interface UpdatePricingRuleDTO {
  name?: string;
  description?: string;
  status?: PricingRuleStatus;
  targetAssets?: string[];
  targetAssetTypes?: string[];
  conditions?: PricingCondition;
  adjustment?: PriceAdjustment;
  validFrom?: string;
  validUntil?: string;
  priority?: number;
}

// Price preview/calculation
export interface PricePreview {
  basePrice: number;
  appliedRules: AppliedPricingRule[];
  finalPrice: number;
  totalAdjustment: number;
  totalAdjustmentPercentage: number;
  currency: string;
}

export interface AppliedPricingRule {
  ruleId: string;
  ruleName: string;
  ruleType: PricingRuleType;
  adjustment: number;
  adjustmentType: AdjustmentType;
}

// Filters for listing pricing rules
export interface PricingRuleFilters {
  type?: PricingRuleType;
  status?: PricingRuleStatus;
  assetId?: string;
  search?: string;
  sortBy?: 'name' | 'type' | 'priority' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
