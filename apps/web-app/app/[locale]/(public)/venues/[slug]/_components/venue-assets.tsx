'use client';

import { useTranslations } from 'next-intl';
import { Users, Clock, DollarSign } from 'lucide-react';
import type { Asset } from '@smartclub/types';
import { BookingType } from '@smartclub/types';
import { Button } from '@smartclub/ui/button';
import { Card, CardContent } from '@smartclub/ui/card';
import { Badge } from '@smartclub/ui/badge';

interface VenueAssetsProps {
  assets: Asset[];
  venueSlug: string;
  locale: string;
}

export function VenueAssets({ assets, venueSlug, locale }: VenueAssetsProps) {
  const t = useTranslations('venue.assets');
  const tc = useTranslations('common');

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'IRT' || currency === 'IRR') {
      return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(price);
  };

  const getBookingTypeLabel = (type: BookingType) => {
    switch (type) {
      case BookingType.SLOT_BASED:
        return t('slotBased');
      case BookingType.DURATION_BASED:
        return t('durationBased');
      case BookingType.CAPACITY_BASED:
        return t('capacityBased');
      case BookingType.OPEN_SESSION:
        return t('openSession');
      default:
        return type;
    }
  };

  const getPriceLabel = (asset: Asset) => {
    switch (asset.bookingType) {
      case BookingType.SLOT_BASED:
        return `${formatPrice(asset.pricePerSlot || 0, asset.currency)} ${t('perSlot')}`;
      case BookingType.DURATION_BASED:
        return `${formatPrice(asset.pricePerHour || 0, asset.currency)} ${t('perHour')}`;
      case BookingType.CAPACITY_BASED:
        return `${formatPrice(asset.pricePerSession || 0, asset.currency)} ${t('perSession')}`;
      case BookingType.OPEN_SESSION:
        return `${formatPrice(asset.pricePerHour || 0, asset.currency)} ${t('perHour')}`;
      default:
        return '';
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {assets.map((asset) => (
        <Card key={asset.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Asset name and type */}
              <div>
                <h3 className="font-semibold">{asset.name}</h3>
                <Badge variant="outline" className="mt-1 text-xs">
                  {getBookingTypeLabel(asset.bookingType)}
                </Badge>
              </div>

              {/* Description */}
              {asset.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {asset.description}
                </p>
              )}

              {/* Details */}
              <div className="flex flex-wrap gap-3 text-sm">
                {/* Capacity */}
                {asset.capacity && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>
                      {asset.capacity} {t('people')}
                    </span>
                  </div>
                )}

                {/* Duration info */}
                {asset.bookingType === BookingType.SLOT_BASED && asset.slotDuration && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {asset.slotDuration} {t('minutes')}
                    </span>
                  </div>
                )}

                {asset.bookingType === BookingType.DURATION_BASED && asset.minDuration && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {asset.minDuration}-{asset.maxDuration || '∞'} {t('minutes')}
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center justify-between border-t pt-3">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="font-medium text-primary">{getPriceLabel(asset)}</span>
                </div>

                <Button
                  size="sm"
                  disabled={!asset.isActive}
                  asChild={asset.isActive}
                >
                  {asset.isActive ? (
                    <a href={`/${locale}/venues/${venueSlug}/book/${asset.id}`}>
                      {t('bookAsset', { name: '' }).replace('', '').trim()}
                    </a>
                  ) : (
                    t('unavailable')
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
