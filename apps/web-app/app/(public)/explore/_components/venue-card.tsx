'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Star, MapPin, Clock } from 'lucide-react';
import type { Venue } from '@smartclub/types';
import { Button } from '@smartclub/ui/button';
import { Card, CardContent, CardFooter } from '@smartclub/ui/card';
import { Badge } from '@smartclub/ui/badge';

interface VenueCardProps {
  venue: Venue;
}

export function VenueCard({ venue }: VenueCardProps) {
  const t = useTranslations('explore.venueCard');
  const tc = useTranslations('common');

  // Check if venue is open now
  const now = new Date();
  const dayOfWeek = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const todayHours = venue.operatingHours.find((h) => h.dayOfWeek === dayOfWeek);

  let isOpenNow = false;
  if (todayHours && !todayHours.isClosed) {
    const [openHour, openMin] = todayHours.openTime.split(':').map(Number);
    const [closeHour, closeMin] = todayHours.closeTime.split(':').map(Number);
    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;

    // Handle closing after midnight
    if (closeTime < openTime) {
      isOpenNow = currentTime >= openTime || currentTime < closeTime;
    } else {
      isOpenNow = currentTime >= openTime && currentTime < closeTime;
    }
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/venues/${venue.slug}`}>
        {/* Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {venue.coverImageUrl ? (
            <img
              src={venue.coverImageUrl}
              alt={venue.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <span className="text-4xl font-bold text-muted-foreground">
                {venue.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Status badge */}
          <div className="absolute right-2 top-2">
            <Badge variant={isOpenNow ? 'default' : 'secondary'} className="shadow-md">
              {isOpenNow ? t('openNow') : t('closedNow')}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1">
            {venue.name}
          </h3>

          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {venue.description}
          </p>

          {/* Location */}
          <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{venue.city}</span>
          </div>

          {/* Rating */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{venue.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({venue.reviewCount} {t('reviews')})
            </span>
          </div>

          {/* Sports badges */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {venue.sportTypes.slice(0, 3).map((sport) => (
              <Badge key={sport} variant="outline" className="text-xs">
                {tc(`sports.${sport}`)}
              </Badge>
            ))}
            {venue.sportTypes.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{venue.sportTypes.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button className="w-full" size="sm">
            {t('viewDetails')}
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
