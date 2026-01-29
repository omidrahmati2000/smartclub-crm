import { Country } from '../enums/country';

/**
 * Extended venue location with full address details
 */
export interface VenueLocation {
  /** Primary address line (street address) */
  addressLine1: string;

  /** Secondary address line (apt, suite, unit, building, floor, etc.) */
  addressLine2?: string;

  /** City name */
  city: string;

  /** State, province, region, or similar subdivision */
  state?: string;

  /** Postal/ZIP code */
  postalCode?: string;

  /** ISO 3166-1 alpha-2 country code */
  country: Country;

  /** Latitude coordinate */
  latitude: number;

  /** Longitude coordinate */
  longitude: number;

  /** IANA timezone identifier (e.g., 'Asia/Tehran', 'Europe/Berlin') */
  timezone: string;

  /** Pre-formatted address for display (generated) */
  formattedAddress?: string;
}

/**
 * State or province within a country
 */
export interface StateProvince {
  /** State/province code (e.g., 'CA', 'TEH', 'NSW') */
  code: string;

  /** State/province name in English */
  name: string;

  /** State/province name in local language */
  nameLocal?: string;

  /** Country this state belongs to */
  countryCode: Country;

  /** Default timezone for this state */
  timezone?: string;
}

/**
 * Postal code validation configuration per country
 */
export interface PostalCodeConfig {
  /** Country code */
  countryCode: Country;

  /** Regex pattern for validation */
  pattern: RegExp;

  /** Example format for user guidance */
  example: string;

  /** Whether postal code is required for this country */
  required: boolean;

  /** Label to use (ZIP Code, Postal Code, Postcode, etc.) */
  label: string;
}

/**
 * City with metadata for autocomplete
 */
export interface City {
  /** Unique identifier */
  id: string;

  /** City name in English */
  name: string;

  /** City name in local language */
  nameLocal?: string;

  /** State/province code if applicable */
  state?: string;

  /** Country code */
  countryCode: Country;

  /** IANA timezone */
  timezone: string;

  /** Approximate center coordinates */
  latitude: number;
  longitude: number;

  /** Population (for sorting/relevance) */
  population?: number;
}

/**
 * Country metadata for UI display
 */
export interface CountryInfo {
  /** ISO 3166-1 alpha-2 code */
  code: Country;

  /** Country name in English */
  name: string;

  /** Country name in local language */
  nameLocal?: string;

  /** Country names in supported languages */
  names: {
    en: string;
    fa?: string;
    ar?: string;
  };

  /** Flag emoji */
  flag: string;

  /** International dial code (e.g., '+98', '+1') */
  dialCode: string;

  /** Whether states/provinces are used */
  hasStates: boolean;

  /** Label for state subdivision (State, Province, Region, etc.) */
  stateLabel?: string;

  /** Default timezone */
  defaultTimezone: string;

  /** Postal code configuration */
  postalCode: {
    required: boolean;
    label: string;
    pattern: string;
    example: string;
  };

  /** Address format template */
  addressFormat: string;

  /** Geographic region for grouping */
  region: 'middle_east' | 'europe' | 'americas' | 'asia_pacific' | 'africa';
}

/**
 * Postal code configurations for supported countries
 */
