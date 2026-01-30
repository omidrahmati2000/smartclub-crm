import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import type { Asset } from '@smartclub/types';

// Query keys for assets
export const assetKeys = {
  all: ['assets'] as const,
  lists: () => [...assetKeys.all, 'list'] as const,
  list: (venueId: string) => [...assetKeys.lists(), venueId] as const,
};

/**
 * Fetch all assets for a venue
 */
async function fetchAssets(venueId: string): Promise<Asset[]> {
  const response = await fetch(`/api/venues/${venueId}/assets`);
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch assets');
  }
  return data.data;
}

/**
 * Hook to fetch assets with caching
 */
export function useAssets() {
  const { data: session } = useSession();
  const venueId = session?.user?.venueId;

  return useQuery({
    queryKey: venueId ? assetKeys.list(venueId) : [],
    queryFn: () => fetchAssets(venueId!),
    enabled: !!venueId,
  });
}
