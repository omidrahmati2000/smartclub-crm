'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import type { Venue, Asset } from '@smartclub/types';
import { Button } from '@smartclub/ui/button';
import { Card } from '@smartclub/ui/card';
import { DatePicker } from './date-picker';
import { StartTimeSelector } from './start-time-selector';
import { DurationSelector } from './duration-selector';
import { DurationBookingSummary } from './duration-booking-summary';

interface DurationBookingFlowProps {
  venue: Venue;
  asset: Asset;
  locale: string;
}

export function DurationBookingFlow({ venue, asset, locale }: DurationBookingFlowProps) {
  const t = useTranslations('booking.durationBased');
  const router = useRouter();
  const { data: session } = useSession();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(
    asset.minDuration || 30
  );

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div>
            <h1 className="text-2xl font-bold">{t('title', { assetName: asset.name })}</h1>
            <p className="text-muted-foreground mt-1">{venue.name}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left - Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date Selection */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">{t('selectDate')}</h2>
              <DatePicker
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                locale={locale}
              />
            </Card>

            {/* Start Time Selection */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">{t('selectStartTime')}</h2>
              {!selectedDate ? (
                <div className="text-center py-12 text-muted-foreground">
                  {t('selectDateFirst')}
                </div>
              ) : (
                <StartTimeSelector
                  assetId={asset.id}
                  selectedDate={selectedDate}
                  selectedStartTime={selectedStartTime}
                  onStartTimeChange={setSelectedStartTime}
                  duration={selectedDuration}
                />
              )}
            </Card>

            {/* Duration Selection */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">{t('selectDuration')}</h2>
              {!selectedStartTime ? (
                <div className="text-center py-12 text-muted-foreground">
                  {t('selectTimeFirst')}
                </div>
              ) : (
                <DurationSelector
                  minDuration={asset.minDuration || 30}
                  maxDuration={asset.maxDuration || 240}
                  selectedDuration={selectedDuration}
                  onDurationChange={setSelectedDuration}
                  pricePerHour={asset.pricePerHour || 0}
                  currency={asset.currency}
                  locale={locale}
                />
              )}
            </Card>
          </div>

          {/* Right - Summary */}
          <div>
            <Card className="p-6 sticky top-4">
              <DurationBookingSummary
                venue={venue}
                asset={asset}
                selectedDate={selectedDate}
                selectedStartTime={selectedStartTime}
                selectedDuration={selectedDuration}
                session={session}
                locale={locale}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
