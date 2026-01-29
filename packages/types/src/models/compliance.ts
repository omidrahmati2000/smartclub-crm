import { Country } from '../enums/country';

/**
 * Venue compliance and data protection settings
 */
export interface VenueComplianceSettings {
  /** Unique identifier */
  id: string;

  /** Venue this settings belongs to */
  venueId: string;

  /** Whether GDPR compliance mode is enabled */
  gdprEnabled: boolean;

  /** GDPR-specific settings (when gdprEnabled is true) */
  gdprSettings?: GDPRSettings;

  /** Data Protection Officer contact */
  dpoContact?: DataProtectionOfficer;

  /** Privacy policy URL */
  privacyPolicyUrl?: string;

  /** Terms of service URL */
  termsOfServiceUrl?: string;

  /** Cookie policy URL */
  cookiePolicyUrl?: string;

  /** Minimum age to make a booking */
  minimumBookingAge?: number;

  /** Whether age verification is required */
  ageVerificationRequired: boolean;

  /** Parental consent settings */
  parentalConsent?: ParentalConsentSettings;

  /** Country-specific compliance flags */
  countrySpecificCompliance?: CountrySpecificCompliance;

  /** Last updated timestamp */
  updatedAt: string;

  /** User who last updated */
  updatedBy: string;
}

/**
 * GDPR-specific settings
 */
export interface GDPRSettings {
  /** Data retention period in months */
  dataRetentionPeriodMonths: number;

  /** Auto-delete inactive accounts */
  autoDeleteInactiveAccounts: boolean;

  /** Inactive account threshold in months */
  inactiveAccountThresholdMonths: number;

  /** Require explicit consent for data processing */
  requireExplicitConsent: boolean;

  /** Consent categories to track */
  consentCategories: ConsentCategory[];

  /** Allow customers to request data deletion */
  allowDataDeletionRequest: boolean;

  /** Maximum days to process deletion request (GDPR requires 30) */
  deletionRequestHandlingDays: number;

  /** Allow customers to export their data */
  allowDataExport: boolean;

  /** Supported export formats */
  exportFormats: DataExportFormat[];

  /** Enable breach notification workflow */
  breachNotificationEnabled: boolean;

  /** Contacts to notify in case of breach */
  breachNotificationContacts: string[];

  /** Cookie consent settings */
  cookieConsent?: CookieConsentSettings;

  /** Third-party data sharing disclosure */
  thirdPartyDisclosure?: ThirdPartyDisclosure;
}

/**
 * Data Protection Officer contact information
 */
export interface DataProtectionOfficer {
  /** DPO name */
  name: string;

  /** DPO email */
  email: string;

  /** DPO phone (optional) */
  phone?: string;

  /** External DPO service (if applicable) */
  externalService?: string;
}

/**
 * Consent category for tracking customer consent
 */
export interface ConsentCategory {
  /** Unique identifier */
  id: string;

  /** Category key (for programmatic use) */
  key: string;

  /** Display name */
  name: string;

  /** Description shown to customers */
  description: string;

  /** Whether this consent is required (cannot be refused) */
  required: boolean;

  /** Default value when not explicitly set */
  defaultValue: boolean;

  /** Category type */
  category: ConsentType;

  /** Legal basis for processing */
  legalBasis: LegalBasis;

  /** Purpose of data processing */
  purpose: string;

  /** Data retention period for this category (months) */
  retentionPeriod?: number;
}

/**
 * Types of consent
 */
export type ConsentType =
  | 'necessary' // Essential for service operation
  | 'functional' // Enhance user experience
  | 'analytics' // Usage analytics
  | 'marketing' // Marketing communications
  | 'third_party'; // Third-party services

/**
 * Legal basis for data processing under GDPR
 */
export type LegalBasis =
  | 'consent' // User has given consent
  | 'contract' // Necessary for contract performance
  | 'legal_obligation' // Required by law
  | 'vital_interest' // Protect vital interests
  | 'public_task' // Public interest
  | 'legitimate_interest'; // Legitimate business interest

