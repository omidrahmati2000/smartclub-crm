import {
  TaxType,
  TaxDisplayMode,
  TaxExemptionReason,
  TaxCategory,
} from '../enums/tax-type';
import { Country } from '../enums/country';

/**
 * Venue-specific tax configuration
 */
export interface VenueTaxSettings {
  /** Unique identifier */
  id: string;

  /** Venue this settings belongs to */
  venueId: string;

  /** Whether tax collection is enabled */
  taxEnabled: boolean;

  /** Type of tax system */
  taxType: TaxType;

  /** Tax identification number (VAT number, GST number, etc.) */
  taxIdNumber?: string;

  /** Custom label for tax ID (auto-filled based on tax type) */
  taxIdLabel?: string;

  /** Default tax rate percentage (e.g., 20 for 20%) */
  defaultTaxRate: number;

  /** Tax rate categories for different service types */
  taxRateCategories?: TaxRateCategory[];

  /** How prices are displayed to customers */
  displayMode: TaxDisplayMode;

  /** Show tax breakdown on receipts/invoices */
  showTaxBreakdown: boolean;

  /** Tax exemption rules */
  exemptions: VenueTaxExemption[];

  /** Invoice/receipt customization */
  invoiceSettings?: TaxInvoiceSettings;

  /** Last updated timestamp */
  updatedAt: string;

  /** User who last updated */
  updatedBy: string;
}

/**
 * Tax rate category for different rates within a venue
 */
export interface TaxRateCategory {
  /** Unique identifier */
  id: string;

  /** Category name (e.g., 'Standard', 'Reduced', 'Zero-rated') */
  name: string;

  /** Tax rate percentage */
  rate: number;

  /** Category type */
  category: TaxCategory;

  /** Description of what this rate applies to */
  description?: string;

  /** Asset IDs this rate applies to (empty = all) */
  appliesToAssets?: string[];

  /** Sport types this rate applies to (empty = all) */
  appliesToSportTypes?: string[];

  /** Is this the default rate for the venue */
  isDefault: boolean;
}

/**
 * Tax exemption rule for a venue
 */
export interface VenueTaxExemption {
  /** Unique identifier */
  id: string;

  /** Exemption reason category */
  reason: TaxExemptionReason;

  /** Human-readable description */
  description: string;

  /** Whether documentation is required */
  documentRequired: boolean;

  /** What the exemption applies to */
  appliesTo: 'customer_type' | 'booking_type' | 'asset_type' | 'time_based';

  /** Conditions for the exemption */
  conditions: TaxExemptionCondition;

  /** Whether this exemption is currently active */
  isActive: boolean;
}

/**
 * Conditions for applying a tax exemption
 */
export interface TaxExemptionCondition {
  /** Customer types eligible (if appliesTo = 'customer_type') */
  customerTypes?: string[];

  /** Booking types eligible (if appliesTo = 'booking_type') */
  bookingTypes?: string[];

  /** Asset IDs eligible (if appliesTo = 'asset_type') */
  assetIds?: string[];

  /** Time ranges for exemption (if appliesTo = 'time_based') */
  timeRanges?: {
    startTime: string;
    endTime: string;
    daysOfWeek?: number[];
  }[];

  /** Minimum age for exemption (e.g., seniors) */
  minAge?: number;

  /** Maximum age for exemption (e.g., youth) */
  maxAge?: number;

  /** Required membership level */
  membershipLevel?: string;
}

/**
 * Invoice/receipt settings for tax display
 */
export interface TaxInvoiceSettings {
  /** Invoice number prefix */
  invoicePrefix?: string;

  /** Show tax amount on receipts */
  showTaxOnReceipts: boolean;

  /** Legal notice text (required in some jurisdictions) */
  legalNotice?: string;

  /** Footer text for invoices */
  footerText?: string;

  /** Company registration info to display */
  companyInfo?: {
    name: string;
    registrationNumber?: string;
    address?: string;
  };
}

/**
 * Country-specific tax configuration
 */
