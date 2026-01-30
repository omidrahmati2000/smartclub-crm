'use client';

import { useEffect } from 'react';

let mswStarted = false;

export function MSWProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined' || mswStarted) return;

    async function initMSW() {
      try {
        const { worker } = await import('@smartclub/mock-data/browser');

        console.log('[MSW] Initializing mock service worker...');

        // Start the worker
        await worker.start({
          onUnhandledRequest: 'bypass',
          quiet: false,
        });

        mswStarted = true;
        console.log('[MSW] ✓ Mock service worker started successfully');
      } catch (error: any) {
        console.error('[MSW] Error starting worker:', error?.message || error);
      }
    }

    initMSW();
  }, []);

  return <>{children}</>;
}