export const POSTAL_CODE_CONFIGS: Record<Country, PostalCodeConfig> = {
  // Middle East
  [Country.IR]: {
    countryCode: Country.IR,
    pattern: /^\d{10}$/,
    example: '1234567890',
    required: true,
    label: 'Postal Code',
  },
  [Country.AE]: {
    countryCode: Country.AE,
    pattern: /^[0-9]{5,6}$/,
    example: '00000',
    required: false,
    label: 'P.O. Box',
  },
  [Country.SA]: {
    countryCode: Country.SA,
    pattern: /^\d{5}(-\d{4})?$/,
    example: '12345',
    required: false,
    label: 'Postal Code',
  },
  [Country.QA]: {
    countryCode: Country.QA,
    pattern: /^.*$/,
    example: '',
    required: false,
    label: 'P.O. Box',
  },
  [Country.KW]: {
    countryCode: Country.KW,
    pattern: /^\d{5}$/,
    example: '12345',
    required: false,
    label: 'Postal Code',
  },
  [Country.BH]: {
    countryCode: Country.BH,
    pattern: /^\d{3,4}$/,
    example: '1234',
    required: false,
    label: 'Postal Code',
  },
  [Country.OM]: {
    countryCode: Country.OM,
    pattern: /^\d{3}$/,
    example: '123',
    required: false,
    label: 'Postal Code',
  },
  [Country.TR]: {
    countryCode: Country.TR,
    pattern: /^\d{5}$/,
    example: '34000',
    required: true,
    label: 'Postal Code',
  },
  [Country.JO]: {
    countryCode: Country.JO,
    pattern: /^\d{5}$/,
    example: '11937',
    required: false,
    label: 'Postal Code',
  },
  [Country.LB]: {
    countryCode: Country.LB,
    pattern: /^\d{4}(\s?\d{4})?$/,
    example: '1234 5678',
    required: false,
    label: 'Postal Code',
  },
  [Country.IQ]: {
    countryCode: Country.IQ,
    pattern: /^\d{5}$/,
    example: '10001',
    required: false,
    label: 'Postal Code',
  },
  [Country.EG]: {
    countryCode: Country.EG,
    pattern: /^\d{5}$/,
    example: '12345',
    required: false,
    label: 'Postal Code',
  },

  // Europe
  [Country.DE]: {
    countryCode: Country.DE,
    pattern: /^\d{5}$/,
    example: '10115',
    required: true,
    label: 'PLZ',
  },
  [Country.FR]: {
    countryCode: Country.FR,
    pattern: /^\d{5}$/,
    example: '75001',
    required: true,
    label: 'Code Postal',
  },
  [Country.GB]: {
    countryCode: Country.GB,
    pattern: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
    example: 'SW1A 1AA',
    required: true,
    label: 'Postcode',
  },
  [Country.ES]: {
    countryCode: Country.ES,
    pattern: /^\d{5}$/,
    example: '28001',
    required: true,
    label: 'Código Postal',
  },
  [Country.IT]: {
    countryCode: Country.IT,
    pattern: /^\d{5}$/,
    example: '00100',
    required: true,
    label: 'CAP',
  },
  [Country.NL]: {
    countryCode: Country.NL,
    pattern: /^\d{4}\s?[A-Z]{2}$/i,
    example: '1012 AB',
    required: true,
    label: 'Postcode',
  },
  [Country.BE]: {
    countryCode: Country.BE,
    pattern: /^\d{4}$/,
    example: '1000',
    required: true,
    label: 'Code Postal',
  },
  [Country.AT]: {
    countryCode: Country.AT,
    pattern: /^\d{4}$/,
    example: '1010',
    required: true,
    label: 'PLZ',
  },
  [Country.SE]: {
    countryCode: Country.SE,
    pattern: /^\d{3}\s?\d{2}$/,
    example: '111 22',
    required: true,
    label: 'Postnummer',
  },
  [Country.PT]: {
    countryCode: Country.PT,
    pattern: /^\d{4}-\d{3}$/,
    example: '1000-001',
    required: true,
    label: 'Código Postal',
  },
  [Country.CH]: {
    countryCode: Country.CH,
    pattern: /^\d{4}$/,
    example: '8001',
    required: true,
    label: 'PLZ/NPA',
  },
  [Country.PL]: {
    countryCode: Country.PL,
    pattern: /^\d{2}-\d{3}$/,
    example: '00-001',
    required: true,
    label: 'Kod Pocztowy',
  },
  [Country.CZ]: {
    countryCode: Country.CZ,
    pattern: /^\d{3}\s?\d{2}$/,
    example: '110 00',
    required: true,
    label: 'PSČ',
  },
  [Country.GR]: {
    countryCode: Country.GR,
    pattern: /^\d{3}\s?\d{2}$/,
    example: '105 57',
    required: true,
    label: 'Postal Code',
  },
  [Country.DK]: {
    countryCode: Country.DK,
    pattern: /^\d{4}$/,
    example: '1000',
    required: true,
    label: 'Postnummer',
  },
  [Country.NO]: {
    countryCode: Country.NO,
    pattern: /^\d{4}$/,
    example: '0001',
    required: true,
    label: 'Postnummer',
  },
  [Country.FI]: {
    countryCode: Country.FI,
    pattern: /^\d{5}$/,
    example: '00100',
    required: true,
    label: 'Postinumero',
  },
  [Country.IE]: {
    countryCode: Country.IE,
    pattern: /^[A-Z]\d{2}\s?[A-Z\d]{4}$/i,
    example: 'D02 Y006',
    required: true,
    label: 'Eircode',
  },

  // Americas
  [Country.US]: {
    countryCode: Country.US,
    pattern: /^\d{5}(-\d{4})?$/,
    example: '10001',
    required: true,
    label: 'ZIP Code',
  },
  [Country.CA]: {
    countryCode: Country.CA,
    pattern: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
    example: 'K1A 0B1',
    required: true,
    label: 'Postal Code',
  },
  [Country.MX]: {
    countryCode: Country.MX,
    pattern: /^\d{5}$/,
    example: '06600',
    required: true,
    label: 'Código Postal',
  },
  [Country.BR]: {
    countryCode: Country.BR,
    pattern: /^\d{5}-?\d{3}$/,
    example: '01310-100',
    required: true,
    label: 'CEP',
  },
  [Country.AR]: {
    countryCode: Country.AR,
    pattern: /^[A-Z]\d{4}[A-Z]{3}$/i,
    example: 'C1425ABC',
    required: true,
    label: 'CPA',
  },
  [Country.CL]: {
    countryCode: Country.CL,
    pattern: /^\d{7}$/,
    example: '8320000',
    required: false,
    label: 'Código Postal',
  },
  [Country.CO]: {
    countryCode: Country.CO,
    pattern: /^\d{6}$/,
    example: '110111',
    required: false,
    label: 'Código Postal',
  },

  // Asia Pacific
  [Country.AU]: {
    countryCode: Country.AU,
    pattern: /^\d{4}$/,
    example: '2000',
    required: true,
    label: 'Postcode',
  },
  [Country.IN]: {
    countryCode: Country.IN,
    pattern: /^\d{6}$/,
    example: '110001',
    required: true,
    label: 'PIN Code',
  },
  [Country.SG]: {
    countryCode: Country.SG,
    pattern: /^\d{6}$/,
    example: '018956',
    required: true,
    label: 'Postal Code',
  },
  [Country.MY]: {
    countryCode: Country.MY,
    pattern: /^\d{5}$/,
    example: '50000',
    required: true,
    label: 'Postcode',
  },
  [Country.ID]: {
    countryCode: Country.ID,
    pattern: /^\d{5}$/,
    example: '10110',
    required: false,
    label: 'Kode Pos',
  },
  [Country.TH]: {
    countryCode: Country.TH,
    pattern: /^\d{5}$/,
    example: '10100',
    required: true,
    label: 'Postal Code',
  },
  [Country.VN]: {
    countryCode: Country.VN,
    pattern: /^\d{6}$/,
    example: '100000',
    required: false,
    label: 'Postal Code',
  },
  [Country.PH]: {
    countryCode: Country.PH,
    pattern: /^\d{4}$/,
    example: '1000',
    required: true,
    label: 'ZIP Code',
  },
  [Country.JP]: {
    countryCode: Country.JP,
    pattern: /^\d{3}-?\d{4}$/,
    example: '100-0001',
    required: true,
    label: 'Postal Code',
  },
  [Country.KR]: {
    countryCode: Country.KR,
    pattern: /^\d{5}$/,
    example: '03051',
    required: true,
    label: 'Postal Code',
  },
  [Country.CN]: {
    countryCode: Country.CN,
    pattern: /^\d{6}$/,
    example: '100000',
    required: true,
    label: 'Postal Code',
  },

  // Africa
  [Country.ZA]: {
    countryCode: Country.ZA,
    pattern: /^\d{4}$/,
    example: '2000',
    required: true,
    label: 'Postal Code',
  },
  [Country.MA]: {
    countryCode: Country.MA,
    pattern: /^\d{5}$/,
    example: '10000',
    required: false,
    label: 'Code Postal',
  },
};

/**
 * Validate a postal code against country-specific rules
 */
export function validatePostalCode(
  postalCode: string,
  country: Country
): boolean {
  const config = POSTAL_CODE_CONFIGS[country];
  if (!config) return true; // Unknown country, skip validation

  if (!config.required && !postalCode) return true;
  if (config.required && !postalCode) return false;

  return config.pattern.test(postalCode);
}

/**
 * Format an address according to country conventions
 */
export function formatAddress(location: VenueLocation): string {
  const parts: string[] = [];

  if (location.addressLine1) parts.push(location.addressLine1);
  if (location.addressLine2) parts.push(location.addressLine2);

  // City, State format varies by country
  if (location.state) {
    parts.push(`${location.city}, ${location.state}`);
  } else {
    parts.push(location.city);
  }

  if (location.postalCode) parts.push(location.postalCode);

  return parts.join(', ');
}
