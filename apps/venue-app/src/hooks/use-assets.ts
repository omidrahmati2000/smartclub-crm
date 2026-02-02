import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import type { Asset } from '@smartclub/types';
import { apiClient } from '@/lib/api-client';

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
  const result = await apiClient.get<Asset[]>(`/venues/${venueId}/assets`);

  if (!result.success || !result.data) {
    throw new Error(result.message || result.error || 'Failed to fetch assets');
  }

  return result.data;
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
