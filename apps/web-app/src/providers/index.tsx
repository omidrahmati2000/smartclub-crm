'use client';

import { MSWProvider } from './msw-provider';
import { SessionProvider } from './session-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MSWProvider>
      <SessionProvider>{children}</SessionProvider>
    </MSWProvider>
  );
}
