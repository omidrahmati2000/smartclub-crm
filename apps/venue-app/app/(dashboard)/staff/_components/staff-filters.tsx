'use client';

import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { Input } from '@smartclub/ui/input';
import { Label } from '@smartclub/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@smartclub/ui/select';
import { VenueRole, StaffStatus } from '@smartclub/types';

interface StaffFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  roleFilter: VenueRole | 'all';
  onRoleFilterChange: (value: VenueRole | 'all') => void;
  statusFilter: StaffStatus | 'all';
  onStatusFilterChange: (value: StaffStatus | 'all') => void;
  sortBy: 'name' | 'role' | 'hireDate';
  onSortByChange: (value: 'name' | 'role' | 'hireDate') => void;
}

export function StaffFilters({
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
}: StaffFiltersProps) {
  const t = useTranslations('venue-admin.staff');
  const tCommon = useTranslations('venue-admin.common');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Search */}
      <div className="space-y-2">
        <Label>{tCommon('search')}</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:left-auto rtl:right-3" />
          <Input
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 rtl:pr-9 rtl:pl-3"
          />
        </div>
      </div>

      {/* Role Filter */}
      <div className="space-y-2">
        <Label>{t('filterByRole')}</Label>
        <Select value={roleFilter} onValueChange={(value) => onRoleFilterChange(value as VenueRole | 'all')}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('roles.all')}</SelectItem>
            <SelectItem value={VenueRole.OWNER}>{t('roles.OWNER')}</SelectItem>
            <SelectItem value={VenueRole.MANAGER}>{t('roles.MANAGER')}</SelectItem>
            <SelectItem value={VenueRole.RECEPTIONIST}>{t('roles.RECEPTIONIST')}</SelectItem>
            <SelectItem value={VenueRole.CASHIER}>{t('roles.CASHIER')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <Label>{t('filterByStatus')}</Label>
        <Select value={statusFilter} onValueChange={(value) => onStatusFilterChange(value as StaffStatus | 'all')}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('status.all')}</SelectItem>
            <SelectItem value={StaffStatus.ACTIVE}>{t('status.ACTIVE')}</SelectItem>
            <SelectItem value={StaffStatus.INACTIVE}>{t('status.INACTIVE')}</SelectItem>
            <SelectItem value={StaffStatus.INVITED}>{t('status.INVITED')}</SelectItem>
            <SelectItem value={StaffStatus.SUSPENDED}>{t('status.SUSPENDED')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <Label>{t('sortBy')}</Label>
        <Select value={sortBy} onValueChange={(value) => onSortByChange(value as 'name' | 'role' | 'hireDate')}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">{t('sort.name')}</SelectItem>
            <SelectItem value="role">{t('sort.role')}</SelectItem>
            <SelectItem value="hireDate">{t('sort.hireDate')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
