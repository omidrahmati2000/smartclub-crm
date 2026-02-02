import type { PriceAdjustment, PricingRule, PricingCondition } from '@smartclub/types';
import { AdjustmentType, PricingRuleStatus } from '@smartclub/types';

/**
 * Central pricing engine for SmartClub CRM
 *
 * Order of operations:
 *   1. Start with base price (from asset config)
 *   2. Apply pricing rules (peak hours, discounts, etc.)
 *   3. Subtract discount → gives "taxable amount"
 *   4. Calculate tax on taxable amount
 *   5. Calculate service fee on taxable amount
 *   6. total = taxableAmount + taxAmount + serviceFee
 */

// ─── Types ───────────────────────────────────────────────────────

export interface PriceBreakdown {
  /** Base price from asset (before any rules) */
  basePrice: number;
  /** Price after pricing rules applied */
  subtotal: number;
  /** Discount amount (positive number, subtracted from subtotal) */
  discount: number;
  /** Human-readable discount label */
  discountLabel?: string;
  /** Taxable amount = subtotal - discount */
  taxableAmount: number;
  /** Tax rate as percentage (e.g. 5 for 5%) */
  taxRate: number;
  /** Calculated tax amount */
  taxAmount: number;
  /** Service fee rate as percentage (e.g. 10 for 10%) */
  serviceFeeRate: number;
  /** Calculated service fee */
  serviceFee: number;
  /** Final total = taxableAmount + taxAmount + serviceFee */
  totalPrice: number;
  /** Currency code */
  currency: string;
  /** Rules that were applied */
  appliedRules: AppliedRule[];
}

export interface AppliedRule {
  ruleId: string;
  ruleName: string;
  adjustmentType: AdjustmentType;
  /** Amount of adjustment (positive = increase, negative = decrease) */
  adjustment: number;
}

export interface PriceCalculationInput {
  /** Base price from asset configuration */
  basePrice: number;
  /** Currency code */
  currency: string;
  /** Tax rate percentage (e.g. 5 for UAE VAT 5%) */
  taxRate?: number;
  /** Service fee rate percentage (e.g. 10 for 10% platform fee) */
  serviceFeeRate?: number;
  /** Optional discount amount to apply */
  discount?: number;
  /** Optional discount label */
  discountLabel?: string;
  /** Pricing rules to evaluate */
  rules?: PricingRule[];
  /** Context for rule matching */
  context?: RuleMatchContext;
}

export interface RuleMatchContext {
  /** Booking date (YYYY-MM-DD) */
  date?: string;
  /** Start time (HH:mm) */
  startTime?: string;
  /** Day of week (0=Sunday, 5=Friday, 6=Saturday) */
  dayOfWeek?: number;
  /** Asset ID */
  assetId?: string;
  /** Asset type / sport type */
  assetType?: string;
  /** Hours between now and booking time */
  hoursUntilBooking?: number;
}

// ─── Core Functions ──────────────────────────────────────────────

/**
 * Round a number to the correct decimal places for a currency.
 * KWD/BHD/OMR → 3 decimals, JPY/KRW/IRR → 0 decimals, most → 2 decimals.
 */
export function roundForCurrency(amount: number, currency: string): number {
  const decimals = getCurrencyDecimals(currency);
  const factor = Math.pow(10, decimals);
  return Math.round(amount * factor) / factor;
}

/**
 * Get decimal places for a currency code.
 */
export function getCurrencyDecimals(currency: string): number {
  const zeroDecimal = ['IRR', 'IRT', 'JPY', 'KRW', 'VND', 'CLP', 'COP', 'IDR', 'IQD', 'LBP'];
  const threeDecimal = ['KWD', 'BHD', 'OMR', 'JOD'];
  if (zeroDecimal.includes(currency)) return 0;
  if (threeDecimal.includes(currency)) return 3;
  return 2;
}

/**
 * Calculate full price breakdown for a booking.
 */
export function calculateBookingPrice(input: PriceCalculationInput): PriceBreakdown {
  const {
    basePrice,
    currency,
    taxRate = 0,
    serviceFeeRate = 0,
    discount: manualDiscount = 0,
    discountLabel,
    rules = [],
    context,
  } = input;

  // Step 1: Apply pricing rules to base price
  const { adjustedPrice, appliedRules } = applyPricingRules(basePrice, rules, context);

  // Step 2: Determine subtotal (after rules) and discount
  const subtotal = roundForCurrency(adjustedPrice, currency);
  const discount = roundForCurrency(manualDiscount, currency);

  // Step 3: Taxable amount
  const taxableAmount = roundForCurrency(Math.max(0, subtotal - discount), currency);

  // Step 4: Tax
  const taxAmount = roundForCurrency(taxableAmount * (taxRate / 100), currency);

  // Step 5: Service fee
  const serviceFee = roundForCurrency(taxableAmount * (serviceFeeRate / 100), currency);

  // Step 6: Total
  const totalPrice = roundForCurrency(taxableAmount + taxAmount + serviceFee, currency);

  return {
    basePrice,
    subtotal,
    discount,
    discountLabel,
    taxableAmount,
    taxRate,
    taxAmount,
    serviceFeeRate,
    serviceFee,
    totalPrice,
    currency,
    appliedRules,
  };
}

/**
 * Apply a single price adjustment to a base price.
 */