export interface CountryTaxConfig {
  /** Country code */
  country: Country;

  /** Default tax type for this country */
  taxType: TaxType;

  /** Standard tax rate */
  standardRate: number;

  /** Available reduced rates */
  reducedRates?: number[];

  /** Tax ID format description */
  taxIdFormat?: string;

  /** Tax ID validation pattern */
  taxIdPattern?: RegExp;

  /** Label for tax ID field */
  taxIdLabel: string;

  /** Whether tax ID is required */
  taxIdRequired: boolean;

  /** Whether state/provincial tax applies */
  hasStateLevelTax: boolean;

  /** Default display mode */
  defaultDisplayMode: TaxDisplayMode;

  /** Legal requirements/notes */
  legalNotes?: string;
}

/**
 * Tax calculation result
 */
export interface TaxCalculation {
  /** Subtotal before tax */
  subtotal: number;

  /** Total tax amount */
  taxAmount: number;

  /** Tax breakdown by category */
  taxBreakdown: {
    category: string;
    rate: number;
    amount: number;
  }[];

  /** Total including tax */
  total: number;

  /** Applied exemptions */
  appliedExemptions?: {
    exemptionId: string;
    reason: TaxExemptionReason;
    savedAmount: number;
  }[];

  /** Display strings */
  display: {
    subtotal: string;
    tax: string;
    total: string;
  };
}

/**
 * Country tax configurations
 */
