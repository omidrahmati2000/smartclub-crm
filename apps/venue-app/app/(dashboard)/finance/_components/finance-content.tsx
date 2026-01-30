'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@smartclub/ui/tabs';
import { ReportPeriod } from '@smartclub/types';
import { PeriodSelector } from './period-selector';
import { ExportButtons } from './export-buttons';
import { RevenueReport } from './revenue-report';
import { OccupancyReport } from './occupancy-report';

export function FinanceContent() {
  const t = useTranslations('venue-admin.finance');
  const [period, setPeriod] = useState<ReportPeriod>(ReportPeriod.LAST_7_DAYS);
  const [activeTab, setActiveTab] = useState<'revenue' | 'occupancy'>('revenue');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <PeriodSelector period={period} onPeriodChange={setPeriod} />
        <ExportButtons period={period} reportType={activeTab} />
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'revenue' | 'occupancy')}>
        <TabsList>
          <TabsTrigger value="revenue">{t('tabs.revenue')}</TabsTrigger>
          <TabsTrigger value="occupancy">{t('tabs.occupancy')}</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6 mt-6">
          <RevenueReport period={period} />
        </TabsContent>

        <TabsContent value="occupancy" className="space-y-6 mt-6">
          <OccupancyReport period={period} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