/**
 * Data export format options
 */
export type DataExportFormat = 'JSON' | 'CSV' | 'PDF' | 'XML';

/**
 * Parental consent settings for minors
 */
export interface ParentalConsentSettings {
  /** Age threshold requiring parental consent */
  consentAgeThreshold: number;

  /** Require parental email verification */
  requireParentalVerification: boolean;

  /** Parental consent form URL */
  consentFormUrl?: string;
}

/**
 * Cookie consent settings
 */
export interface CookieConsentSettings {
  /** Show cookie banner */
  showCookieBanner: boolean;

  /** Cookie categories */
  cookieCategories: {
    id: string;
    name: string;
    description: string;
    required: boolean;
    cookies: string[];
  }[];

  /** Cookie policy version */
  policyVersion: string;
}

/**
 * Third-party data sharing disclosure
 */
export interface ThirdPartyDisclosure {
  /** Whether data is shared with third parties */
  sharesData: boolean;

  /** List of third parties */
  thirdParties: {
    name: string;
    purpose: string;
    dataShared: string[];
    privacyPolicyUrl?: string;
  }[];
}

/**
 * Country-specific compliance requirements
 */
export interface CountrySpecificCompliance {
  /** Country this applies to */
  country: Country;

  /** Specific requirements */
  requirements: {
    /** Requirement ID */
    id: string;

    /** Requirement name */
    name: string;

    /** Description */
    description: string;

    /** Whether it's enabled/compliant */
    enabled: boolean;

    /** Documentation URL */
    documentationUrl?: string;
  }[];
}

/**
 * Customer consent record
 */
export interface CustomerConsent {
  /** Unique identifier */
  id: string;

  /** Customer ID */
  customerId: string;

  /** Venue ID */
  venueId: string;

  /** Consent category ID */
  consentCategoryId: string;

  /** Whether consent was granted */
  granted: boolean;

  /** When consent was granted */
  grantedAt?: string;

  /** When consent was revoked */
  revokedAt?: string;

  /** IP address at time of consent */
  ipAddress?: string;

  /** User agent at time of consent */
  userAgent?: string;

  /** Consent version (for audit trail) */
  version: number;
}

/**
 * Data deletion request
 */
export interface DataDeletionRequest {
  /** Unique identifier */
  id: string;

  /** Customer ID */
  customerId: string;

  /** Venue ID */
  venueId: string;

  /** Request timestamp */
  requestedAt: string;

  /** Request status */
  status: DataRequestStatus;

  /** When request was processed */
  processedAt?: string;

  /** Who processed the request */
  processedBy?: string;

  /** Rejection reason (if rejected) */
  rejectionReason?: string;

  /** Data categories to delete */
  dataCategoriesToDelete: string[];

  /** Verification token */
  verificationToken?: string;

  /** Whether customer identity was verified */
  identityVerified: boolean;
}

/**
 * Data export request
 */
export interface DataExportRequest {
  /** Unique identifier */
  id: string;

  /** Customer ID */
  customerId: string;

  /** Venue ID */
  venueId: string;

  /** Request timestamp */
  requestedAt: string;

  /** Request status */
  status: DataRequestStatus;

  /** Export format requested */
  format: DataExportFormat;

  /** Download URL (when ready) */
  downloadUrl?: string;

  /** Expiry timestamp for download link */
  expiresAt?: string;

  /** File size in bytes (when ready) */
  fileSizeBytes?: number;
}

/**
 * Data request status
 */
export type DataRequestStatus =
  | 'pending' // Awaiting processing
  | 'verifying' // Verifying identity
  | 'processing' // Being processed
  | 'completed' // Successfully completed
  | 'rejected' // Rejected with reason
  | 'expired'; // Download link expired

/**
 * Data breach record
 */
export interface DataBreachRecord {
  /** Unique identifier */
  id: string;

