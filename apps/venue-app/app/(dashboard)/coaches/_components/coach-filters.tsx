'use client';

import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import {
  Card,
  CardContent,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@smartclub/ui';

interface CoachFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  levelFilter: string;
  onLevelChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function CoachFilters({
  searchQuery,
  onSearchChange,
  levelFilter,
  onLevelChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
}: CoachFiltersProps) {
  const t = useTranslations('venue-admin.coaches');

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('filters.search')}
              className="pl-9"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Level filter */}
          <Select value={levelFilter} onValueChange={onLevelChange}>
            <SelectTrigger className="w-full md:w-[160px]">
              <SelectValue placeholder={t('filters.filterByLevel')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('levels.all')}</SelectItem>
              <SelectItem value="Elite">{t('levels.Elite')}</SelectItem>
              <SelectItem value="Head Coach">{t('levels.HeadCoach')}</SelectItem>
              <SelectItem value="Advanced">{t('levels.Advanced')}</SelectItem>
              <SelectItem value="Standard">{t('levels.Standard')}</SelectItem>
            </SelectContent>
          </Select>

          {/* Status filter */}
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue placeholder={t('filters.filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('status.all')}</SelectItem>
              <SelectItem value="active">{t('status.active')}</SelectItem>
              <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue placeholder={t('filters.sortBy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">{t('sort.name')}</SelectItem>
              <SelectItem value="rating">{t('sort.rating')}</SelectItem>
              <SelectItem value="students">{t('sort.students')}</SelectItem>
              <SelectItem value="experience">{t('sort.experience')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
