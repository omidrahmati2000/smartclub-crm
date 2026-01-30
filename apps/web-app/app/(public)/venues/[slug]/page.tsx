import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { VenueProfile } from './_components/venue-profile';

type Props = {
  params: Promise<{ slug: string }>;
};

async function getVenue(slug: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/venues/${slug}`, {
      cache: 'no-store',
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Failed to fetch venue:', error);
    return null;
  }
}

async function getVenueAssets(venueId: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/venues/${venueId}/assets`, {
      cache: 'no-store',
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Failed to fetch assets:', error);
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const venue = await getVenue(slug);

  if (!venue) {
    const t = await getTranslations('venue.notFound');
    return {
      title: t('title'),
      description: t('description'),
    };
  }

  return {
    title: venue.name,
    description: venue.description,
  };
}

export default async function VenuePage({ params }: Props) {
  const { slug } = await params;

  const venue = await getVenue(slug);

  if (!venue) {
    notFound();
  }

  const assets = await getVenueAssets(venue.id);

  return <VenueProfile venue={venue} assets={assets} />;
}
