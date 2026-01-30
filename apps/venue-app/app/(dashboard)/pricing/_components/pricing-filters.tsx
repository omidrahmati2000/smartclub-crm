'use client';

import { Input } from '@smartclub/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@smartclub/ui/select';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PricingRuleType, PricingRuleStatus } from '@smartclub/types';

interface PricingFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export function PricingFilters({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
}: PricingFiltersProps) {
  const t = useTranslations('venue-admin.pricing');

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t('search')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder={t('filterByType')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('types.all')}</SelectItem>
          <SelectItem value={PricingRuleType.PEAK_HOURS}>{t('types.PEAK_HOURS')}</SelectItem>
          <SelectItem value={PricingRuleType.DAY_OF_WEEK}>{t('types.DAY_OF_WEEK')}</SelectItem>
          <SelectItem value={PricingRuleType.SPECIAL_DATE}>{t('types.SPECIAL_DATE')}</SelectItem>
          <SelectItem value={PricingRuleType.LAST_MINUTE}>{t('types.LAST_MINUTE')}</SelectItem>
          <SelectItem value={PricingRuleType.PROMOTIONAL}>{t('types.PROMOTIONAL')}</SelectItem>
          <SelectItem value={PricingRuleType.EARLY_BIRD}>{t('types.EARLY_BIRD')}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder={t('filterByStatus')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('status.all')}</SelectItem>
          <SelectItem value={PricingRuleStatus.ACTIVE}>{t('status.ACTIVE')}</SelectItem>
          <SelectItem value={PricingRuleStatus.INACTIVE}>{t('status.INACTIVE')}</SelectItem>
          <SelectItem value={PricingRuleStatus.SCHEDULED}>{t('status.SCHEDULED')}</SelectItem>
          <SelectItem value={PricingRuleStatus.EXPIRED}>{t('status.EXPIRED')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
