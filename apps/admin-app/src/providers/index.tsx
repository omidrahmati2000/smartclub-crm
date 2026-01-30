'use client';

import { MSWProvider } from './msw-provider';

export function Providers({ children }: { children: React.ReactNode}) {
  return (
    <MSWProvider>
      {children}
    </MSWProvider>
  );
}
