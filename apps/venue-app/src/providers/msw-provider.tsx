'use client';

import { useState, useEffect } from 'react';
import { initMSW } from '@/lib/msw';

/**
 * MSWProvider — the SINGLE entry point for MSW initialization.
 *
 * This provider MUST wrap the entire app (see src/providers/index.tsx).
 * It blocks rendering (`return null`) until MSW is fully started so that
 * no API call can fire before MSW is ready to intercept it.
 *
 * IMPORTANT:
 * - Do NOT add a second MSW init path (e.g. inside apiClient). Having
 *   multiple init paths causes race conditions where requests fire before
 *   MSW is ready, resulting in 404s or HTML-instead-of-JSON responses.
 * - The singleton initMSW() in src/lib/msw.ts guarantees only one
 *   worker.start() call ever happens.
 */
export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setReady(true);
      return;
    }

    if (process.env.NODE_ENV !== 'development') {
      setReady(true);
      return;
    }

    initMSW()
      .then(() => setReady(true))
      .catch((error) => {
        console.error('[MSW] Failed to initialize:', error);
        // Still render the app - some features may work without MSW
        setReady(true);
      });
  }, []);

  // Block rendering until MSW is ready in development
  if (!ready) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'system-ui, sans-serif',
        color: '#666',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', marginBottom: '8px' }}>Starting Mock Service Worker...</div>
          <div style={{ fontSize: '12px', color: '#999' }}>Initializing API handlers</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
