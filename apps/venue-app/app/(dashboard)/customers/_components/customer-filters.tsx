'use client';

import { useTranslations } from 'next-intl';
import { Input } from '@smartclub/ui/input';
import { Button } from '@smartclub/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@smartclub/ui/select';
import { CustomerStatus } from '@smartclub/types';
import { Search, Download } from 'lucide-react';

interface CustomerFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: CustomerStatus | 'all';
  onStatusFilterChange: (value: CustomerStatus | 'all') => void;
  sortBy: 'name' | 'totalSpent' | 'totalBookings' | 'lastVisit';
  onSortByChange: (value: 'name' | 'totalSpent' | 'totalBookings' | 'lastVisit') => void;
  onExportCSV: () => void;
}

export function CustomerFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  onExportCSV,
}: CustomerFiltersProps) {
  const t = useTranslations('venue-admin.customers');

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      {/* Search */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pe-10"
          />
        </div>
      </div>

      {/* Status Filter */}
      <div className="w-full md:w-48">
        <Select
          value={statusFilter}
          onValueChange={(value) => onStatusFilterChange(value as CustomerStatus | 'all')}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('filterByStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('status.all')}</SelectItem>
            <SelectItem value={CustomerStatus.ACTIVE}>{t('status.ACTIVE')}</SelectItem>
            <SelectItem value={CustomerStatus.VIP}>{t('status.VIP')}</SelectItem>
            <SelectItem value={CustomerStatus.REGULAR}>{t('status.REGULAR')}</SelectItem>
            <SelectItem value={CustomerStatus.NEW}>{t('status.NEW')}</SelectItem>
            <SelectItem value={CustomerStatus.INACTIVE}>{t('status.INACTIVE')}</SelectItem>
            <SelectItem value={CustomerStatus.BLACKLISTED}>{t('status.BLACKLISTED')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort By */}
      <div className="w-full md:w-48">
        <Select
          value={sortBy}
          onValueChange={(value) => onSortByChange(value as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('sortBy')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">{t('sort.name')}</SelectItem>
            <SelectItem value="totalSpent">{t('sort.totalSpent')}</SelectItem>
            <SelectItem value="totalBookings">{t('sort.totalBookings')}</SelectItem>
            <SelectItem value="lastVisit">{t('sort.lastVisit')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Export CSV Button */}
      <Button variant="outline" onClick={onExportCSV}>
        <Download className="me-2 h-4 w-4" />
        {t('exportCSV')}
      </Button>
    </div>
  );
}
