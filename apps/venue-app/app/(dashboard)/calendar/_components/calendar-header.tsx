import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@smartclub/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@smartclub/ui/tabs';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2, Rows3, Rows4 } from 'lucide-react';
import { formatDate } from '@smartclub/utils';
import { cn } from '@smartclub/utils';
import type { Asset } from '@smartclub/types';
import { AssetFilterDropdown } from './asset-filter-dropdown';
import { DatePickerButton } from './date-picker-button';

type ViewMode = 'day' | 'week' | 'month';

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onDateChange?: (date: Date) => void;
  isLoading?: boolean;
  assets?: Asset[];
  selectedAssetIds?: Set<string>;
  onAssetFilterChange?: (ids: Set<string>) => void;
  compactMode?: boolean;
  onCompactModeChange?: (compact: boolean) => void;
}

export function CalendarHeader({
  currentDate,
  viewMode,
  onViewModeChange,
  onPrevious,
  onNext,
  onToday,
  onDateChange,
  isLoading = false,
  assets,
  selectedAssetIds,
  onAssetFilterChange,
  compactMode = false,
  onCompactModeChange,
}: CalendarHeaderProps) {
  const t = useTranslations('venue-admin.calendar');
  const locale = useLocale();

  const getDateRangeLabel = () => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      year: 'numeric'
    };

    if (viewMode === 'day') {
      return formatDate(currentDate.toISOString(), locale as 'fa' | 'en');
    }

    if (viewMode === 'month') {
      return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
        month: 'long',
        year: 'numeric'
      }).format(currentDate);
    }

    // For week view
    const start = new Date(currentDate);
    const dayOfWeek = start.getDay();
    const diff = dayOfWeek === 6 ? 0 : (dayOfWeek + 1);
    start.setDate(start.getDate() - diff);

    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    const format = new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      day: 'numeric',
      month: 'short'
    });

    return `${format.format(start)} - ${format.format(end)}`;
  };

  const showDayViewControls = viewMode === 'day' && assets && selectedAssetIds && onAssetFilterChange;

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        {/* Date Navigation */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center bg-muted/40 p-1 rounded-xl border border-border/50 shadow-sm transition-all hover:bg-muted/60 flex-1 sm:flex-none">
            <Button
              onClick={onPrevious}
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg hover:bg-background hover:shadow-sm shrink-0"
            >
              <ChevronRight className={cn("h-4 w-4", locale === 'en' ? 'rotate-180' : '')} />
            </Button>

            {/* Date Picker on Date Display */}
            {onDateChange ? (
              <DatePickerButton
                date={currentDate}
                onDateChange={onDateChange}
                showAsDateDisplay
                dateLabel={getDateRangeLabel()}
                isLoading={isLoading}
              />
            ) : (
              <div className="flex-1 px-2 sm:px-4 flex flex-col items-center justify-center min-w-[120px] sm:min-w-[160px]">
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest text-foreground/80 leading-none mb-1 text-center">
                  {getDateRangeLabel()}
                </h2>
                {isLoading && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
              </div>
            )}

            <Button
              onClick={onNext}
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg hover:bg-background hover:shadow-sm shrink-0"
            >
              <ChevronLeft className={cn("h-4 w-4", locale === 'en' ? 'rotate-180' : '')} />
            </Button>
          </div>

          <Button
            onClick={onToday}
            variant="outline"
            size="sm"
            className="h-9 sm:h-11 px-3 sm:px-6 rounded-xl border-dashed hover:border-solid hover:bg-primary/5 hover:text-primary transition-all font-bold gap-2 shrink-0"
          >
            <CalendarIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{t('today')}</span>
          </Button>

          {/* Day view controls: asset filter + compact toggle */}
          {showDayViewControls && (
            <>
              <AssetFilterDropdown
                assets={assets}
                selectedAssetIds={selectedAssetIds}
                onSelectionChange={onAssetFilterChange}
              />
              {onCompactModeChange && (
                <Button
                  onClick={() => onCompactModeChange(!compactMode)}
                  variant="outline"
                  size="icon"
                  className={cn(
                    "h-9 w-9 sm:h-11 sm:w-11 rounded-xl border-dashed hover:border-solid transition-all shrink-0",
                    compactMode && "bg-primary/10 border-primary/30 text-primary"
                  )}
                  title={t('compactView')}
                >
                  {compactMode ? <Rows4 className="h-4 w-4" /> : <Rows3 className="h-4 w-4" />}
                </Button>
              )}
            </>
          )}
        </div>

        {/* View Mode Tabs */}
        <div className="bg-muted/40 p-1 rounded-xl border border-border/50 shadow-sm">
          <Tabs
            value={viewMode}
            onValueChange={(value) => onViewModeChange(value as ViewMode)}
            className="w-full"
          >
            <TabsList className="bg-transparent h-9 p-0 gap-0.5 sm:gap-1 w-full">
              <TabsTrigger
                value="day"
                className="flex-1 sm:flex-none px-3 sm:px-6 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all font-bold text-[10px] sm:text-xs uppercase tracking-tighter"
              >
                {t('dayView')}
              </TabsTrigger>
              <TabsTrigger
                value="week"
                className="flex-1 sm:flex-none px-3 sm:px-6 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all font-bold text-[10px] sm:text-xs uppercase tracking-tighter"
              >
                {t('weekView')}
              </TabsTrigger>
              <TabsTrigger
                value="month"
                className="flex-1 sm:flex-none px-3 sm:px-6 rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all font-bold text-[10px] sm:text-xs uppercase tracking-tighter"
              >
                {t('monthView')}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
