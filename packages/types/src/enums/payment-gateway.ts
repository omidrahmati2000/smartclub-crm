/**
 * Supported payment gateway providers
 * Based on popular international payment processors
 */
export enum PaymentGateway {
  // Global Leaders
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  SQUARE = 'square',

  // Regional - Asia/Middle East
  RAZORPAY = 'razorpay',     // India
  PAYSTACK = 'paystack',     // Africa
  PAYTABS = 'paytabs',       // Middle East
  TAP_PAYMENTS = 'tap',      // GCC

  // Regional - Europe
  ADYEN = 'adyen',           // Netherlands
  MOLLIE = 'mollie',         // Netherlands

  // Regional - Americas
  MERCADOPAGO = 'mercadopago', // Latin America

  // Cryptocurrency
  COINBASE_COMMERCE = 'coinbase',

  // Local Iran (mock for demo)
  ZARINPAL = 'zarinpal',     // Iran
  SAMAN = 'saman',           // Iran
}

/**
 * Payment gateway configuration
 */
export interface PaymentGatewayConfig {
  gateway: PaymentGateway;
  name: string;
  description: string;
  supportedCurrencies: string[]; // ISO 4217 codes
  region: 'global' | 'middle_east' | 'asia' | 'europe' | 'americas' | 'africa' | 'iran';
  logoUrl?: string;
  websiteUrl: string;
  requiresAPIKey: boolean;
  requiresSecretKey: boolean;
  requiresWebhook: boolean;
  testModeAvailable: boolean;
}

/**
 * Gateway configurations
 */
