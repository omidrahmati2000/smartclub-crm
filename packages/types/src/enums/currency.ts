/**
 * ISO 4217 currency codes
 * Comprehensive list for global payment support
 */
export enum Currency {
  // Middle East
  IRR = 'IRR', // Iranian Rial
  IRT = 'IRT', // Iranian Toman (non-ISO, 1 IRT = 10 IRR, commonly used)
  AED = 'AED', // UAE Dirham
  SAR = 'SAR', // Saudi Riyal
  QAR = 'QAR', // Qatari Riyal
  KWD = 'KWD', // Kuwaiti Dinar
  BHD = 'BHD', // Bahraini Dinar
  OMR = 'OMR', // Omani Rial
  TRY = 'TRY', // Turkish Lira
  JOD = 'JOD', // Jordanian Dinar
  LBP = 'LBP', // Lebanese Pound
  IQD = 'IQD', // Iraqi Dinar
  EGP = 'EGP', // Egyptian Pound

  // Major World Currencies
  USD = 'USD', // US Dollar
  EUR = 'EUR', // Euro
  GBP = 'GBP', // British Pound Sterling
  CHF = 'CHF', // Swiss Franc
  CAD = 'CAD', // Canadian Dollar
  AUD = 'AUD', // Australian Dollar
  JPY = 'JPY', // Japanese Yen
  CNY = 'CNY', // Chinese Yuan
  KRW = 'KRW', // South Korean Won

  // Other Currencies
  INR = 'INR', // Indian Rupee
  SGD = 'SGD', // Singapore Dollar
  MYR = 'MYR', // Malaysian Ringgit
  IDR = 'IDR', // Indonesian Rupiah
  THB = 'THB', // Thai Baht
  VND = 'VND', // Vietnamese Dong
  PHP = 'PHP', // Philippine Peso
  BRL = 'BRL', // Brazilian Real
  MXN = 'MXN', // Mexican Peso
  ARS = 'ARS', // Argentine Peso
  CLP = 'CLP', // Chilean Peso
  COP = 'COP', // Colombian Peso
  ZAR = 'ZAR', // South African Rand
  MAD = 'MAD', // Moroccan Dirham
  PLN = 'PLN', // Polish Zloty
  CZK = 'CZK', // Czech Koruna
  SEK = 'SEK', // Swedish Krona
  NOK = 'NOK', // Norwegian Krone
  DKK = 'DKK', // Danish Krone
}

/**
 * Currency display configuration
 */
export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  symbolNative: string; // Native currency symbol
  name: string;
  namePlural: string;
  symbolPosition: 'before' | 'after';
  decimalPlaces: number;
  thousandsSeparator: ',' | '.' | ' ' | "'";
  decimalSeparator: '.' | ',';
  // For currencies like IRT where display differs from ISO
  displayMultiplier?: number;
}

/**
 * Currency configurations for formatting
 */
