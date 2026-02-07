'use client';

import * as React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { cn } from '@smartclub/utils';
import { Button } from '@smartclub/ui/button';
import { Calendar } from '@smartclub/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@smartclub/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@smartclub/ui/select';
import { Loader2 } from 'lucide-react';

interface DatePickerButtonProps {
  date: Date;
  onDateChange: (date: Date) => void;
  showAsDateDisplay?: boolean;
  dateLabel?: string;
  isLoading?: boolean;
}

export function DatePickerButton({
  date,
  onDateChange,
  showAsDateDisplay = false,
  dateLabel,
  isLoading = false
}: DatePickerButtonProps) {
  const locale = useLocale();
  const t = useTranslations('venue-admin.calendar');
  const [open, setOpen] = React.useState(false);
  const [viewDate, setViewDate] = React.useState(date);

  React.useEffect(() => {
    setViewDate(date);
  }, [date]);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onDateChange(selectedDate);
      setOpen(false);
    }
  };

  const formatDisplayDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getRelativeDateLabel = (date: Date): string | null => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    const diffTime = checkDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t('today');
    if (diffDays === -1) return locale === 'fa' ? 'دیروز' : 'Yesterday';
    if (diffDays === 1) return locale === 'fa' ? 'فردا' : 'Tomorrow';
    return null;
  };

  const quickDates = [
    { label: locale === 'fa' ? 'دیروز' : 'Yesterday', offset: -1 },
    { label: t('today'), offset: 0 },
    { label: locale === 'fa' ? 'فردا' : 'Tomorrow', offset: 1 },
  ];

  const getQuickDate = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d;
  };

  const relativeLabel = getRelativeDateLabel(date);

  // Month and Year selection
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(viewDate.getFullYear(), i, 1);
    return {
      value: i,
      label: new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
        month: 'long'
      }).format(d)
    };
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(parseInt(monthIndex));
    setViewDate(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(viewDate);
    newDate.setFullYear(parseInt(year));
    setViewDate(newDate);
  };

  // Date Display Mode (replaces the center text)
  if (showAsDateDisplay) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="flex-1 px-2 sm:px-4 flex flex-col items-center justify-center min-w-[120px] sm:min-w-[160px] cursor-pointer hover:bg-background/50 transition-colors rounded-lg group">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest text-foreground/80 leading-none mb-1 text-center group-hover:text-primary transition-colors">
              {dateLabel || formatDisplayDate(date)}
            </h2>
            {isLoading && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-gradient-to-br from-background via-background to-primary/5 backdrop-blur-xl border-2 shadow-2xl rounded-2xl overflow-hidden"
          align="center"
          side="bottom"
          sideOffset={12}
        >
          <DatePickerContent
            date={date}
            viewDate={viewDate}
            handleSelect={handleSelect}
            quickDates={quickDates}
            getQuickDate={getQuickDate}
            months={months}
            years={years}
            handleMonthChange={handleMonthChange}
            handleYearChange={handleYearChange}
            formatDisplayDate={formatDisplayDate}
            locale={locale}
            t={t}
          />
        </PopoverContent>
      </Popover>
    );
  }

  // Button Mode (original)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'h-9 sm:h-11 px-3 sm:px-4 rounded-xl border-dashed hover:border-solid hover:bg-primary/5 hover:text-primary transition-all font-bold gap-2 shrink-0 group',
            !date && 'text-muted-foreground'
          )}
          title={t('goToDate')}
        >
          <CalendarIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
          <span className="hidden md:inline">
            {date ? (relativeLabel || formatDisplayDate(date)) : t('selectDate')}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-gradient-to-br from-background via-background to-primary/5 backdrop-blur-xl border-2 shadow-2xl rounded-2xl overflow-hidden"
        align={locale === 'fa' ? 'end' : 'start'}
        side="bottom"
        sideOffset={12}
      >
        <DatePickerContent
          date={date}
          viewDate={viewDate}
          handleSelect={handleSelect}
          quickDates={quickDates}
          getQuickDate={getQuickDate}
          months={months}
          years={years}
          handleMonthChange={handleMonthChange}
          handleYearChange={handleYearChange}
          formatDisplayDate={formatDisplayDate}
          locale={locale}
          t={t}
        />
      </PopoverContent>
    </Popover>
  );
}

// Separate component for the picker content
function DatePickerContent({
  date,
  viewDate,
  handleSelect,
  quickDates,
  getQuickDate,
  months,
  years,
  handleMonthChange,
  handleYearChange,
  formatDisplayDate,
  locale,
  t,
}: any) {
  return (
    <>
      {/* Quick Date Selectors */}
      <div className="flex gap-2 p-4 pb-2 border-b border-border/50">
        {quickDates.map((quick: any, idx: number) => {
          const quickDate = getQuickDate(quick.offset);
          const isSelected = quickDate.toDateString() === date.toDateString();

          return (
            <Button
              key={idx}
              onClick={() => handleSelect(quickDate)}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              className={cn(
                'flex-1 h-10 rounded-xl font-bold text-xs transition-all duration-300 relative overflow-hidden group',
                isSelected
                  ? 'shadow-xl scale-105 ring-2 ring-primary ring-offset-2 bg-gradient-to-br from-primary to-primary/80'
                  : 'hover:scale-105 hover:shadow-lg hover:border-primary/50 hover:bg-primary/5'
              )}
            >
              <span className="relative z-10">{quick.label}</span>
              {!isSelected && (
                <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              )}
            </Button>
          );
        })}
      </div>

      {/* Month and Year Selectors */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <Select value={viewDate.getMonth().toString()} onValueChange={handleMonthChange}>
          <SelectTrigger className="flex-1 h-10 rounded-xl font-bold border-primary/20 bg-primary/5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((month: any) => (
              <SelectItem key={month.value} value={month.value.toString()}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={viewDate.getFullYear().toString()} onValueChange={handleYearChange}>
          <SelectTrigger className="w-[120px] h-10 rounded-xl font-bold border-primary/20 bg-primary/5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((year: number) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Calendar */}
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleSelect}
        month={viewDate}
        className="rounded-xl border-0 p-4 pt-2"
        classNames={{
          nav: 'hidden', // Hide navigation arrows
          month_caption: 'hidden', // Hide default month caption
        }}
      />

      {/* Selected Date Display */}
      <div className="px-4 pb-4 pt-3 border-t border-border/50 bg-gradient-to-b from-transparent to-primary/5">
        <div className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-background/50 border border-border/50">
          <span className="font-semibold text-muted-foreground">
            {t('selectedDate') || 'Selected Date'}
          </span>
          <span className="font-black text-primary text-sm">
            {formatDisplayDate(date)}
          </span>
        </div>
      </div>
    </>
  );
}
