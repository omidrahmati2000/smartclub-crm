import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SmartClub - Platform Admin',
  description: 'Platform Administration Panel',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
