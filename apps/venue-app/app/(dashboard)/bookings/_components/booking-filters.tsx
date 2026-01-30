import { useTranslations } from 'next-intl';
import { Input } from '@smartclub/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@smartclub/ui/select';
import { BookingStatus } from '@smartclub/types';
import type { Asset } from '@smartclub/types';
import { Search } from 'lucide-react';

interface BookingFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  assetFilter: string;
  onAssetFilterChange: (value: string) => void;
  assets: Asset[];
}

export function BookingFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  assetFilter,
  onAssetFilterChange,
  assets,
}: BookingFiltersProps) {
  const t = useTranslations('venue-admin.bookings');

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t('searchByCustomer')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="ps-10"
        />
      </div>

      {/* Status Filter */}
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder={t('filterByStatus')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('all')}</SelectItem>
          <SelectItem value={BookingStatus.PENDING}>{t('pending')}</SelectItem>
          <SelectItem value={BookingStatus.CONFIRMED}>{t('confirmed')}</SelectItem>
          <SelectItem value={BookingStatus.CHECKED_IN}>{t('checked_in')}</SelectItem>
          <SelectItem value={BookingStatus.COMPLETED}>{t('completed')}</SelectItem>
          <SelectItem value={BookingStatus.CANCELLED}>{t('cancelled')}</SelectItem>
          <SelectItem value={BookingStatus.NO_SHOW}>{t('no_show')}</SelectItem>
        </SelectContent>
      </Select>

      {/* Asset Filter */}
      <Select value={assetFilter} onValueChange={onAssetFilterChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder={t('filterByAsset')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('all')}</SelectItem>
          {assets.map((asset) => (
            <SelectItem key={asset.id} value={asset.id}>
              {asset.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
