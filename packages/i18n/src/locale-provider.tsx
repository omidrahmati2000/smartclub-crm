'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LOCALE_COOKIE_NAME, LOCALE_STORAGE_KEY, LOCALE_COOKIE_CONFIG, isValidLocale } from './locale-cookie';
import type { Locale } from './config';

interface LocaleContextValue {
  locale: Locale;
  changeLocale: (newLocale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

interface LocaleProviderProps {
  children: React.ReactNode;
  initialLocale: Locale;
}

export function LocaleProvider({ children, initialLocale }: LocaleProviderProps) {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>(initialLocale);

  // Sync cookie to localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (isValidLocale(stored) && stored !== initialLocale) {
        // localStorage has a different value than cookie — cookie wins (server source of truth)
        localStorage.setItem(LOCALE_STORAGE_KEY, initialLocale);
      } else if (!stored) {
        localStorage.setItem(LOCALE_STORAGE_KEY, initialLocale);
      }
    } catch {
      // localStorage not available
    }
  }, [initialLocale]);

  const changeLocale = useCallback(
    (newLocale: Locale) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[I18N] locale change: ${locale} → ${newLocale}`);
      }

      // Set cookie
      document.cookie = `${LOCALE_COOKIE_NAME}=${newLocale};max-age=${LOCALE_COOKIE_CONFIG.maxAge};path=${LOCALE_COOKIE_CONFIG.path};samesite=${LOCALE_COOKIE_CONFIG.sameSite}`;

      // Set localStorage
      try {
        localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
      } catch {
        // localStorage not available
      }

      setLocale(newLocale);

      // Refresh page to re-render with new locale
      router.refresh();
    },
    [router],
  );

  return (
    <LocaleContext.Provider value={{ locale, changeLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

/**
 * Hook to access and change the current locale.
 * Use this instead of passing locale as props.
 */
export function useLocaleManager() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocaleManager must be used within a LocaleProvider');
  }
  return context;
}
