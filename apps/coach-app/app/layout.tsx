import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SmartClub - Coach Panel',
  description: 'Coach Management Panel',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
