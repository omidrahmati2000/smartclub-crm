export interface PricingRule {
  id: string;
  venueId: string;
  assetId?: string;
  name: string;
  type: PricingRuleType;
  conditions: PricingCondition[];
  adjustment: PriceAdjustment;
  priority: number;
  isActive: boolean;
  createdAt: string;
}

export type PricingRuleType = 'peak' | 'off_peak' | 'last_minute' | 'early_bird' | 'custom';

export interface PricingCondition {
  field: 'dayOfWeek' | 'timeRange' | 'daysBeforeBooking' | 'occupancyRate';
  operator: 'equals' | 'between' | 'lessThan' | 'greaterThan';
  value: string | number | [number, number];
}

export interface PriceAdjustment {
  type: 'percentage' | 'fixed';
  value: number; // positive = increase, negative = discount
}
