'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Calendar, Clock, MapPin, DollarSign, XCircle } from 'lucide-react';
import type { Booking, Venue, Asset } from '@smartclub/types';
import { BookingStatus } from '@smartclub/types';
import { Card, CardContent, CardFooter } from '@smartclub/ui/card';
import { Badge } from '@smartclub/ui/badge';
import { Button } from '@smartclub/ui/button';
import { Separator } from '@smartclub/ui/separator';

interface BookingCardProps {
  booking: Booking;
  onCancel: (bookingId: string) => void;
}

export function BookingCard({ booking, onCancel }: BookingCardProps) {
  const locale = useLocale();
  const t = useTranslations('my-bookings.card');
  const tStatus = useTranslations('my-bookings.status');

  const [venue, setVenue] = useState<Venue | null>(null);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    fetchVenueAndAsset();
  }, [booking.venueId, booking.assetId]);

  const fetchVenueAndAsset = async () => {
    try {
      // Fetch venue
      const venueRes = await fetch(`/api/venues/${booking.venueId}`);
      const venueData = await venueRes.json();
      if (venueData.success) {
        setVenue(venueData.data);
      }

      // Fetch asset
      const assetRes = await fetch(`/api/venues/${booking.venueId}/assets`);
      const assetData = await assetRes.json();
      if (assetData.success) {
        const foundAsset = assetData.data.find((a: Asset) => a.id === booking.assetId);
        setAsset(foundAsset || null);
      }
    } catch (error) {
      console.error('Failed to fetch venue/asset:', error);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'IRT' || currency === 'IRR') {
      return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString(locale === 'fa' ? 'fa-IR' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return 'default';
      case BookingStatus.COMPLETED:
        return 'secondary';
      case BookingStatus.CANCELLED:
        return 'destructive';
      case BookingStatus.PENDING:
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const canCancel = () => {
    const now = new Date();
    const bookingTime = new Date(booking.startTime);
    return (
      bookingTime > now &&
      booking.status !== BookingStatus.CANCELLED &&
      booking.status !== BookingStatus.COMPLETED
    );
  };

  const handleCancelClick = () => {
    if (showCancelConfirm) {
      onCancel(booking.id);
      setShowCancelConfirm(false);
    } else {
      setShowCancelConfirm(true);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge variant={getStatusColor(booking.status)}>
              {tStatus(booking.status.toLowerCase())}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {t('bookingId')}: {booking.id.slice(-8)}
            </span>
          </div>

          <Separator />

          {/* Venue & Asset */}
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{t('venue')}</p>
                <p className="font-medium text-sm truncate">{venue?.name || '...'}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="h-4 w-4 flex items-center justify-center mt-0.5">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{t('asset')}</p>
                <p className="text-sm truncate">{asset?.name || '...'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{t('date')}</p>
                <p className="text-sm">{formatDate(booking.startTime)}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{t('time')}</p>
                <p className="text-sm">
                  {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                </p>
              </div>
            </div>
          </div>

          {/* Duration & Price */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-sm text-muted-foreground">
              {booking.duration} {t('minutes')}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="font-semibold text-primary">
                {formatPrice(booking.totalPrice, booking.currency)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      {canCancel() && (
        <CardFooter className="p-4 pt-0">
          {showCancelConfirm ? (
            <div className="flex gap-2 w-full">
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={handleCancelClick}
              >
                <XCircle className="h-4 w-4 mr-2" />
                {t('cancelConfirm')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCancelConfirm(false)}
              >
                {t('cancelDecline')}
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleCancelClick}
            >
              {t('cancel')}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
