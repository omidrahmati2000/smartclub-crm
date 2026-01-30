'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, MapPin, DollarSign, CheckCircle2 } from 'lucide-react';
import type { Venue, Asset } from '@smartclub/types';
import type { Session } from 'next-auth';
import { Button } from '@smartclub/ui/button';
import { Separator } from '@smartclub/ui/separator';

interface DurationBookingSummaryProps {
  venue: Venue;
  asset: Asset;
  selectedDate: Date | null;
  selectedStartTime: string | null;
  selectedDuration: number;
  session: Session | null;
}

export function DurationBookingSummary({
  venue,
  asset,
  selectedDate,
  selectedStartTime,
  selectedDuration,
  session,
}: DurationBookingSummaryProps) {
  const locale = useLocale();
  const t = useTranslations('booking.summary');
  const tError = useTranslations('booking.error');
  const tConfirm = useTranslations('booking.confirmation');
  const tDuration = useTranslations('booking.durationBased');
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    if (asset.currency === 'IRT' || asset.currency === 'IRR') {
      return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: asset.currency || 'USD',
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  const calculatePrice = () => {
    return ((asset.pricePerHour || 0) / 60) * selectedDuration;
  };

  const handleConfirm = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!selectedDate || !selectedStartTime) return;

    setIsProcessing(true);
    setError(null);

    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const endTime = calculateEndTime(selectedStartTime, selectedDuration);

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetId: asset.id,
          userId: session.user.id,
          date: dateStr,
          startTime: selectedStartTime,
          endTime: endTime,
          duration: selectedDuration,
          totalPrice: calculatePrice(),
          currency: asset.currency,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setBookingId(data.data.id);
        setIsConfirmed(true);
      } else {
        setError(data.message || tError('unknownError'));
      }
    } catch (err) {
      setError(tError('unknownError'));
    } finally {
      setIsProcessing(false);
    }
  };

  // Confirmation success state
  if (isConfirmed && bookingId) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-green-600">{tConfirm('title')}</h3>
          <p className="text-sm text-muted-foreground mt-2">{tConfirm('subtitle')}</p>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <p className="text-xs text-muted-foreground">{tConfirm('bookingId')}</p>
          <p className="font-mono font-semibold mt-1">{bookingId}</p>
        </div>

        <div className="space-y-2">
          <Button asChild className="w-full">
            <Link href="/my-bookings">{tConfirm('viewBooking')}</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href={`/venues/${venue.slug}`}>{tConfirm('backToVenue')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Normal booking summary
  const canBook = selectedDate && selectedStartTime;
  const endTime = selectedStartTime ? calculateEndTime(selectedStartTime, selectedDuration) : null;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">{t('title')}</h3>

      <div className="space-y-4">
        {/* Venue */}
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium">{t('venue')}</p>
            <p className="text-sm text-muted-foreground">{venue.name}</p>
          </div>
        </div>

        {/* Asset */}
        <div className="flex items-start gap-3">
          <div className="h-5 w-5 flex items-center justify-center mt-0.5">
            <div className="h-3 w-3 rounded-full bg-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{t('asset')}</p>
            <p className="text-sm text-muted-foreground">{asset.name}</p>
          </div>
        </div>

        {/* Date */}
        {selectedDate && (
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">{t('date')}</p>
              <p className="text-sm text-muted-foreground">{formatDate(selectedDate)}</p>
            </div>
          </div>
        )}

        {/* Time & Duration */}
        {selectedStartTime && (
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">{t('time')}</p>
              <p className="text-sm text-muted-foreground">
                {selectedStartTime} - {endTime}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedDuration} {t('minutes')}
              </p>
            </div>
          </div>
        )}
      </div>

      {canBook && (
        <>
          <Separator />

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">{t('total')}</span>
            </div>
            <span className="text-lg font-bold text-primary">
              {formatPrice(calculatePrice())}
            </span>
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Actions */}
          {!session ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground text-center">{t('loginRequired')}</p>
              <Button className="w-full" onClick={handleConfirm}>
                {t('loginNow')}
              </Button>
            </div>
          ) : (
            <Button
              className="w-full"
              size="lg"
              onClick={handleConfirm}
              disabled={isProcessing}
            >
              {isProcessing ? t('processing') : t('confirm')}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
