/**
 * ISO 3166-1 alpha-2 country codes
 * Comprehensive list for global leisure platform support
 */
export enum Country {
  // Middle East
  IR = 'IR', // Iran
  AE = 'AE', // United Arab Emirates
  SA = 'SA', // Saudi Arabia
  QA = 'QA', // Qatar
  KW = 'KW', // Kuwait
  BH = 'BH', // Bahrain
  OM = 'OM', // Oman
  TR = 'TR', // Turkey
  JO = 'JO', // Jordan
  LB = 'LB', // Lebanon
  IQ = 'IQ', // Iraq
  EG = 'EG', // Egypt

  // Europe (GDPR applies)
  DE = 'DE', // Germany
  FR = 'FR', // France
  GB = 'GB', // United Kingdom
  ES = 'ES', // Spain
  IT = 'IT', // Italy
  NL = 'NL', // Netherlands
  BE = 'BE', // Belgium
  AT = 'AT', // Austria
  SE = 'SE', // Sweden
  PT = 'PT', // Portugal
  CH = 'CH', // Switzerland
  PL = 'PL', // Poland
  CZ = 'CZ', // Czech Republic
  GR = 'GR', // Greece
  DK = 'DK', // Denmark
  NO = 'NO', // Norway
  FI = 'FI', // Finland
  IE = 'IE', // Ireland

  // Americas
  US = 'US', // United States
  CA = 'CA', // Canada
  MX = 'MX', // Mexico
  BR = 'BR', // Brazil
  AR = 'AR', // Argentina
  CL = 'CL', // Chile
  CO = 'CO', // Colombia

  // Asia Pacific
  AU = 'AU', // Australia
  IN = 'IN', // India
  SG = 'SG', // Singapore
  MY = 'MY', // Malaysia
  ID = 'ID', // Indonesia
  TH = 'TH', // Thailand
  VN = 'VN', // Vietnam
  PH = 'PH', // Philippines
  JP = 'JP', // Japan
  KR = 'KR', // South Korea
  CN = 'CN', // China

  // Africa
  ZA = 'ZA', // South Africa
  MA = 'MA', // Morocco
}

/**
 * EU member states - GDPR applies
 */
export const EU_COUNTRIES: Country[] = [
  Country.DE,
  Country.FR,
  Country.ES,
  Country.IT,
  Country.NL,
  Country.BE,
  Country.AT,
  Country.SE,
  Country.PT,
  Country.PL,
  Country.CZ,
  Country.GR,
  Country.DK,
  Country.FI,
  Country.IE,
];

/**
 * EEA countries (EU + Norway, Iceland, Liechtenstein) - GDPR applies
 * Note: UK left EU but has its own UK GDPR
 */
export const EEA_COUNTRIES: Country[] = [...EU_COUNTRIES, Country.NO];

/**
 * Countries requiring GDPR-like compliance (EU/EEA + UK + Switzerland)
 */
export const GDPR_COUNTRIES: Country[] = [
  ...EEA_COUNTRIES,
  Country.GB, // UK GDPR
  Country.CH, // Swiss FADP (similar to GDPR)
];

/**
 * Countries that require state/province selection
 */
export const COUNTRIES_WITH_STATES: Country[] = [
  Country.US,
  Country.CA,
  Country.AU,
  Country.IN,
  Country.BR,
  Country.MX,
  Country.DE, // Bundesländer
  Country.AT, // Bundesländer
  Country.CH, // Cantons
  Country.ES, // Autonomous communities
  Country.IT, // Regions
  Country.IR, // Ostans (provinces)
];

/**
 * Countries with state-level tax systems
 */
export const STATE_LEVEL_TAX_COUNTRIES: Country[] = [
  Country.US, // State sales tax
  Country.CA, // PST/HST varies by province
  Country.IN, // GST varies by state
  Country.BR, // ICMS varies by state
];

/**
 * Check if a country is in the EU
 */
export function isEUCountry(country: Country): boolean {
  return EU_COUNTRIES.includes(country);
}

/**
 * Check if GDPR compliance is required for a country
 */
export function isGDPRRequired(country: Country): boolean {
  return GDPR_COUNTRIES.includes(country);
}

/**
 * Check if state/province selection is required for a country
 */
export function requiresStateSelection(country: Country): boolean {
  return COUNTRIES_WITH_STATES.includes(country);
}

/**
 * Check if country has state-level taxation
 */
export function hasStateLevelTax(country: Country): boolean {
  return STATE_LEVEL_TAX_COUNTRIES.includes(country);
}
