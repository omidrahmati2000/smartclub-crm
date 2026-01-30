import { locales, defaultLocale, type Locale } from './config';

/** Minimal request interface compatible with LocaleRequest */
interface LocaleRequest {
  cookies: { get(name: string): { value: string } | undefined };
  headers: { get(name: string): string | null };
}

export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
export const LOCALE_STORAGE_KEY = 'smartclub_locale';

export const LOCALE_COOKIE_CONFIG = {
  name: LOCALE_COOKIE_NAME,
  maxAge: 365 * 24 * 60 * 60, // 1 year
  path: '/',
  sameSite: 'lax' as const,
};

/**
 * Validate if a string is a supported locale
 */
export function isValidLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/**
 * Parse Accept-Language header to find best matching locale
 */
function parseAcceptLanguage(header: string): Locale | null {
  const languages = header
    .split(',')
    .map((part) => {
      const [lang, q] = part.trim().split(';q=');
      return { lang: lang.trim().split('-')[0], q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of languages) {
    if (isValidLocale(lang)) {
      return lang;
    }
  }
  return null;
}

/**
 * Map country codes to locales for geo-based detection
 */
const countryLocaleMap: Record<string, Locale> = {
  IR: 'fa',
  AF: 'fa',
  TJ: 'fa',
  SA: 'ar',
  AE: 'ar',
  EG: 'ar',
  IQ: 'ar',
  JO: 'ar',
  KW: 'ar',
  LB: 'ar',
  OM: 'ar',
  QA: 'ar',
  BH: 'ar',
  YE: 'ar',
  SY: 'ar',
  LY: 'ar',
  SD: 'ar',
  TN: 'ar',
  DZ: 'ar',
  MA: 'ar',
};

/**
 * Detect locale from geo headers (Vercel/Cloudflare)
 */
function detectLocaleFromGeo(request: LocaleRequest): Locale | null {
  const country =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry');

  if (country && countryLocaleMap[country]) {
    return countryLocaleMap[country];
  }
  return null;
}

/**
 * Detect locale from request with priority:
 * 1. Cookie (user's explicit choice)
 * 2. Geo-location headers
 * 3. Accept-Language header
 * 4. Default locale
 */
export function detectLocaleFromRequest(request: LocaleRequest): Locale {
  // 1. Cookie
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  if (isValidLocale(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Geo-location
  const geoLocale = detectLocaleFromGeo(request);
  if (geoLocale) {
    return geoLocale;
  }

  // 3. Accept-Language
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const browserLocale = parseAcceptLanguage(acceptLanguage);
    if (browserLocale) {
      return browserLocale;
    }
  }

  // 4. Default
  return defaultLocale;
}
