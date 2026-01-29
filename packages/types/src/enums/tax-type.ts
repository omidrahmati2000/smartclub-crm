/**
 * Types of taxation systems used worldwide
 */
export enum TaxType {
  /** Value Added Tax - Used in EU, Middle East, and many other countries */
  VAT = 'VAT',

  /** Goods & Services Tax - Used in Australia, India, Canada, Singapore */
  GST = 'GST',

  /** Harmonized Sales Tax - Used in some Canadian provinces (combines GST + PST) */
  HST = 'HST',

  /** Provincial Sales Tax - Used in some Canadian provinces */
  PST = 'PST',

  /** Sales Tax - Used in United States (varies by state/city) */
  SALES_TAX = 'SALES_TAX',

  /** Consumption Tax - Used in Japan */
  CONSUMPTION_TAX = 'CONSUMPTION_TAX',

  /** Service Tax - Used in some countries for specific services */
  SERVICE_TAX = 'SERVICE_TAX',

  /** No tax applicable - Used in some free zones or countries without sales tax */
  NONE = 'NONE',
}

/**
 * How tax is displayed to customers
 */
export enum TaxDisplayMode {
  /** Price shown includes tax (common in EU, Australia) */
  INCLUSIVE = 'INCLUSIVE',

  /** Tax is added at checkout (common in US, Canada) */
  EXCLUSIVE = 'EXCLUSIVE',
}

/**
 * Reasons for tax exemption
 */
export enum TaxExemptionReason {
  /** Educational institutions or activities */
  EDUCATIONAL = 'EDUCATIONAL',

  /** Non-profit organizations */
  NON_PROFIT = 'NON_PROFIT',

  /** Government entities */
  GOVERNMENT = 'GOVERNMENT',

  /** Youth sports programs */
  YOUTH_SPORTS = 'YOUTH_SPORTS',

  /** Disabled access services */
  DISABLED_ACCESS = 'DISABLED_ACCESS',

  /** Medical or therapeutic services */
  MEDICAL = 'MEDICAL',

  /** Diplomatic exemption */
  DIPLOMATIC = 'DIPLOMATIC',

  /** Reseller/B2B exemption */
  RESELLER = 'RESELLER',

  /** Export services (zero-rated) */
  EXPORT = 'EXPORT',

  /** Other documented exemption */
  OTHER = 'OTHER',
}

/**
 * Tax category for different rate tiers
 */
export enum TaxCategory {
  /** Standard rate */
  STANDARD = 'STANDARD',

  /** Reduced rate (common in EU for certain goods/services) */
  REDUCED = 'REDUCED',

  /** Super-reduced rate (some EU countries) */
  SUPER_REDUCED = 'SUPER_REDUCED',

  /** Zero rate (taxable but at 0%) */
  ZERO = 'ZERO',

  /** Exempt (not subject to tax) */
  EXEMPT = 'EXEMPT',
}

/**
 * Mapping of TaxType to common display labels
 */
export const TAX_TYPE_LABELS: Record<TaxType, { en: string; short: string }> = {
  [TaxType.VAT]: { en: 'Value Added Tax', short: 'VAT' },
  [TaxType.GST]: { en: 'Goods & Services Tax', short: 'GST' },
  [TaxType.HST]: { en: 'Harmonized Sales Tax', short: 'HST' },
  [TaxType.PST]: { en: 'Provincial Sales Tax', short: 'PST' },
  [TaxType.SALES_TAX]: { en: 'Sales Tax', short: 'Tax' },
  [TaxType.CONSUMPTION_TAX]: { en: 'Consumption Tax', short: 'Tax' },
  [TaxType.SERVICE_TAX]: { en: 'Service Tax', short: 'Tax' },
  [TaxType.NONE]: { en: 'No Tax', short: '-' },
};

/**
 * Tax ID label by tax type
 */
export const TAX_ID_LABELS: Record<TaxType, string> = {
  [TaxType.VAT]: 'VAT Number',
  [TaxType.GST]: 'GST Number',
  [TaxType.HST]: 'HST Number',
  [TaxType.PST]: 'PST Number',
  [TaxType.SALES_TAX]: 'Tax ID',
  [TaxType.CONSUMPTION_TAX]: 'Tax Registration Number',
  [TaxType.SERVICE_TAX]: 'Service Tax Number',
  [TaxType.NONE]: 'Business Registration Number',
};