export function applyAdjustment(basePrice: number, adjustment: PriceAdjustment): number {
  switch (adjustment.type) {
    case AdjustmentType.PERCENTAGE_INCREASE:
      return basePrice + basePrice * (adjustment.value / 100);
    case AdjustmentType.PERCENTAGE_DECREASE:
      return basePrice - basePrice * (adjustment.value / 100);
    case AdjustmentType.FIXED_INCREASE:
      return basePrice + adjustment.value;
    case AdjustmentType.FIXED_DECREASE:
      return basePrice - adjustment.value;
    case AdjustmentType.OVERRIDE:
      return adjustment.overridePrice ?? basePrice;
    default:
      return basePrice;
  }
}

/**
 * Calculate the adjustment amount (signed) from a rule.
 */
export function getAdjustmentAmount(basePrice: number, adjustment: PriceAdjustment): number {
  switch (adjustment.type) {
    case AdjustmentType.PERCENTAGE_INCREASE:
      return basePrice * (adjustment.value / 100);
    case AdjustmentType.PERCENTAGE_DECREASE:
      return -(basePrice * (adjustment.value / 100));
    case AdjustmentType.FIXED_INCREASE:
      return adjustment.value;
    case AdjustmentType.FIXED_DECREASE:
      return -adjustment.value;
    case AdjustmentType.OVERRIDE:
      return (adjustment.overridePrice ?? basePrice) - basePrice;
    default:
      return 0;
  }
}

/**
 * Apply all matching pricing rules, sorted by priority.
 * Returns the adjusted price and list of applied rules.
 */
export function applyPricingRules(
  basePrice: number,
  rules: PricingRule[],
  context?: RuleMatchContext,
): { adjustedPrice: number; appliedRules: AppliedRule[] } {
  if (!rules.length || !context) {
    return { adjustedPrice: basePrice, appliedRules: [] };
  }

  // Filter active rules and sort by priority (lower number = higher priority)
  const activeRules = rules
    .filter((r) => r.status === PricingRuleStatus.ACTIVE)
    .sort((a, b) => a.priority - b.priority);

  let currentPrice = basePrice;
  const appliedRules: AppliedRule[] = [];

  for (const rule of activeRules) {
    if (!matchesConditions(rule.conditions, context, rule.targetAssets, rule.targetAssetTypes)) {
      continue;
    }

    const adjustment = getAdjustmentAmount(currentPrice, rule.adjustment);
    currentPrice = applyAdjustment(currentPrice, rule.adjustment);

    appliedRules.push({
      ruleId: rule.id,
      ruleName: rule.name,
      adjustmentType: rule.adjustment.type,
      adjustment,
    });
  }

  return {
    adjustedPrice: Math.max(0, currentPrice),
    appliedRules,
  };
}

/**
 * Check if a pricing rule's conditions match the booking context.
 */
export function matchesConditions(
  conditions: PricingCondition,
  context: RuleMatchContext,
  targetAssets?: string[],
  targetAssetTypes?: string[],
): boolean {
  // Check asset targeting
  if (targetAssets && targetAssets.length > 0 && context.assetId) {
    if (!targetAssets.includes(context.assetId)) return false;
  }
  if (targetAssetTypes && targetAssetTypes.length > 0 && context.assetType) {
    if (!targetAssetTypes.includes(context.assetType)) return false;
  }

  // Check day of week
  if (conditions.daysOfWeek && conditions.daysOfWeek.length > 0 && context.dayOfWeek != null) {
    if (!conditions.daysOfWeek.includes(context.dayOfWeek)) return false;
  }

  // Check time slots
  if (conditions.timeSlots && conditions.timeSlots.length > 0 && context.startTime) {
    const inAnySlot = conditions.timeSlots.some(
      (slot) => context.startTime! >= slot.startTime && context.startTime! < slot.endTime,
    );
    if (!inAnySlot) return false;
  }

  // Check date range
  if (conditions.dateRange && context.date) {
    if (context.date < conditions.dateRange.start || context.date > conditions.dateRange.end) {
      return false;
    }
  }

  // Check specific dates
  if (conditions.specificDates && conditions.specificDates.length > 0 && context.date) {
    if (!conditions.specificDates.includes(context.date)) return false;
  }

  // Check booking window (last-minute / early-bird)
  if (conditions.bookingWindow && context.hoursUntilBooking != null) {
    const { minHoursBefore, maxHoursBefore } = conditions.bookingWindow;
    if (minHoursBefore != null && context.hoursUntilBooking < minHoursBefore) return false;
    if (maxHoursBefore != null && context.hoursUntilBooking > maxHoursBefore) return false;
  }

  return true;
}

/**
 * Calculate tax from a subtotal using the inclusive or exclusive method.
 *
 * Inclusive: price already contains tax → tax = amount × rate / (100 + rate)
 * Exclusive: tax added on top       → tax = amount × rate / 100
 */
export function calculateTax(
  amount: number,
  taxRate: number,
  mode: 'inclusive' | 'exclusive' = 'exclusive',
  currency: string = 'AED',
): { subtotal: number; taxAmount: number; total: number } {
  if (taxRate <= 0) {
    return { subtotal: amount, taxAmount: 0, total: amount };
  }

  if (mode === 'inclusive') {
    const taxAmount = roundForCurrency((amount * taxRate) / (100 + taxRate), currency);
    const subtotal = roundForCurrency(amount - taxAmount, currency);
    return { subtotal, taxAmount, total: amount };
  }

  const taxAmount = roundForCurrency((amount * taxRate) / 100, currency);
  const total = roundForCurrency(amount + taxAmount, currency);
  return { subtotal: amount, taxAmount, total };
}
