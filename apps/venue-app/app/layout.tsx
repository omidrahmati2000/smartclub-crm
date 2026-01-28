import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SmartClub - Venue Management',
  description: 'Venue Management Panel',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
