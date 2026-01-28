'use client';

import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import { faIR, enUS } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@smartclub/ui/card';
import type { CustomerProfile } from '@smartclub/types';
import { formatCurrency } from '@smartclub/utils';
import {
  ShoppingCart,
  CheckCircle,
  XCircle,
  UserX,
  Wallet,
  TrendingUp,
  Calendar,
  Clock,
} from 'lucide-react';

interface CustomerStatsProps {
  customer: CustomerProfile;
  locale: string;
}

export function CustomerStats({ customer, locale }: CustomerStatsProps) {
  const t = useTranslations('venue-admin.customers.profile.stats');

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PP', {
        locale: locale === 'fa' ? faIR : enUS,
      });
    } catch {
      return dateString;
    }
  };

  const stats = [
    {
      title: t('totalBookings'),
      value: customer.stats.totalBookings.toString(),
      icon: ShoppingCart,
      color: 'text-blue-600',
    },
    {
      title: t('completedBookings'),
      value: customer.stats.completedBookings.toString(),
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: t('cancelledBookings'),
      value: customer.stats.cancelledBookings.toString(),
      icon: XCircle,
      color: 'text-red-600',
    },
    {
      title: t('noShowCount'),
      value: customer.stats.noShowCount.toString(),
      icon: UserX,
      color: 'text-orange-600',
    },
    {
      title: t('totalSpent'),
      value: formatCurrency(
        customer.stats.totalSpent,
        customer.stats.currency,
        locale as 'fa' | 'en'
      ),
      icon: Wallet,
      color: 'text-purple-600',
    },
    {
      title: t('averageBookingValue'),
      value: formatCurrency(
        customer.stats.averageBookingValue,
        customer.stats.currency,
        locale as 'fa' | 'en'
      ),
      icon: TrendingUp,
      color: 'text-amber-600',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('firstVisit')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {formatDate(customer.firstVisit)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('lastVisit')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {formatDate(customer.lastVisit)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preferences */}
      {(customer.stats.favoriteAssets.length > 0 ||
        customer.stats.preferredTimeSlots.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">تنظیمات ترجیحی</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {customer.stats.favoriteAssets.length > 0 && (
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  {t('favoriteAssets')}
                </div>
                <div className="text-sm">
                  {customer.stats.favoriteAssets.join(', ')}
                </div>
              </div>
            )}
            {customer.stats.preferredTimeSlots.length > 0 && (
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  {t('preferredTimeSlots')}
                </div>
                <div className="text-sm">
                  {customer.stats.preferredTimeSlots.join(', ')}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
