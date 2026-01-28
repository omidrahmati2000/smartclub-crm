import { useTranslations } from 'next-intl';
import { Button } from '@smartclub/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@smartclub/ui/tabs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '@smartclub/utils';

type ViewMode = 'day' | 'week' | 'month';

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  locale: string;
}

export function CalendarHeader({
  currentDate,
  viewMode,
  onViewModeChange,
  onPrevious,
  onNext,
  onToday,
  locale,
}: CalendarHeaderProps) {
  const t = useTranslations('venue-admin.calendar');

  const getDateRangeLabel = () => {
    if (viewMode === 'day') {
      return formatDate(currentDate.toISOString(), locale as 'fa' | 'en');
    }
    // For week and month views, we'll add proper formatting later
    return formatDate(currentDate.toISOString(), locale as 'fa' | 'en');
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Date Navigation */}
      <div className="flex items-center gap-2">
        <Button onClick={onToday} variant="outline" size="sm">
          {t('today')}
        </Button>
        <div className="flex items-center gap-1">
          <Button onClick={onPrevious} variant="ghost" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button onClick={onNext} variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-lg font-semibold min-w-[200px]">
          {getDateRangeLabel()}
        </h2>
      </div>

      {/* View Mode Tabs */}
      <Tabs
        value={viewMode}
        onValueChange={(value) => onViewModeChange(value as ViewMode)}
      >
        <TabsList>
          <TabsTrigger value="day">{t('dayView')}</TabsTrigger>
          <TabsTrigger value="week">{t('weekView')}</TabsTrigger>
          <TabsTrigger value="month">{t('monthView')}</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
