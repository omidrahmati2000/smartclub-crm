'use client';

import { useTranslations } from 'next-intl';
import { Search, X } from 'lucide-react';
import { Input } from '@smartclub/ui/input';
import { Button } from '@smartclub/ui/button';
import { Label } from '@smartclub/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@smartclub/ui/select';
import { SportType } from '@smartclub/types';

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  city: string;
  onCityChange: (city: string) => void;
  sportType: string;
  onSportTypeChange: (sport: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
}

export function SearchFilters({
  searchQuery,
  onSearchChange,
  city,
  onCityChange,
  sportType,
  onSportTypeChange,
  sortBy,
  onSortByChange,
}: SearchFiltersProps) {
  const t = useTranslations('explore');
  const tc = useTranslations('common');

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t('search.placeholder')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pr-10"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* City filter */}
        <div className="space-y-2">
          <Label htmlFor="city">{t('filters.city')}</Label>
          <Select value={city} onValueChange={onCityChange}>
            <SelectTrigger id="city">
              <SelectValue placeholder={t('filters.all')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filters.all')}</SelectItem>
              <SelectItem value="تهران">تهران</SelectItem>
              <SelectItem value="مشهد">مشهد</SelectItem>
              <SelectItem value="اصفهان">اصفهان</SelectItem>
              <SelectItem value="شیراز">شیراز</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sport type filter */}
        <div className="space-y-2">
          <Label htmlFor="sport">{t('filters.sport')}</Label>
          <Select value={sportType} onValueChange={onSportTypeChange}>
            <SelectTrigger id="sport">
              <SelectValue placeholder={t('filters.all')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filters.all')}</SelectItem>
              <SelectItem value={SportType.PADEL}>{tc('sports.padel')}</SelectItem>
              <SelectItem value={SportType.TENNIS}>{tc('sports.tennis')}</SelectItem>
              <SelectItem value={SportType.FOOTBALL}>{tc('sports.football')}</SelectItem>
              <SelectItem value={SportType.SWIMMING}>{tc('sports.swimming')}</SelectItem>
              <SelectItem value={SportType.BILLIARDS}>{tc('sports.billiards')}</SelectItem>
              <SelectItem value={SportType.GAMING}>{tc('sports.gaming')}</SelectItem>
              <SelectItem value={SportType.VR}>{tc('sports.vr')}</SelectItem>
              <SelectItem value={SportType.BOARD_GAMES}>{tc('sports.boardGames')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort by */}
        <div className="space-y-2">
          <Label htmlFor="sort">{t('sort.label')}</Label>
          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger id="sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">{t('sort.relevance')}</SelectItem>
              <SelectItem value="rating">{t('sort.rating')}</SelectItem>
              <SelectItem value="reviewCount">{t('sort.reviewCount')}</SelectItem>
              <SelectItem value="newest">{t('sort.newest')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset button */}
        <div className="flex items-end">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              onSearchChange('');
              onCityChange('all');
              onSportTypeChange('all');
              onSortByChange('relevance');
            }}
          >
            {t('filters.reset')}
          </Button>
        </div>
      </div>
    </div>
  );
}
