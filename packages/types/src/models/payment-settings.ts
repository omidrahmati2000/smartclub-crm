import { Currency } from '../enums/currency';
import { PaymentGateway } from '../enums/payment-gateway';

/**
 * Venue payment configuration
 */
export interface VenuePaymentSettings {
  venueId: string;

  // Display & Base Settings
  displayCurrency: Currency;
  defaultCurrency: Currency; // For internal accounting

  // Enabled Payment Gateways
  enabledGateways: PaymentGateway[];

  // Gateway-specific configurations
  gatewayConfigs: Record<PaymentGateway, GatewayCredentials | undefined>;

  // Local Payment Methods
  acceptCash: boolean;
  acceptCardOnSite: boolean;

  // Wallet Settings
  enableWallet: boolean;
  walletCurrency: Currency;

  updatedAt: string;
}

/**
 * Payment gateway credentials (stored securely)
 */
export interface GatewayCredentials {
  gateway: PaymentGateway;
  isEnabled: boolean;
  testMode: boolean;

  // API Credentials (masked in UI)
  apiKey?: string;
  secretKey?: string;
  webhookUrl?: string;
  webhookSecret?: string;

  // Additional config
  merchantId?: string;
  publicKey?: string;

  // Status
  isConfigured: boolean;
  lastVerified?: string;
}

/**
 * Default payment settings
 */
export const DEFAULT_PAYMENT_SETTINGS: Omit<VenuePaymentSettings, 'venueId' | 'updatedAt'> = {
  displayCurrency: Currency.IRT,
  defaultCurrency: Currency.IRT,
  enabledGateways: [],
  gatewayConfigs: {} as Record<PaymentGateway, GatewayCredentials | undefined>,
  acceptCash: true,
  acceptCardOnSite: true,
  enableWallet: true,
  walletCurrency: Currency.IRT,
};
