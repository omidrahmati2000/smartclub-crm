import {
  PricingRule,
  PricingRuleType,
  PricingRuleStatus,
  AdjustmentType,
} from '@smartclub/types';

export const mockPricingRules: PricingRule[] = [
  {
    id: 'pricing-1',
    venueId: 'venue-1',
    name: 'Peak Hours Pricing',
    description: 'Premium pricing during busy hours (17:00-22:00)',
    type: PricingRuleType.PEAK_HOURS,
    status: PricingRuleStatus.ACTIVE,
    priority: 1,
    targetAssets: [], // All assets
    conditions: {
      timeSlots: [
        { startTime: '17:00', endTime: '22:00' },
      ],
      daysOfWeek: [3, 4, 5], // Wed, Thu, Fri
    },
    adjustment: {
      type: AdjustmentType.PERCENTAGE_INCREASE,
      value: 25, // +25%
    },
    validFrom: new Date('2024-01-01').toISOString(),
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
    createdBy: 'user-owner-1',
  },
  {
    id: 'pricing-2',
    venueId: 'venue-1',
    name: 'Weekday Morning Discount',
    description: 'Discount for bookings on weekday mornings (08:00-12:00)',
    type: PricingRuleType.PEAK_HOURS,
    status: PricingRuleStatus.ACTIVE,
    priority: 2,
    targetAssets: [],
    conditions: {
      timeSlots: [
        { startTime: '08:00', endTime: '12:00' },
      ],
      daysOfWeek: [0, 1, 2, 3], // Sun, Mon, Tue, Wed
    },
    adjustment: {
      type: AdjustmentType.PERCENTAGE_DECREASE,
      value: 15, // -15%
    },
    validFrom: new Date('2024-01-01').toISOString(),
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
    createdBy: 'user-owner-1',
  },
  {
    id: 'pricing-3',
    venueId: 'venue-1',
    name: 'Friday Premium Pricing',
    description: 'Premium pricing on Fridays',
    type: PricingRuleType.DAY_OF_WEEK,
    status: PricingRuleStatus.ACTIVE,
    priority: 1,
    targetAssets: [],
    conditions: {
      daysOfWeek: [5], // Friday
    },
    adjustment: {
      type: AdjustmentType.PERCENTAGE_INCREASE,
      value: 30, // +30%
    },
    validFrom: new Date('2024-01-01').toISOString(),
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
    createdBy: 'user-owner-1',
  },
  {
    id: 'pricing-4',
    venueId: 'venue-1',
    name: 'Ramadan Special Offer',
    description: 'Special discount campaign for Ramadan',
    type: PricingRuleType.SPECIAL_DATE,
    status: PricingRuleStatus.SCHEDULED,
    priority: 5,
    targetAssets: [],
    conditions: {
      dateRange: {
        start: new Date('2025-03-01').toISOString().split('T')[0],
        end: new Date('2025-03-30').toISOString().split('T')[0],
      },
    },
    adjustment: {
      type: AdjustmentType.PERCENTAGE_DECREASE,
      value: 20, // -20%
    },
    validFrom: new Date('2025-03-01').toISOString(),
    validUntil: new Date('2025-03-30').toISOString(),
    createdAt: new Date('2025-01-15').toISOString(),
    updatedAt: new Date('2025-01-15').toISOString(),
    createdBy: 'user-owner-1',
  },
  {
    id: 'pricing-5',
    venueId: 'venue-1',
    name: 'Last Minute Discount',
    description: 'Discount for bookings less than 2 hours in advance',
    type: PricingRuleType.LAST_MINUTE,
    status: PricingRuleStatus.ACTIVE,
    priority: 10,
    targetAssets: [],
    conditions: {
      bookingWindow: {
        maxHoursBefore: 2,
      },
    },
    adjustment: {
      type: AdjustmentType.PERCENTAGE_DECREASE,
      value: 25, // -25%
    },
    validFrom: new Date('2024-01-01').toISOString(),
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
    createdBy: 'user-owner-1',
  },
  {
    id: 'pricing-6',
    venueId: 'venue-1',
    name: 'Early Bird Discount',
    description: 'Discount for bookings made 7+ days in advance',
    type: PricingRuleType.EARLY_BIRD,
    status: PricingRuleStatus.ACTIVE,
    priority: 3,
    targetAssets: [],
    conditions: {
      bookingWindow: {
        minHoursBefore: 168, // 7 days
      },
    },
    adjustment: {
      type: AdjustmentType.PERCENTAGE_DECREASE,
      value: 10, // -10%
    },
    validFrom: new Date('2024-01-01').toISOString(),
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
    createdBy: 'user-owner-1',
  },
  {
    id: 'pricing-7',
    venueId: 'venue-1',
    name: 'New Court Grand Opening',
    description: 'Special discount for new court launch',
    type: PricingRuleType.PROMOTIONAL,
    status: PricingRuleStatus.INACTIVE,
    priority: 8,
    targetAssets: ['asset-3'], // Only new court
    conditions: {
      dateRange: {
        start: new Date('2025-02-01').toISOString().split('T')[0],
        end: new Date('2025-02-15').toISOString().split('T')[0],
      },
    },
    adjustment: {
      type: AdjustmentType.PERCENTAGE_DECREASE,
      value: 35, // -35%
    },
    validFrom: new Date('2025-02-01').toISOString(),
    validUntil: new Date('2025-02-15').toISOString(),
    createdAt: new Date('2025-01-20').toISOString(),
    updatedAt: new Date('2025-01-20').toISOString(),
    createdBy: 'user-owner-1',
  },
];

// Helper functions
export function getPricingRulesByVenue(venueId: string): PricingRule[] {
  return mockPricingRules.filter((r) => r.venueId === venueId);
}

export function getPricingRuleById(ruleId: string): PricingRule | undefined {
  return mockPricingRules.find((r) => r.id === ruleId);
}

export function createPricingRule(data: any): PricingRule {
  const newRule: PricingRule = {
    id: `pricing-${Date.now()}`,
    venueId: data.venueId,
    name: data.name,
    description: data.description,
    type: data.type,
    status: PricingRuleStatus.ACTIVE,
    priority: data.priority || 5,
    targetAssets: data.targetAssets || [],
    targetAssetTypes: data.targetAssetTypes,
    conditions: data.conditions,
    adjustment: data.adjustment,
    validFrom: data.validFrom,
    validUntil: data.validUntil,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: data.createdBy || 'current-user',
  };

  mockPricingRules.push(newRule);
  return newRule;
}

export function updatePricingRule(ruleId: string, updates: any): PricingRule | undefined {
  const index = mockPricingRules.findIndex((r) => r.id === ruleId);
  if (index === -1) return undefined;

  mockPricingRules[index] = {
    ...mockPricingRules[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return mockPricingRules[index];
}

export function deletePricingRule(ruleId: string): boolean {
  const index = mockPricingRules.findIndex((r) => r.id === ruleId);
  if (index === -1) return false;

  mockPricingRules.splice(index, 1);
  return true;
}

export function togglePricingRuleStatus(ruleId: string): PricingRule | undefined {
  const rule = mockPricingRules.find((r) => r.id === ruleId);
  if (!rule) return undefined;

  rule.status =
    rule.status === PricingRuleStatus.ACTIVE
      ? PricingRuleStatus.INACTIVE
      : PricingRuleStatus.ACTIVE;
  rule.updatedAt = new Date().toISOString();

  return rule;
}
