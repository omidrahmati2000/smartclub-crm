/**
 * MSW (Mock Service Worker) initialization — singleton.
 *
 * Called exclusively by MSWProvider (src/providers/msw-provider.tsx).
 * The promise is cached so that multiple callers always await the same
 * worker.start() — no duplicate starts, no race conditions.
 *
 * DO NOT call this from apiClient or any other place.
 * MSWProvider is the only consumer; it blocks rendering until this resolves.
 */

let mswReady: Promise<void> | null = null;

export async function initMSW(): Promise<void> {
  // Only run in browser
  if (typeof window === 'undefined') {
    return;
  }

  // Only in development
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  // Return existing promise if already initializing
  if (mswReady) {
    return mswReady;
  }

  mswReady = (async () => {
    try {
      const { worker } = await import('@smartclub/mock-data');

      await worker.start({
        onUnhandledRequest: 'warn',
        serviceWorker: {
          url: '/mockServiceWorker.js',
        },
      });

      console.log('[MSW] ✅ Mock Service Worker initialized');
    } catch (error) {
      console.error('[MSW] ❌ Failed to initialize:', error);
      throw error;
    }
  })();

  return mswReady;
}

export function isMSWReady(): boolean {
  return mswReady !== null;
}
