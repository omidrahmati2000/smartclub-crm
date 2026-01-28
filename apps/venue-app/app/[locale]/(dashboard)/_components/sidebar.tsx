'use client';

import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Package,
  Users,
  UserCog,
  Wallet,
  TrendingUp,
  FileText,
  Settings,
} from 'lucide-react';
import { Permission } from '@smartclub/types';
import type { User } from '@smartclub/types';
import { hasPermission } from '@smartclub/types';
import { NavItem } from './nav-item';
import { UserMenu } from './user-menu';

import type { PermissionKey } from '@smartclub/types';

interface NavItemType {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: PermissionKey;
}

export function Sidebar({ locale }: { locale: string }) {
  const t = useTranslations('venue-admin.nav');
  const { data: session } = useSession();

  const user = session?.user as User | undefined;

  const navItems: NavItemType[] = [
    {
      href: `/${locale}/overview`,
      label: t('dashboard'),
      icon: LayoutDashboard,
    },
    {
      href: `/${locale}/calendar`,
      label: t('calendar'),
      icon: Calendar,
      permission: Permission.CALENDAR_VIEW,
    },
    {
      href: `/${locale}/bookings`,
      label: t('bookings'),
      icon: BookOpen,
      permission: Permission.BOOKING_VIEW,
    },
    {
      href: `/${locale}/assets`,
      label: t('assets'),
      icon: Package,
      permission: Permission.ASSET_VIEW,
    },
    {
      href: `/${locale}/customers`,
      label: t('customers'),
      icon: Users,
      permission: Permission.CUSTOMER_VIEW,
    },
    {
      href: `/${locale}/staff`,
      label: t('staff'),
      icon: UserCog,
      permission: Permission.STAFF_VIEW,
    },
    {
      href: `/${locale}/finance`,
      label: t('finance'),
      icon: Wallet,
      permission: Permission.FINANCE_VIEW,
    },
    {
      href: `/${locale}/pricing`,
      label: t('pricing'),
      icon: TrendingUp,
      permission: Permission.PRICING_VIEW,
    },
    {
      href: `/${locale}/reports`,
      label: t('reports'),
      icon: FileText,
      permission: Permission.REPORTS_VIEW,
    },
    {
      href: `/${locale}/settings`,
      label: t('settings'),
      icon: Settings,
      permission: Permission.VENUE_SETTINGS,
    },
  ];

  // Filter nav items based on user permissions
  const visibleNavItems = navItems.filter((item) => {
    if (!item.permission) return true;
    if (!user) return false;
    return hasPermission(user, item.permission);
  });

  return (
    <aside className="flex h-screen w-64 flex-col border-e bg-background">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">اسمارت‌کلاب</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {visibleNavItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </nav>

      {/* User Menu */}
      <UserMenu locale={locale} />
    </aside>
  );
}
