'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { BookOpen, TrendingUp, Percent, Clock } from 'lucide-react';
import { KPICard } from './kpi-card';
import { RecentBookings } from './recent-bookings';
import { QuickActions } from './quick-actions';
import { Skeleton } from '@smartclub/ui/skeleton';
import { formatCurrency } from '@smartclub/utils';
import type { Booking } from '@smartclub/types';

interface DashboardData {
  kpis: {
    todayBookings: {
      count: number;
      change: number;
    };
    todayRevenue: {
      amount: number;
      change: number;
    };
    occupancyRate: {
      percentage: number;
    };
    pendingBookings: {
      count: number;
    };
  };
  recentBookings: Booking[];
}

export function OverviewContent({ locale }: { locale: string }) {
  const { data: session } = useSession();
  const t = useTranslations('venue-admin.dashboard');
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.venueId) {
      fetchDashboardData(session.user.venueId);
    }
  }, [session]);

  const fetchDashboardData = async (venueId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/venues/${venueId}/dashboard`);
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('title')}
          </h1>
          <p className="text-muted-foreground">
            {t('welcome')}, {session?.user?.name}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="h-96 lg:col-span-4" />
          <Skeleton className="h-96 lg:col-span-3" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">خطا در بارگذاری داده‌ها</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('welcome')}, {session?.user?.name}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title={t('kpi.todayBookings')}
          value={data.kpis.todayBookings.count}
          change={data.kpis.todayBookings.change}
          icon={<BookOpen className="h-4 w-4" />}
        />
        <KPICard
          title={t('kpi.todayRevenue')}
          value={data.kpis.todayRevenue.amount}
          change={data.kpis.todayRevenue.change}
          icon={<TrendingUp className="h-4 w-4" />}
          formatValue={(val) => formatCurrency(Number(val), 'IRT', 'fa')}
        />
        <KPICard
          title={t('kpi.occupancyRate')}
          value={`${data.kpis.occupancyRate.percentage}٪`}
          icon={<Percent className="h-4 w-4" />}
        />
        <KPICard
          title={t('kpi.pendingBookings')}
          value={data.kpis.pendingBookings.count}
          icon={<Clock className="h-4 w-4" />}
        />
      </div>

      {/* Recent Bookings and Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RecentBookings bookings={data.recentBookings} />
        </div>
        <div className="lg:col-span-3">
          <QuickActions locale={locale} />
        </div>
      </div>
    </div>
  );
}