export const CURRENCY_CONFIGS: Record<Currency, CurrencyConfig> = {
  // Middle East
  [Currency.IRR]: {
    code: Currency.IRR,
    symbol: 'IRR',
    symbolNative: '﷼',
    name: 'Iranian Rial',
    namePlural: 'Iranian Rials',
    symbolPosition: 'after',
    decimalPlaces: 0,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  [Currency.IRT]: {
    code: Currency.IRT,
    symbol: 'T',
    symbolNative: 'تومان',
    name: 'Iranian Toman',
    namePlural: 'Iranian Tomans',
    symbolPosition: 'after',
    decimalPlaces: 0,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  [Currency.AED]: {
    code: Currency.AED,
    symbol: 'AED',
    symbolNative: 'د.إ',
    name: 'UAE Dirham',
    namePlural: 'UAE Dirhams',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  [Currency.SAR]: {
    code: Currency.SAR,
    symbol: 'SAR',
    symbolNative: 'ر.س',
    name: 'Saudi Riyal',
    namePlural: 'Saudi Riyals',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  [Currency.QAR]: {
    code: Currency.QAR,
    symbol: 'QAR',
    symbolNative: 'ر.ق',
    name: 'Qatari Riyal',
    namePlural: 'Qatari Riyals',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  [Currency.KWD]: {
    code: Currency.KWD,
    symbol: 'KWD',
    symbolNative: 'د.ك',
    name: 'Kuwaiti Dinar',
    namePlural: 'Kuwaiti Dinars',
    symbolPosition: 'before',
    decimalPlaces: 3,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  [Currency.BHD]: {
    code: Currency.BHD,
    symbol: 'BHD',
    symbolNative: 'د.ب',
    name: 'Bahraini Dinar',
    namePlural: 'Bahraini Dinars',
    symbolPosition: 'before',
    decimalPlaces: 3,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  [Currency.OMR]: {
    code: Currency.OMR,
    symbol: 'OMR',
    symbolNative: 'ر.ع',
    name: 'Omani Rial',
    namePlural: 'Omani Rials',
    symbolPosition: 'before',
    decimalPlaces: 3,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  [Currency.TRY]: {
    code: Currency.TRY,
    symbol: 'TRY',
    symbolNative: '₺',
    name: 'Turkish Lira',
    namePlural: 'Turkish Liras',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandsSeparator: '.',
    decimalSeparator: ',',
  },
  [Currency.JOD]: {
    code: Currency.JOD,
    symbol: 'JOD',
    symbolNative: 'د.أ',
    name: 'Jordanian Dinar',
    namePlural: 'Jordanian Dinars',
    symbolPosition: 'before',
    decimalPlaces: 3,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  [Currency.LBP]: {
    code: Currency.LBP,
    symbol: 'LBP',
    symbolNative: 'ل.ل',
    name: 'Lebanese Pound',
    namePlural: 'Lebanese Pounds',
    symbolPosition: 'before',
    decimalPlaces: 0,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  [Currency.IQD]: {
    code: Currency.IQD,
    symbol: 'IQD',
    symbolNative: 'ع.د',
    name: 'Iraqi Dinar',
    namePlural: 'Iraqi Dinars',
    symbolPosition: 'before',
    decimalPlaces: 0,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  [Currency.EGP]: {
    code: Currency.EGP,
    symbol: 'EGP',
    symbolNative: 'ج.م',
    name: 'Egyptian Pound',
    namePlural: 'Egyptian Pounds',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },

  // Major World Currencies
  [Currency.USD]: {
    code: Currency.USD,
    symbol: '$',
    symbolNative: '$',
    name: 'US Dollar',
    namePlural: 'US Dollars',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  [Currency.EUR]: {
    code: Currency.EUR,
    symbol: '€',
    symbolNative: '€',
    name: 'Euro',
    namePlural: 'Euros',
    symbolPosition: 'after',
    decimalPlaces: 2,
    thousandsSeparator: '.',
    decimalSeparator: ',',
  },
  [Currency.GBP]: {
    code: Currency.GBP,
    symbol: '£',
    symbolNative: '£',
    name: 'British Pound',
    namePlural: 'British Pounds',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  [Currency.CHF]: {
    code: Currency.CHF,
    symbol: 'CHF',
    symbolNative: 'CHF',
    name: 'Swiss Franc',
    namePlural: 'Swiss Francs',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandsSeparator: "'",
    decimalSeparator: '.',
  },
  [Currency.CAD]: {
    code: Currency.CAD,
    symbol: 'CA$',
    symbolNative: '$',
    name: 'Canadian Dollar',
    namePlural: 'Canadian Dollars',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  [Currency.AUD]: {
    code: Currency.AUD,
    symbol: 'A$',
    symbolNative: '$',
    name: 'Australian Dollar',
    namePlural: 'Australian Dollars',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  [Currency.JPY]: {
    code: Currency.JPY,
    symbol: '¥',
    symbolNative: '¥',
    name: 'Japanese Yen',
    namePlural: 'Japanese Yen',
    symbolPosition: 'before',
    decimalPlaces: 0,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  [Currency.CNY]: {
    code: Currency.CNY,
    symbol: 'CN¥',
    symbolNative: '¥',
    name: 'Chinese Yuan',
    namePlural: 'Chinese Yuan',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  [Currency.KRW]: {
    code: Currency.KRW,
    symbol: '₩',
    symbolNative: '₩',
    name: 'South Korean Won',
    namePlural: 'South Korean Won',
    symbolPosition: 'before',
    decimalPlaces: 0,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },

  // Other Currencies
  [Currency.INR]: {
    code: Currency.INR,
    symbol: '₹',
    symbolNative: '₹',
    name: 'Indian Rupee',
    namePlural: 'Indian Rupees',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  [Currency.SGD]: {
    code: Currency.SGD,
    symbol: 'S$',
    symbolNative: '$',
    name: 'Singapore Dollar',
    namePlural: 'Singapore Dollars',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  [Currency.MYR]: {
    code: Currency.MYR,
    symbol: 'RM',
    symbolNative: 'RM',
    name: 'Malaysian Ringgit',
    namePlural: 'Malaysian Ringgits',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  [Currency.IDR]: {
    code: Currency.IDR,
    symbol: 'Rp',
    symbolNative: 'Rp',
    name: 'Indonesian Rupiah',
    namePlural: 'Indonesian Rupiahs',
    symbolPosition: 'before',
    decimalPlaces: 0,
    thousandsSeparator: '.',
    decimalSeparator: ',',
  },
  [Currency.THB]: {
    code: Currency.THB,
    symbol: '฿',
    symbolNative: '฿',
    name: 'Thai Baht',
    namePlural: 'Thai Baht',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  [Currency.VND]: {
    code: Currency.VND,
    symbol: '₫',
    symbolNative: '₫',
    name: 'Vietnamese Dong',
    namePlural: 'Vietnamese Dong',
    symbolPosition: 'after',
    decimalPlaces: 0,
    thousandsSeparator: '.',
    decimalSeparator: ',',
  },
  [Currency.PHP]: {
    code: Currency.PHP,
    symbol: '₱',
    symbolNative: '₱',
    name: 'Philippine Peso',
    namePlural: 'Philippine Pesos',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  [Currency.BRL]: {
    code: Currency.BRL,
    symbol: 'R$',
    symbolNative: 'R$',
    name: 'Brazilian Real',
    namePlural: 'Brazilian Reais',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandsSeparator: '.',
    decimalSeparator: ',',
  },
  [Currency.MXN]: {
    code: Currency.MXN,
    symbol: 'MX$',
    symbolNative: '$',
    name: 'Mexican Peso',
    namePlural: 'Mexican Pesos',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  [Currency.ARS]: {
    code: Currency.ARS,
    symbol: 'AR$',
    symbolNative: '$',
    name: 'Argentine Peso',
    namePlural: 'Argentine Pesos',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandsSeparator: '.',
    decimalSeparator: ',',
  },
  [Currency.CLP]: {
    code: Currency.CLP,
    symbol: 'CL$',
    symbolNative: '$',
    name: 'Chilean Peso',
    namePlural: 'Chilean Pesos',
    symbolPosition: 'before',
    decimalPlaces: 0,
    thousandsSeparator: '.',
    decimalSeparator: ',',
  },
  [Currency.COP]: {
    code: Currency.COP,
    symbol: 'CO$',
    symbolNative: '$',
    name: 'Colombian Peso',
    namePlural: 'Colombian Pesos',
    symbolPosition: 'before',
    decimalPlaces: 0,
    thousandsSeparator: '.',
    decimalSeparator: ',',
  },
  [Currency.ZAR]: {
    code: Currency.ZAR,
    symbol: 'R',
    symbolNative: 'R',
    name: 'South African Rand',
    namePlural: 'South African Rand',
    symbolPosition: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ' ',
    decimalSeparator: ',',
  },
  [Currency.MAD]: {
    code: Currency.MAD,
    symbol: 'MAD',
    symbolNative: 'د.م.',
    name: 'Moroccan Dirham',
    namePlural: 'Moroccan Dirhams',
    symbolPosition: 'after',
    decimalPlaces: 2,
    thousandsSeparator: ' ',
    decimalSeparator: ',',
  },
  [Currency.PLN]: {
    code: Currency.PLN,
    symbol: 'zł',
    symbolNative: 'zł',
    name: 'Polish Zloty',
    namePlural: 'Polish Zlotys',
    symbolPosition: 'after',
    decimalPlaces: 2,
    thousandsSeparator: ' ',
    decimalSeparator: ',',
  },
  [Currency.CZK]: {
    code: Currency.CZK,
    symbol: 'Kč',
    symbolNative: 'Kč',
    name: 'Czech Koruna',
    namePlural: 'Czech Korunas',
    symbolPosition: 'after',
    decimalPlaces: 2,
    thousandsSeparator: ' ',
    decimalSeparator: ',',
  },
  [Currency.SEK]: {
    code: Currency.SEK,
    symbol: 'kr',
    symbolNative: 'kr',
    name: 'Swedish Krona',
    namePlural: 'Swedish Kronor',
    symbolPosition: 'after',
    decimalPlaces: 2,
    thousandsSeparator: ' ',
    decimalSeparator: ',',
  },
  [Currency.NOK]: {
    code: Currency.NOK,
    symbol: 'kr',
    symbolNative: 'kr',
    name: 'Norwegian Krone',
    namePlural: 'Norwegian Kroner',
    symbolPosition: 'after',
    decimalPlaces: 2,
    thousandsSeparator: ' ',
    decimalSeparator: ',',
  },
  [Currency.DKK]: {
    code: Currency.DKK,
    symbol: 'kr',
    symbolNative: 'kr',
    name: 'Danish Krone',
    namePlural: 'Danish Kroner',
    symbolPosition: 'after',
    decimalPlaces: 2,
    thousandsSeparator: '.',
    decimalSeparator: ',',
  },
};

/**
 * Format a currency amount according to its configuration
 */
export function formatCurrency(
  amount: number,
  currency: Currency,
  options?: { useNativeSymbol?: boolean }
): string {
  const config = CURRENCY_CONFIGS[currency];
  const symbol = options?.useNativeSymbol ? config.symbolNative : config.symbol;

  // Format the number
  const formattedNumber = amount
    .toFixed(config.decimalPlaces)
    .replace('.', config.decimalSeparator)
    .replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandsSeparator);

  // Add symbol
  return config.symbolPosition === 'before'
    ? `${symbol}${formattedNumber}`
    : `${formattedNumber} ${symbol}`;
}

/**
 * Get currency configuration
 */
export function getCurrencyConfig(currency: Currency): CurrencyConfig {
  return CURRENCY_CONFIGS[currency];
}
