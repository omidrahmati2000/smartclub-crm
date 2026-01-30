'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import type { Venue, Asset } from '@smartclub/types';
import { BookingType } from '@smartclub/types';
import { Button } from '@smartclub/ui/button';
import { Card } from '@smartclub/ui/card';
import { DatePicker } from './date-picker';
import { SlotSelector } from './slot-selector';
import { BookingSummary } from './booking-summary';
import { DurationBookingFlow } from './duration-booking-flow';

interface BookingFlowProps {
  venue: Venue;
  asset: Asset;
}

export function BookingFlow({ venue, asset }: BookingFlowProps) {
  // If duration-based, use different flow
  if (asset.bookingType === BookingType.DURATION_BASED) {
    return <DurationBookingFlow venue={venue} asset={asset} />;
  }

  // Otherwise use slot-based flow
  const t = useTranslations('booking.slotBased');
  const router = useRouter();
  const { data: session } = useSession();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    startTime: string;
    endTime: string;
    price: number;
  } | null>(null);

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
              />
            </Card>

            {/* Slot Selection */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">{t('selectSlot')}</h2>
              {!selectedDate ? (
                <div className="text-center py-12 text-muted-foreground">
                  {t('selectDateFirst')}
                </div>
              ) : (
                <SlotSelector
                  assetId={asset.id}
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  onSlotChange={setSelectedSlot}
                  slotDuration={asset.slotDuration || 90}
                />
              )}
            </Card>
          </div>

          {/* Right - Summary */}
          <div>
            <Card className="p-6 sticky top-4">
              <BookingSummary
                venue={venue}
                asset={asset}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                session={session}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
