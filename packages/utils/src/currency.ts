const currencyConfig: Record<string, { symbol: string; locale: string; decimals: number }> = {
  IRR: { symbol: 'ریال', locale: 'fa-IR', decimals: 0 },
  IRT: { symbol: 'تومان', locale: 'fa-IR', decimals: 0 },
  USD: { symbol: '$', locale: 'en-US', decimals: 2 },
  EUR: { symbol: '€', locale: 'en-US', decimals: 2 },
};

export function formatCurrency(
  amount: number,
  currency: string = 'IRT',
  locale: 'fa' | 'en' = 'fa',
): string {
  const config = currencyConfig[currency] ?? currencyConfig.IRT;
  const formatted = new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  }).format(amount);

  return locale === 'fa'
    ? `${formatted} ${config.symbol}`
    : `${config.symbol}${formatted}`;
}

export function rialToToman(amount: number): number {
  return Math.floor(amount / 10);
}

export function tomanToRial(amount: number): number {
  return amount * 10;
}
