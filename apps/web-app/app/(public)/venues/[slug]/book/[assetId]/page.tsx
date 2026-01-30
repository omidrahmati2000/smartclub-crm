import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { BookingFlow } from './_components/booking-flow';

type Props = {
  params: Promise<{ slug: string; assetId: string }>;
};

async function getVenue(slug: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/venues/${slug}`, {
      cache: 'no-store',
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    return null;
  }
}

async function getAsset(assetId: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/venues/all/assets`, {
      cache: 'no-store',
    });
    const data = await response.json();
    if (data.success) {
      return data.data.find((a: any) => a.id === assetId);
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: Props) {
  const { assetId } = await params;
  const asset = await getAsset(assetId);
  const t = await getTranslations('booking.slotBased');

  if (!asset) {
    return {
      title: 'Booking Not Found',
    };
  }

  return {
    title: t('title', { assetName: asset.name }),
  };
}

export default async function BookingPage({ params }: Props) {
  const { slug, assetId } = await params;

  const venue = await getVenue(slug);
  const asset = await getAsset(assetId);

  if (!venue || !asset) {
    notFound();
  }

  return <BookingFlow venue={venue} asset={asset} />;
}
