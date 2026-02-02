'use client';

import { useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@smartclub/ui/select';

export type ReportPeriod = 'today' | 'last7days' | 'last30days' | 'thisMonth' | 'lastMonth' | 'thisYear';

interface PeriodSelectorProps {
  value: ReportPeriod;
  onChange: (value: ReportPeriod) => void;
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  const t = useTranslations('venue-admin.reports.periods');

  return (
    <Select value={value} onValueChange={(v) => onChange(v as ReportPeriod)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="today">{t('today')}</SelectItem>
        <SelectItem value="last7days">{t('last7days')}</SelectItem>
        <SelectItem value="last30days">{t('last30days')}</SelectItem>
        <SelectItem value="thisMonth">{t('thisMonth')}</SelectItem>
        <SelectItem value="lastMonth">{t('lastMonth')}</SelectItem>
        <SelectItem value="thisYear">{t('thisYear')}</SelectItem>
      </SelectContent>
    </Select>
  );
}
