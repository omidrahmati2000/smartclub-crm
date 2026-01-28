'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@smartclub/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '@smartclub/utils';
import { CancellationReport as CancellationReportType } from '@smartclub/types';
import { SummaryCards } from './summary-cards';
import { XCircle, Percent, DollarSign } from 'lucide-react';

interface CancellationReportProps {
  data: CancellationReportType;
  locale: string;
}

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981'];

export function CancellationReport({ data, locale }: CancellationReportProps) {
  const t = useTranslations('venue-admin.finance.cancellation');

  const summaryCards = [
    {
      title: t('totalCancellations'),
      value: data.totalCancellations,
      icon: <XCircle className="h-4 w-4" />,
    },
    {
      title: t('cancellationRate'),
      value: `${data.cancellationRate.toFixed(1)}%`,
      icon: <Percent className="h-4 w-4" />,
    },
    {
      title: t('totalRefunds'),
      value: data.totalRefunds,
      icon: <DollarSign className="h-4 w-4" />,
      formatValue: (v: string | number) => formatCurrency(Number(v), locale),
    },
    {
      title: t('lostRevenue'),
      value: data.lostRevenue,
      icon: <DollarSign className="h-4 w-4" />,
      formatValue: (v: string | number) => formatCurrency(Number(v), locale),
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">{t('title')}</h3>
      <SummaryCards cards={summaryCards} />

      <Card>
        <CardHeader>
          <CardTitle>{t('byReason')}</CardTitle>
        </CardHeader>
        <CardContent>
          {data.cancellationsByReason.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.cancellationsByReason}
                  dataKey="count"
                  nameKey="reason"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.percent}%`}
                >
                  {data.cancellationsByReason.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {t('noData')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
