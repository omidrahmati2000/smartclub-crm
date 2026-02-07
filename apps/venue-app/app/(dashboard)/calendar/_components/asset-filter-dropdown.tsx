'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@smartclub/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@smartclub/ui/dropdown-menu';
import { ScrollArea } from '@smartclub/ui/scroll-area';
import { Filter } from 'lucide-react';
import type { Asset } from '@smartclub/types';
import { SportType } from '@smartclub/types';

interface AssetFilterDropdownProps {
  assets: Asset[];
  selectedAssetIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
}

const SPORT_TYPE_ORDER: SportType[] = [
  SportType.PADEL,
  SportType.TENNIS,
  SportType.FOOTBALL,
  SportType.SWIMMING,
  SportType.GAMING,
  SportType.BILLIARDS,
  SportType.VR,
];

export function AssetFilterDropdown({
  assets,
  selectedAssetIds,
  onSelectionChange,
}: AssetFilterDropdownProps) {
  const t = useTranslations('venue-admin.calendar');

  const allSelected = selectedAssetIds.size === assets.length;

  const handleSelectAll = () => {
    onSelectionChange(new Set(assets.map((a) => a.id)));
  };

  const handleDeselectAll = () => {
    onSelectionChange(new Set());
  };

  const handleToggle = (assetId: string) => {
    const next = new Set(selectedAssetIds);
    if (next.has(assetId)) {
      next.delete(assetId);
    } else {
      next.add(assetId);
    }
    onSelectionChange(next);
  };

  // Group assets by sport type
  const grouped = new Map<SportType, Asset[]>();
  for (const asset of assets) {
    const type = asset.type as SportType;
    if (!grouped.has(type)) {
      grouped.set(type, []);
    }
    grouped.get(type)!.push(asset);
  }

  // Sort groups by defined order
  const sortedGroups = [...grouped.entries()].sort((a, b) => {
    const idxA = SPORT_TYPE_ORDER.indexOf(a[0]);
    const idxB = SPORT_TYPE_ORDER.indexOf(b[0]);
    return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
  });

  const getSportTypeLabel = (type: SportType): string => {
    const key = type.toLowerCase();
    return t(`sportTypes.${key}`, { defaultValue: type });
  };

  const triggerLabel = allSelected
    ? t('allAssets')
    : t('assetsSelected', {
        count: selectedAssetIds.size,
        total: assets.length,
      });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 sm:h-11 px-3 sm:px-4 rounded-xl border-dashed hover:border-solid hover:bg-primary/5 hover:text-primary transition-all font-bold gap-2 text-[10px] sm:text-xs"
        >
          <Filter className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{triggerLabel}</span>
          {!allSelected && (
            <span className="sm:hidden bg-primary text-primary-foreground rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-black">
              {selectedAssetIds.size}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[240px] rounded-xl">
        <div className="flex items-center justify-between px-2 py-1.5">
          <button
            onClick={handleSelectAll}
            className="text-[10px] font-bold text-primary hover:underline"
          >
            {t('selectAll')}
          </button>
          <button
            onClick={handleDeselectAll}
            className="text-[10px] font-bold text-muted-foreground hover:underline"
          >
            {t('deselectAll')}
          </button>
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="max-h-[280px]">
          {sortedGroups.map(([sportType, groupAssets], groupIdx) => (
            <div key={sportType}>
              {groupIdx > 0 && <DropdownMenuSeparator />}
              <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 px-2">
                {getSportTypeLabel(sportType)}
              </DropdownMenuLabel>
              {groupAssets.map((asset) => (
                <DropdownMenuCheckboxItem
                  key={asset.id}
                  checked={selectedAssetIds.has(asset.id)}
                  onCheckedChange={() => handleToggle(asset.id)}
                  onSelect={(e) => e.preventDefault()}
                  className="text-xs font-medium"
                >
                  {asset.name}
                </DropdownMenuCheckboxItem>
              ))}
            </div>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
