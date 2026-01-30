'use client';

import { useEffect } from 'react';

let mswPromise: Promise<void> | null = null;

function initializeMSW(): Promise<void> {
  if (mswPromise) {
    return mswPromise;
  }

  mswPromise = (async () => {
    try {
      // Only initialize on browser
      if (typeof window === 'undefined') return;

      const { worker } = await import('@smartclub/mock-data/browser');

      console.log('[MSW] Initializing...');

      // Start the worker
      await worker.start({
        onUnhandledRequest: 'bypass',
        quiet: false,
      });

      console.log('[MSW] ✓ Started');
    } catch (error: any) {
      // Don't fail the app if MSW fails to start
      if (!error?.message?.includes('already listening')) {
        console.warn('[MSW] Failed to start:', error?.message || error);
      }
    }
  })();

  return mswPromise;
}

export function MSWProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize MSW on component mount
    initializeMSW().catch(() => {
      // Silently fail
    });
  }, []);

  return <>{children}</>;
}