  /** Venue ID */
  venueId: string;

  /** When breach was discovered */
  discoveredAt: string;

  /** When breach was reported to authorities */
  reportedAt?: string;

  /** Breach description */
  description: string;

  /** Data categories affected */
  affectedDataCategories: string[];

  /** Approximate number of affected individuals */
  affectedIndividualsCount?: number;

  /** Severity level */
  severity: 'low' | 'medium' | 'high' | 'critical';

  /** Remediation actions taken */
  remediationActions: string[];

  /** Whether customers were notified */
  customersNotified: boolean;

  /** Notification date (if notified) */
  notificationDate?: string;

  /** Status */
  status: 'investigating' | 'contained' | 'resolved' | 'ongoing';
}

/**
 * Compliance requirement by country
 */
export interface ComplianceRequirement {
  /** Country code */
  country: Country;

  /** Whether GDPR applies */
  gdprApplies: boolean;

  /** Whether country has its own data protection law */
  hasLocalDataProtectionLaw: boolean;

  /** Local law name (e.g., "UK GDPR", "LGPD", "PDPA") */
  localLawName?: string;

  /** Minimum age for consent */
  minimumConsentAge: number;

  /** Data retention requirements */
  dataRetentionRequirements?: string;

  /** Breach notification deadline (hours) */
  breachNotificationDeadlineHours?: number;

  /** Regulatory authority name */
  regulatoryAuthority?: string;

  /** Additional notes */
  notes?: string;
}

/**
 * Compliance requirements by country
 */
export const COMPLIANCE_REQUIREMENTS: Partial<
  Record<Country, ComplianceRequirement>
> = {
  // EU Countries - GDPR applies
  [Country.DE]: {
    country: Country.DE,
    gdprApplies: true,
    hasLocalDataProtectionLaw: true,
    localLawName: 'BDSG (Bundesdatenschutzgesetz)',
    minimumConsentAge: 16,
    breachNotificationDeadlineHours: 72,
    regulatoryAuthority: 'BfDI',
  },
  [Country.FR]: {
    country: Country.FR,
    gdprApplies: true,
    hasLocalDataProtectionLaw: true,
    localLawName: 'Loi Informatique et Libertés',
    minimumConsentAge: 15,
    breachNotificationDeadlineHours: 72,
    regulatoryAuthority: 'CNIL',
  },
  [Country.GB]: {
    country: Country.GB,
    gdprApplies: false, // Post-Brexit
    hasLocalDataProtectionLaw: true,
    localLawName: 'UK GDPR & Data Protection Act 2018',
    minimumConsentAge: 13,
    breachNotificationDeadlineHours: 72,
    regulatoryAuthority: 'ICO',
  },

  // Non-EU with strict privacy laws
  [Country.BR]: {
    country: Country.BR,
    gdprApplies: false,
    hasLocalDataProtectionLaw: true,
    localLawName: 'LGPD (Lei Geral de Proteção de Dados)',
    minimumConsentAge: 18, // For full consent, 12-18 needs parental
    breachNotificationDeadlineHours: 48,
    regulatoryAuthority: 'ANPD',
  },
  [Country.CA]: {
    country: Country.CA,
    gdprApplies: false,
    hasLocalDataProtectionLaw: true,
    localLawName: 'PIPEDA & Provincial Laws',
    minimumConsentAge: 13,
    regulatoryAuthority: 'OPC',
  },
  [Country.AU]: {
    country: Country.AU,
    gdprApplies: false,
    hasLocalDataProtectionLaw: true,
    localLawName: 'Privacy Act 1988',
    minimumConsentAge: 15,
    breachNotificationDeadlineHours: 720, // 30 days
    regulatoryAuthority: 'OAIC',
  },

  // Middle East
  [Country.AE]: {
    country: Country.AE,
    gdprApplies: false,
    hasLocalDataProtectionLaw: true,
    localLawName: 'PDPL (Personal Data Protection Law)',
    minimumConsentAge: 18,
    regulatoryAuthority: 'UAE Data Office',
  },
  [Country.SA]: {
    country: Country.SA,
    gdprApplies: false,
    hasLocalDataProtectionLaw: true,
    localLawName: 'PDPL (Personal Data Protection Law)',
    minimumConsentAge: 18,
    regulatoryAuthority: 'SDAIA',
  },
  [Country.IR]: {
    country: Country.IR,
    gdprApplies: false,
    hasLocalDataProtectionLaw: false,
    minimumConsentAge: 18,
    notes: 'Limited formal data protection legislation',
  },

  // Asia Pacific
  [Country.SG]: {
    country: Country.SG,
    gdprApplies: false,
    hasLocalDataProtectionLaw: true,
    localLawName: 'PDPA (Personal Data Protection Act)',
    minimumConsentAge: 13,
    regulatoryAuthority: 'PDPC',
  },
  [Country.JP]: {
    country: Country.JP,
    gdprApplies: false,
    hasLocalDataProtectionLaw: true,
    localLawName: 'APPI (Act on Protection of Personal Information)',
    minimumConsentAge: 16,
    regulatoryAuthority: 'PPC',
  },
  [Country.KR]: {
    country: Country.KR,
    gdprApplies: false,
    hasLocalDataProtectionLaw: true,
    localLawName: 'PIPA (Personal Information Protection Act)',
    minimumConsentAge: 14,
    breachNotificationDeadlineHours: 24,
    regulatoryAuthority: 'PIPC',
  },
  [Country.IN]: {
    country: Country.IN,
    gdprApplies: false,
    hasLocalDataProtectionLaw: true,
    localLawName: 'DPDP Act 2023',
    minimumConsentAge: 18,
    regulatoryAuthority: 'Data Protection Board',
  },
};

