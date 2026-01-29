'use client';

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
  return (
    <Select value={value} onValueChange={(v) => onChange(v as ReportPeriod)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="today">امروز</SelectItem>
        <SelectItem value="last7days">۷ روز گذشته</SelectItem>
        <SelectItem value="last30days">۳۰ روز گذشته</SelectItem>
        <SelectItem value="thisMonth">این ماه</SelectItem>
        <SelectItem value="lastMonth">ماه گذشته</SelectItem>
        <SelectItem value="thisYear">امسال</SelectItem>
      </SelectContent>
    </Select>
  );
}
