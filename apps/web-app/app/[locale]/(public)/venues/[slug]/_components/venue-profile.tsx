'use client';

import { useTranslations } from 'next-intl';
import { Star, MapPin, Phone, Mail, Globe, Clock } from 'lucide-react';
import type { Venue, Asset } from '@smartclub/types';
import { Button } from '@smartclub/ui/button';
import { Badge } from '@smartclub/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@smartclub/ui/card';
import { VenueHours } from './venue-hours';
import { VenueAssets } from './venue-assets';

interface VenueProfileProps {
  venue: Venue;
  assets: Asset[];
  locale: string;
}

export function VenueProfile({ venue, assets, locale }: VenueProfileProps) {
  const t = useTranslations('venue.profile');
  const tc = useTranslations('common');
  const tContact = useTranslations('venue.contact');

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full bg-gradient-to-br from-primary/20 to-primary/5">
        {venue.coverImageUrl ? (
          <img
            src={venue.coverImageUrl}
            alt={venue.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-8xl font-bold text-muted-foreground/20">
              {venue.name.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Venue name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold text-white">{venue.name}</h1>
            <div className="mt-2 flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{venue.rating}</span>
                <span className="text-sm">({venue.reviewCount} {tc('venue.reviews')})</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-5 w-5" />
                <span>{venue.city}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>{t('about')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{venue.description}</p>
              </CardContent>
            </Card>

            {/* Sports */}
            <Card>
              <CardHeader>
                <CardTitle>{t('sports')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {venue.sportTypes.map((sport) => (
                    <Badge key={sport} variant="secondary" className="text-sm">
                      {tc(`sports.${sport}`)}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            {venue.amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('amenities')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {venue.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Assets */}
            {assets.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('assets')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <VenueAssets assets={assets} venueSlug={venue.slug} locale={locale} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Operating Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {t('operatingHours')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VenueHours operatingHours={venue.operatingHours} />
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>{t('contactInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{tContact('phone')}</p>
                    <a
                      href={`tel:${venue.phone}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {venue.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                {venue.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{tContact('email')}</p>
                      <a
                        href={`mailto:${venue.email}`}
                        className="text-sm text-primary hover:underline break-all"
                      >
                        {venue.email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{tContact('address')}</p>
                    <p className="text-sm text-muted-foreground">{venue.address}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 space-y-2">
                  <Button className="w-full" size="lg">
                    {t('bookNow')}
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <a
                      href={`https://maps.google.com/?q=${venue.latitude},${venue.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {tContact('getDirections')}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
