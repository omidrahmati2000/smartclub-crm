import {
  Currency,
  PaymentGateway,
  VenuePaymentSettings,
  DEFAULT_PAYMENT_SETTINGS,
} from '@smartclub/types';

/**
 * Mock venue payment settings
 */
export const MOCK_PAYMENT_SETTINGS: Record<string, VenuePaymentSettings> = {
  'venue-1': {
    venueId: 'venue-1',
    displayCurrency: Currency.AED,
    defaultCurrency: Currency.AED,
    enabledGateways: [PaymentGateway.STRIPE, PaymentGateway.TAP_PAYMENTS, PaymentGateway.PAYTABS],
    gatewayConfigs: {
      [PaymentGateway.STRIPE]: {
        gateway: PaymentGateway.STRIPE,
        isEnabled: true,
        testMode: false,
        apiKey: 'pk_live_••••••••',
        secretKey: 'sk_live_••••••••',
        webhookUrl: 'https://smartclub.ae/api/webhooks/stripe',
        webhookSecret: 'whsec_••••••••',
        isConfigured: true,
        lastVerified: '2026-01-30T14:00:00Z',
      },
      [PaymentGateway.TAP_PAYMENTS]: {
        gateway: PaymentGateway.TAP_PAYMENTS,
        isEnabled: true,
        testMode: false,
        apiKey: 'sk_live_••••••••',
        secretKey: 'pk_live_••••••••',
        webhookUrl: 'https://smartclub.ae/api/webhooks/tap',
        isConfigured: true,
        lastVerified: '2026-01-30T13:00:00Z',
      },
      [PaymentGateway.PAYTABS]: {
        gateway: PaymentGateway.PAYTABS,
        isEnabled: true,
        testMode: false,
        apiKey: 'pt_••••••••',
        secretKey: 'sk_••••••••',
        webhookUrl: 'https://smartclub.ae/api/webhooks/paytabs',
        isConfigured: true,
        lastVerified: '2026-01-30T12:00:00Z',
      },
    } as any,
    acceptCash: true,
    acceptCardOnSite: true,
    enableWallet: true,
    walletCurrency: Currency.AED,
    updatedAt: '2026-01-30T14:30:00Z',
  },
  'venue-2': {
    venueId: 'venue-2',
    displayCurrency: Currency.SAR,
    defaultCurrency: Currency.SAR,
    enabledGateways: [PaymentGateway.STRIPE, PaymentGateway.TAP_PAYMENTS],
    gatewayConfigs: {
      [PaymentGateway.STRIPE]: {
        gateway: PaymentGateway.STRIPE,
        isEnabled: true,
        testMode: false,
        apiKey: 'pk_live_••••••••',
        secretKey: 'sk_live_••••••••',
        webhookUrl: 'https://smartclub.ae/api/webhooks/stripe',
        webhookSecret: 'whsec_••••••••',
        isConfigured: true,
        lastVerified: '2026-01-30T11:00:00Z',
      },
      [PaymentGateway.TAP_PAYMENTS]: {
        gateway: PaymentGateway.TAP_PAYMENTS,
        isEnabled: true,
        testMode: false,
        apiKey: 'sk_live_••••••••',
        secretKey: 'pk_live_••••••••',
        webhookUrl: 'https://smartclub.ae/api/webhooks/tap',
        isConfigured: true,
        lastVerified: '2026-01-30T10:00:00Z',
      },
    } as any,
    acceptCash: true,
    acceptCardOnSite: true,
    enableWallet: true,
    walletCurrency: Currency.SAR,
    updatedAt: '2026-01-30T11:30:00Z',
  },
  'venue-3': {
    venueId: 'venue-3',
    displayCurrency: Currency.QAR,
    defaultCurrency: Currency.QAR,
    enabledGateways: [
      PaymentGateway.STRIPE,
      PaymentGateway.TAP_PAYMENTS,
    ],
    gatewayConfigs: {
      [PaymentGateway.STRIPE]: {
        gateway: PaymentGateway.STRIPE,
        isEnabled: true,
        testMode: false,
        apiKey: 'pk_live_••••••••',
        secretKey: 'sk_live_••••••••',
        webhookUrl: 'https://smartclub.ae/api/webhooks/stripe',
        webhookSecret: 'whsec_••••••••',
        isConfigured: true,
        lastVerified: '2026-01-30T09:00:00Z',
      },
      [PaymentGateway.TAP_PAYMENTS]: {
        gateway: PaymentGateway.TAP_PAYMENTS,
        isEnabled: true,
        testMode: false,
        apiKey: 'sk_live_••••••••',
        secretKey: 'pk_live_••••••••',
        webhookUrl: 'https://smartclub.ae/api/webhooks/tap',
        isConfigured: true,
        lastVerified: '2026-01-30T08:30:00Z',
      },
    } as any,
    acceptCash: true,
    acceptCardOnSite: true,
    enableWallet: true,
    walletCurrency: Currency.QAR,
    updatedAt: '2026-01-30T09:30:00Z',
  },
  'venue-4': {
    venueId: 'venue-4',
    displayCurrency: Currency.KWD,
    defaultCurrency: Currency.KWD,
    enabledGateways: [PaymentGateway.TAP_PAYMENTS, PaymentGateway.PAYTABS],
    gatewayConfigs: {
      [PaymentGateway.TAP_PAYMENTS]: {
        gateway: PaymentGateway.TAP_PAYMENTS,
        isEnabled: true,
        testMode: false,
        apiKey: 'sk_live_••••••••',
        secretKey: 'pk_live_••••••••',
        webhookUrl: 'https://smartclub.ae/api/webhooks/tap',
        isConfigured: true,
        lastVerified: '2026-01-30T07:00:00Z',
      },
      [PaymentGateway.PAYTABS]: {
        gateway: PaymentGateway.PAYTABS,
        isEnabled: true,
        testMode: false,
        apiKey: 'pt_••••••••',
        webhookUrl: 'https://smartclub.ae/api/webhooks/paytabs',
        isConfigured: true,
        lastVerified: '2026-01-30T06:30:00Z',
      },
    } as any,
    acceptCash: true,
    acceptCardOnSite: true,
    enableWallet: true,
    walletCurrency: Currency.KWD,
    updatedAt: '2026-01-30T07:30:00Z',
  },
};

/**
 * Get payment settings for a venue
 */
export function getMockPaymentSettings(venueId: string): VenuePaymentSettings {
  return (
    MOCK_PAYMENT_SETTINGS[venueId] || {
      ...DEFAULT_PAYMENT_SETTINGS,
      venueId,
      updatedAt: new Date().toISOString(),
    }
  );
}

/**
 * Update payment settings for a venue
 */
export function updateMockPaymentSettings(
  venueId: string,
  updates: Partial<VenuePaymentSettings>
): VenuePaymentSettings {
  const current = getMockPaymentSettings(venueId);
  const updated = {
    ...current,
    ...updates,
    venueId,
    updatedAt: new Date().toISOString(),
  };
  MOCK_PAYMENT_SETTINGS[venueId] = updated;
  return updated;
}
