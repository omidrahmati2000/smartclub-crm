'use client';

import { useEffect } from 'react';

const IS_BROWSER = typeof window !== 'undefined';

// Only import on client side
let worker: any = null;
if (IS_BROWSER) {
  try {
    worker = require('@smartclub/mock-data/browser').worker;
  } catch (e) {
    // MSW not available
  }
}

export function MSWProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!IS_BROWSER || !worker) return;

    async function initMSW() {
      try {
        await worker.start({
          onUnhandledRequest: 'bypass',
        });
      } catch (error) {
        // Ignore errors if already started
      }
    }

    initMSW();
  }, []);

  return <>{children}</>;
}
