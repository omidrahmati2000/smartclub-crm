'use client';

import { MSWProvider } from './msw-provider';
import { SessionProvider } from './session-provider';
import { QueryProvider } from './query-provider';

export function Providers({ children }: { children: React.ReactNode}) {
  return (
    <MSWProvider>
      <QueryProvider>
        <SessionProvider>{children}</SessionProvider>
      </QueryProvider>
    </MSWProvider>
  );
}
