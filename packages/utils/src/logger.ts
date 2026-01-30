/**
 * Development logger for SmartClub CRM.
 *
 * All logging is stripped in production builds.
 * Uses structured prefixes and color-coded console output for easy filtering.
 *
 * Usage:
 *   import { logger } from '@smartclub/utils';
 *   logger.middleware('locale detected', { locale: 'fa', source: 'cookie' });
 *   logger.auth('session check', { hasSession: true, userType: 'VENUE_STAFF' });
 *   logger.i18n('language changed', { from: 'fa', to: 'en' });
 *   logger.api('fetch', { url: '/api/bookings', method: 'GET', status: 200 });
 */

const isDev = process.env.NODE_ENV === 'development';

type LogData = Record<string, unknown>;

const COLORS = {
  middleware: '\x1b[36m',  // cyan
  auth: '\x1b[33m',       // yellow
  i18n: '\x1b[35m',       // magenta
  api: '\x1b[32m',        // green
  route: '\x1b[34m',      // blue
  error: '\x1b[31m',      // red
  reset: '\x1b[0m',
} as const;

type Channel = keyof Omit<typeof COLORS, 'reset'>;

function formatData(data?: LogData): string {
  if (!data) return '';
  const entries = Object.entries(data)
    .map(([k, v]) => `${k}=${typeof v === 'string' ? v : JSON.stringify(v)}`)
    .join(' ');
  return ` | ${entries}`;
}

function log(channel: Channel, message: string, data?: LogData): void {
  if (!isDev) return;

  const color = COLORS[channel];
  const reset = COLORS.reset;
  const tag = `[${channel.toUpperCase()}]`;
  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 3 });

  if (channel === 'error') {
    console.error(`${color}${timestamp} ${tag}${reset} ${message}${formatData(data)}`);
  } else {
    console.log(`${color}${timestamp} ${tag}${reset} ${message}${formatData(data)}`);
  }
}

export const logger = {
  /** Middleware decisions: locale detection, cookie setting, redirects */
  middleware: (message: string, data?: LogData) => log('middleware', message, data),

  /** Auth decisions: session checks, protected route access, redirects to login */
  auth: (message: string, data?: LogData) => log('auth', message, data),

  /** i18n events: language changes, translation loading, direction switches */
  i18n: (message: string, data?: LogData) => log('i18n', message, data),

  /** API calls: fetch requests, responses, errors */
  api: (message: string, data?: LogData) => log('api', message, data),

  /** Route navigation: page loads, redirects, rewrites */
  route: (message: string, data?: LogData) => log('route', message, data),

  /** Error logging */
  error: (message: string, data?: LogData) => log('error', message, data),
};
