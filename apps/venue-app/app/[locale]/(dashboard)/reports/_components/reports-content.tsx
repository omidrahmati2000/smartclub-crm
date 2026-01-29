'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FileText, TrendingUp, Users, Calendar, Download } from 'lucide-react';
import { Card } from '@smartclub/ui/card';
import { Button } from '@smartclub/ui/button';
import { BookingsReport } from './bookings-report';
import { CustomersReport } from './customers-report';
import { PerformanceReport } from './performance-report';
import { PeriodSelector, type ReportPeriod } from './period-selector';

type ReportTab = 'bookings' | 'customers' | 'performance';

interface ReportsContentProps {
  locale: string;
}

export function ReportsContent({ locale }: ReportsContentProps) {
  const t = useTranslations('venue-admin.reports');
  const [activeTab, setActiveTab] = useState<ReportTab>('bookings');
  const [period, setPeriod] = useState<ReportPeriod>('last30days');

  const tabs = [
    { id: 'bookings' as ReportTab, label: t('bookings'), icon: Calendar },
    { id: 'customers' as ReportTab, label: t('customers'), icon: Users },
    { id: 'performance' as ReportTab, label: 'عملکرد', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">گزارشات جامع عملکرد مجموعه</p>
        </div>
        <div className="flex items-center gap-3">
          <PeriodSelector value={period} onChange={setPeriod} />
          <Button variant="outline">
            <Download className="h-4 w-4 me-2" />
            {t('export')}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            size="sm"
            className="rounded-b-none"
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="h-4 w-4 me-2" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Report Content */}
      <div className="mt-6">
        {activeTab === 'bookings' && <BookingsReport period={period} locale={locale} />}
        {activeTab === 'customers' && <CustomersReport period={period} locale={locale} />}
        {activeTab === 'performance' && <PerformanceReport period={period} locale={locale} />}
      </div>
    </div>
  );
}
