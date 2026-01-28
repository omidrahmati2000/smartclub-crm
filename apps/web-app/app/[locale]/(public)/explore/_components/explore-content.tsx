'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import type { Venue } from '@smartclub/types';
import { SearchFilters } from './search-filters';
import { VenueCard } from './venue-card';

interface ExploreContentProps {
  locale: string;
}

export function ExploreContent({ locale }: ExploreContentProps) {
  const t = useTranslations('explore');
  const tc = useTranslations('common');

  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('all');
  const [sportType, setSportType] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    fetchVenues();
  }, [searchQuery, city, sportType]);

  const fetchVenues = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (city !== 'all') params.append('city', city);

      const response = await fetch(`/api/venues?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        let filteredVenues = data.data;

        // Filter by sport type
        if (sportType !== 'all') {
          filteredVenues = filteredVenues.filter((v: Venue) =>
            v.sportTypes.includes(sportType as any)
          );
        }

        // Sort venues
        if (sortBy === 'rating') {
          filteredVenues.sort((a: Venue, b: Venue) => b.rating - a.rating);
        } else if (sortBy === 'reviewCount') {
          filteredVenues.sort((a: Venue, b: Venue) => b.reviewCount - a.reviewCount);
        } else if (sortBy === 'newest') {
          filteredVenues.sort(
            (a: Venue, b: Venue) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }

        setVenues(filteredVenues);
      }
    } catch (error) {
      console.error('Failed to fetch venues:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {t('title')}
            </h1>
            <p className="mt-2 text-muted-foreground md:text-lg">{t('subtitle')}</p>
          </div>

          {/* Search and filters */}
          <div className="mt-8">
            <SearchFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              city={city}
              onCityChange={setCity}
              sportType={sportType}
              onSportTypeChange={setSportType}
              sortBy={sortBy}
              onSortByChange={setSortBy}
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">{tc('loading')}</p>
            </div>
          </div>
        ) : venues.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold">{t('results.noResults')}</h2>
            <p className="mt-2 text-muted-foreground max-w-md">
              {t('results.noResultsSubtitle')}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                {t('results.showing', { count: venues.length })}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {venues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} locale={locale} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
