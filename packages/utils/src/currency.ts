/**
 * Currency formatting utilities
 *
 * NOTE: The comprehensive CurrencyConfig and CURRENCY_CONFIGS are in
 * @smartclub/types (packages/types/src/enums/currency.ts).
 * This file provides lightweight formatting for common use cases.
 */

interface CurrencyFormatConfig {
  symbol: string;
  locale: string;
  decimals: number;
  position: 'before' | 'after';
}

const currencyConfig: Record<string, CurrencyFormatConfig> = {
  // Middle East & GCC
  AED: { symbol: 'AED', locale: 'en-AE', decimals: 2, position: 'before' },
  SAR: { symbol: 'SAR', locale: 'en-SA', decimals: 2, position: 'before' },
  QAR: { symbol: 'QAR', locale: 'en-QA', decimals: 2, position: 'before' },
  KWD: { symbol: 'KWD', locale: 'en-KW', decimals: 3, position: 'before' },
  BHD: { symbol: 'BHD', locale: 'en-BH', decimals: 3, position: 'before' },
  OMR: { symbol: 'OMR', locale: 'en-OM', decimals: 3, position: 'before' },
  IRR: { symbol: '﷼', locale: 'fa-IR', decimals: 0, position: 'after' },
  IRT: { symbol: 'تومان', locale: 'fa-IR', decimals: 0, position: 'after' },
  // Major currencies
  USD: { symbol: '$', locale: 'en-US', decimals: 2, position: 'before' },
  EUR: { symbol: '€', locale: 'en-DE', decimals: 2, position: 'after' },
  GBP: { symbol: '£', locale: 'en-GB', decimals: 2, position: 'before' },
};

/**
 * Format a currency amount for display.
 *
 * @param amount - The numeric amount
 * @param currency - ISO 4217 currency code (default: 'AED')
 * @param locale - 'fa' for Persian or 'en' for English (default: 'en')
 *
 * @example
 *   formatCurrency(138, 'AED')        // "AED 138.00"
 *   formatCurrency(138, 'AED', 'fa')  // "۱۳۸٫۰۰ AED"
 *   formatCurrency(1500, 'IRR', 'fa') // "۱٬۵۰۰ ﷼"
 *   formatCurrency(0.750, 'KWD')      // "KWD 0.750"
 */
export function formatCurrency(
  amount: number,
  currency: string = 'AED',
  locale: 'fa' | 'en' = 'en',
): string {
  const config = currencyConfig[currency] ?? { symbol: currency, locale: 'en-US', decimals: 2, position: 'before' };
  const intlLocale = locale === 'fa' ? 'fa-IR' : config.locale;

  const formatted = new Intl.NumberFormat(intlLocale, {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  }).format(amount);

  if (config.position === 'after') {
    return `${formatted} ${config.symbol}`;
  }
  return `${config.symbol} ${formatted}`;
}

export function rialToToman(amount: number): number {
  return Math.floor(amount / 10);
}

export function tomanToRial(amount: number): number {
  return amount * 10;
}
