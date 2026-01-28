import type { Metadata } from 'next';
import { Providers } from '@/providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'SmartClub',
  description: 'Universal Leisure & Sports Venue Management Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