export const PAYMENT_GATEWAY_CONFIGS: Record<PaymentGateway, PaymentGatewayConfig> = {
  [PaymentGateway.STRIPE]: {
    gateway: PaymentGateway.STRIPE,
    name: 'Stripe',
    description: 'Global payment processor with support for 135+ currencies',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'AED', 'SAR', 'JPY', 'INR'], // 135+ total
    region: 'global',
    websiteUrl: 'https://stripe.com',
    requiresAPIKey: true,
    requiresSecretKey: true,
    requiresWebhook: true,
    testModeAvailable: true,
  },
  [PaymentGateway.PAYPAL]: {
    gateway: PaymentGateway.PAYPAL,
    name: 'PayPal',
    description: 'Trusted payment platform with global reach',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'AED', 'SAR'], // 25+ total
    region: 'global',
    websiteUrl: 'https://paypal.com',
    requiresAPIKey: true,
    requiresSecretKey: true,
    requiresWebhook: true,
    testModeAvailable: true,
  },
  [PaymentGateway.SQUARE]: {
    gateway: PaymentGateway.SQUARE,
    name: 'Square',
    description: 'Payment solution optimized for retail and hospitality',
    supportedCurrencies: ['USD', 'CAD', 'GBP', 'AUD', 'EUR', 'JPY'],
    region: 'global',
    websiteUrl: 'https://squareup.com',
    requiresAPIKey: true,
    requiresSecretKey: true,
    requiresWebhook: true,
    testModeAvailable: true,
  },
  [PaymentGateway.RAZORPAY]: {
    gateway: PaymentGateway.RAZORPAY,
    name: 'Razorpay',
    description: 'Leading payment gateway for India',
    supportedCurrencies: ['INR', 'USD', 'EUR', 'GBP', 'SGD', 'AED'],
    region: 'asia',
    websiteUrl: 'https://razorpay.com',
    requiresAPIKey: true,
    requiresSecretKey: true,
    requiresWebhook: true,
    testModeAvailable: true,
  },
  [PaymentGateway.PAYSTACK]: {
    gateway: PaymentGateway.PAYSTACK,
    name: 'Paystack',
    description: 'Modern payment infrastructure for Africa',
    supportedCurrencies: ['NGN', 'GHS', 'ZAR', 'KES', 'USD'],
    region: 'africa',
    websiteUrl: 'https://paystack.com',
    requiresAPIKey: true,
    requiresSecretKey: true,
    requiresWebhook: true,
    testModeAvailable: true,
  },
  [PaymentGateway.PAYTABS]: {
    gateway: PaymentGateway.PAYTABS,
    name: 'PayTabs',
    description: 'Payment gateway for Middle East and Africa',
    supportedCurrencies: ['SAR', 'AED', 'KWD', 'QAR', 'BHD', 'OMR', 'JOD', 'EGP', 'USD', 'EUR'],
    region: 'middle_east',
    websiteUrl: 'https://paytabs.com',
    requiresAPIKey: true,
    requiresSecretKey: true,
    requiresWebhook: true,
    testModeAvailable: true,
  },
  [PaymentGateway.TAP_PAYMENTS]: {
    gateway: PaymentGateway.TAP_PAYMENTS,
    name: 'Tap Payments',
    description: 'Payment solution for GCC countries',
    supportedCurrencies: ['SAR', 'AED', 'KWD', 'QAR', 'BHD', 'OMR', 'USD'],
    region: 'middle_east',
    websiteUrl: 'https://tap.company',
    requiresAPIKey: true,
    requiresSecretKey: true,
    requiresWebhook: true,
    testModeAvailable: true,
  },
  [PaymentGateway.ADYEN]: {
    gateway: PaymentGateway.ADYEN,
    name: 'Adyen',
    description: 'Enterprise payment platform for global brands',
    supportedCurrencies: ['EUR', 'USD', 'GBP', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK'], // 150+ total
    region: 'europe',
    websiteUrl: 'https://adyen.com',
    requiresAPIKey: true,
    requiresSecretKey: true,
    requiresWebhook: true,
    testModeAvailable: true,
  },
  [PaymentGateway.MOLLIE]: {
    gateway: PaymentGateway.MOLLIE,
    name: 'Mollie',
    description: 'European payment service provider',
    supportedCurrencies: ['EUR', 'USD', 'GBP', 'CHF', 'SEK', 'NOK', 'DKK', 'PLN'],
    region: 'europe',
    websiteUrl: 'https://mollie.com',
    requiresAPIKey: true,
    requiresSecretKey: false,
    requiresWebhook: true,
    testModeAvailable: true,
  },
  [PaymentGateway.MERCADOPAGO]: {
    gateway: PaymentGateway.MERCADOPAGO,
    name: 'Mercado Pago',
    description: 'Leading payment platform in Latin America',
    supportedCurrencies: ['BRL', 'ARS', 'MXN', 'CLP', 'COP', 'USD'],
    region: 'americas',
    websiteUrl: 'https://mercadopago.com',
    requiresAPIKey: true,
    requiresSecretKey: true,
    requiresWebhook: true,
    testModeAvailable: true,
  },
  [PaymentGateway.COINBASE_COMMERCE]: {
    gateway: PaymentGateway.COINBASE_COMMERCE,
    name: 'Coinbase Commerce',
    description: 'Accept cryptocurrency payments (Bitcoin, Ethereum, etc.)',
    supportedCurrencies: ['BTC', 'ETH', 'USDC', 'DAI'], // Crypto only
    region: 'global',
    websiteUrl: 'https://commerce.coinbase.com',
    requiresAPIKey: true,
    requiresSecretKey: true,
    requiresWebhook: true,
    testModeAvailable: true,
  },
  [PaymentGateway.ZARINPAL]: {
    gateway: PaymentGateway.ZARINPAL,
    name: 'ZarinPal',
    description: 'Popular payment gateway in Iran',
    supportedCurrencies: ['IRR', 'IRT'],
    region: 'iran',
    websiteUrl: 'https://zarinpal.com',
    requiresAPIKey: true,
    requiresSecretKey: false,
    requiresWebhook: true,
    testModeAvailable: true,
  },
  [PaymentGateway.SAMAN]: {
    gateway: PaymentGateway.SAMAN,
    name: 'Saman Bank',
    description: 'Iranian bank payment gateway',
    supportedCurrencies: ['IRR', 'IRT'],
    region: 'iran',
    websiteUrl: 'https://sep.ir',
    requiresAPIKey: true,
    requiresSecretKey: true,
    requiresWebhook: false,
    testModeAvailable: false,
  },
};

/**
 * Get payment gateway configuration
 */
export function getPaymentGatewayConfig(gateway: PaymentGateway): PaymentGatewayConfig {
  return PAYMENT_GATEWAY_CONFIGS[gateway];
}

/**
 * Get gateways by region
 */
export function getGatewaysByRegion(region: PaymentGatewayConfig['region']): PaymentGateway[] {
  return Object.values(PaymentGateway).filter(
    (gateway) => PAYMENT_GATEWAY_CONFIGS[gateway].region === region
  );
}

/**
 * Get gateways that support a specific currency
 */
export function getGatewaysByCurrency(currencyCode: string): PaymentGateway[] {
  return Object.values(PaymentGateway).filter((gateway) =>
    PAYMENT_GATEWAY_CONFIGS[gateway].supportedCurrencies.includes(currencyCode)
  );
}

/**
 * Check if gateway supports a currency
 */
export function gatewaySupports(gateway: PaymentGateway, currencyCode: string): boolean {
  return PAYMENT_GATEWAY_CONFIGS[gateway].supportedCurrencies.includes(currencyCode);
}