/**
 * Get compliance requirements for a country
 */
export function getComplianceRequirements(
  country: Country
): ComplianceRequirement {
  return (
    COMPLIANCE_REQUIREMENTS[country] || {
      country,
      gdprApplies: false,
      hasLocalDataProtectionLaw: false,
      minimumConsentAge: 18,
    }
  );
}

/**
 * Check if GDPR compliance is required for a country
 */
export function isGDPRRequiredForCountry(country: Country): boolean {
  const requirements = COMPLIANCE_REQUIREMENTS[country];
  return requirements?.gdprApplies ?? false;
}

/**
 * Get default GDPR settings
 */
export function getDefaultGDPRSettings(): GDPRSettings {
  return {
    dataRetentionPeriodMonths: 36,
    autoDeleteInactiveAccounts: false,
    inactiveAccountThresholdMonths: 24,
    requireExplicitConsent: true,
    consentCategories: [
      {
        id: 'necessary',
        key: 'necessary',
        name: 'Necessary',
        description:
          'Essential cookies and data processing required for the service to function',
        required: true,
        defaultValue: true,
        category: 'necessary',
        legalBasis: 'contract',
        purpose: 'Service operation',
      },
      {
        id: 'marketing',
        key: 'marketing',
        name: 'Marketing',
        description:
          'Allow us to send you promotional offers and updates about our services',
        required: false,
        defaultValue: false,
        category: 'marketing',
        legalBasis: 'consent',
        purpose: 'Marketing communications',
        retentionPeriod: 24,
      },
      {
        id: 'analytics',
        key: 'analytics',
        name: 'Analytics',
        description:
          'Help us understand how you use our service to improve it',
        required: false,
        defaultValue: false,
        category: 'analytics',
        legalBasis: 'legitimate_interest',
        purpose: 'Service improvement',
        retentionPeriod: 12,
      },
    ],
    allowDataDeletionRequest: true,
    deletionRequestHandlingDays: 30,
    allowDataExport: true,
    exportFormats: ['JSON', 'PDF'],
    breachNotificationEnabled: true,
    breachNotificationContacts: [],
  };
}
