'use client';

import { useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@smartclub/ui/select';
import { ReportPeriod } from '@smartclub/types';

interface PeriodSelectorProps {
  period: ReportPeriod;
  onPeriodChange: (period: ReportPeriod) => void;
}

export function PeriodSelector({ period, onPeriodChange }: PeriodSelectorProps) {
  const t = useTranslations('venue-admin.finance.period');

  const periods = [
    ReportPeriod.TODAY,
    ReportPeriod.YESTERDAY,
    ReportPeriod.LAST_7_DAYS,
    ReportPeriod.LAST_30_DAYS,
    ReportPeriod.THIS_WEEK,
    ReportPeriod.LAST_WEEK,
    ReportPeriod.THIS_MONTH,
    ReportPeriod.LAST_MONTH,
    ReportPeriod.THIS_YEAR,
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">{t('label')}</span>
      <Select value={period} onValueChange={(v) => onPeriodChange(v as ReportPeriod)}>
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {periods.map((p) => (
            <SelectItem key={p} value={p}>
              {t(p)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