export const COUNTRY_TAX_CONFIGS: Partial<Record<Country, CountryTaxConfig>> = {
  // Iran - No VAT/GST
  [Country.IR]: {
    country: Country.IR,
    taxType: TaxType.NONE,
    standardRate: 0,
    taxIdLabel: 'Economic Code',
    taxIdRequired: false,
    hasStateLevelTax: false,
    defaultDisplayMode: TaxDisplayMode.INCLUSIVE,
  },

  // UAE - 5% VAT
  [Country.AE]: {
    country: Country.AE,
    taxType: TaxType.VAT,
    standardRate: 5,
    taxIdFormat: 'TRN-15 digits',
    taxIdPattern: /^\d{15}$/,
    taxIdLabel: 'Tax Registration Number (TRN)',
    taxIdRequired: true,
    hasStateLevelTax: false,
    defaultDisplayMode: TaxDisplayMode.INCLUSIVE,
  },

  // Saudi Arabia - 15% VAT
  [Country.SA]: {
    country: Country.SA,
    taxType: TaxType.VAT,
    standardRate: 15,
    taxIdFormat: '15 digits',
    taxIdPattern: /^\d{15}$/,
    taxIdLabel: 'VAT Registration Number',
    taxIdRequired: true,
    hasStateLevelTax: false,
    defaultDisplayMode: TaxDisplayMode.INCLUSIVE,
  },

  // Germany - 19% VAT
  [Country.DE]: {
    country: Country.DE,
    taxType: TaxType.VAT,
    standardRate: 19,
    reducedRates: [7],
    taxIdFormat: 'DE + 9 digits',
    taxIdPattern: /^DE\d{9}$/,
    taxIdLabel: 'VAT ID (USt-IdNr.)',
    taxIdRequired: true,
    hasStateLevelTax: false,
    defaultDisplayMode: TaxDisplayMode.INCLUSIVE,
    legalNotes: 'Prices must be shown inclusive of VAT',
  },

  // France - 20% VAT
  [Country.FR]: {
    country: Country.FR,
    taxType: TaxType.VAT,
    standardRate: 20,
    reducedRates: [10, 5.5, 2.1],
    taxIdFormat: 'FR + 2 chars + 9 digits',
    taxIdPattern: /^FR[A-Z0-9]{2}\d{9}$/,
    taxIdLabel: 'VAT Number (TVA)',
    taxIdRequired: true,
    hasStateLevelTax: false,
    defaultDisplayMode: TaxDisplayMode.INCLUSIVE,
  },

  // UK - 20% VAT
  [Country.GB]: {
    country: Country.GB,
    taxType: TaxType.VAT,
    standardRate: 20,
    reducedRates: [5, 0],
    taxIdFormat: 'GB + 9 or 12 digits',
    taxIdPattern: /^GB(\d{9}|\d{12})$/,
    taxIdLabel: 'VAT Registration Number',
    taxIdRequired: true,
    hasStateLevelTax: false,
    defaultDisplayMode: TaxDisplayMode.INCLUSIVE,
  },

  // US - State sales tax
  [Country.US]: {
    country: Country.US,
    taxType: TaxType.SALES_TAX,
    standardRate: 0, // Varies by state
    taxIdFormat: 'EIN: XX-XXXXXXX',
    taxIdPattern: /^\d{2}-\d{7}$/,
    taxIdLabel: 'EIN (Tax ID)',
    taxIdRequired: true,
    hasStateLevelTax: true,
    defaultDisplayMode: TaxDisplayMode.EXCLUSIVE,
    legalNotes: 'Sales tax varies by state and locality',
  },

  // Canada - GST/HST
  [Country.CA]: {
    country: Country.CA,
    taxType: TaxType.GST,
    standardRate: 5, // Federal GST
    taxIdFormat: '9 digits + RT + 4 digits',
    taxIdPattern: /^\d{9}RT\d{4}$/,
    taxIdLabel: 'GST/HST Number',
    taxIdRequired: true,
    hasStateLevelTax: true,
    defaultDisplayMode: TaxDisplayMode.EXCLUSIVE,
    legalNotes: 'HST or GST+PST applies depending on province',
  },

  // Australia - 10% GST
  [Country.AU]: {
    country: Country.AU,
    taxType: TaxType.GST,
    standardRate: 10,
    taxIdFormat: '11 digits',
    taxIdPattern: /^\d{11}$/,
    taxIdLabel: 'ABN (Australian Business Number)',
    taxIdRequired: true,
    hasStateLevelTax: false,
    defaultDisplayMode: TaxDisplayMode.INCLUSIVE,
  },

  // India - 18% GST (standard for services)
  [Country.IN]: {
    country: Country.IN,
    taxType: TaxType.GST,
    standardRate: 18,
    reducedRates: [5, 12, 28],
    taxIdFormat: '15 alphanumeric',
    taxIdPattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/,
    taxIdLabel: 'GSTIN',
    taxIdRequired: true,
    hasStateLevelTax: true,
    defaultDisplayMode: TaxDisplayMode.EXCLUSIVE,
  },

  // Singapore - 9% GST (from 2024)
  [Country.SG]: {
    country: Country.SG,
    taxType: TaxType.GST,
    standardRate: 9,
    taxIdFormat: '10 characters',
    taxIdLabel: 'GST Registration Number',
    taxIdRequired: true,
    hasStateLevelTax: false,
    defaultDisplayMode: TaxDisplayMode.INCLUSIVE,
  },

  // Japan - 10% Consumption Tax
  [Country.JP]: {
    country: Country.JP,
    taxType: TaxType.CONSUMPTION_TAX,
    standardRate: 10,
    reducedRates: [8],
    taxIdLabel: 'Invoice Registration Number',
    taxIdRequired: true,
    hasStateLevelTax: false,
    defaultDisplayMode: TaxDisplayMode.INCLUSIVE,
  },
};

/**
 * Get tax configuration for a country
 */
export function getCountryTaxConfig(country: Country): CountryTaxConfig {
  return (
    COUNTRY_TAX_CONFIGS[country] || {
      country,
      taxType: TaxType.NONE,
      standardRate: 0,
      taxIdLabel: 'Tax ID',
      taxIdRequired: false,
      hasStateLevelTax: false,
      defaultDisplayMode: TaxDisplayMode.INCLUSIVE,
    }
  );
}

/**
 * Validate a tax ID for a specific country
 */
export function validateTaxId(taxId: string, country: Country): boolean {
  const config = COUNTRY_TAX_CONFIGS[country];
  if (!config || !config.taxIdPattern) return true;
  return config.taxIdPattern.test(taxId);
}
