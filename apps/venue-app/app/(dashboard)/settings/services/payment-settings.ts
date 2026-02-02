import { VenuePaymentSettings } from '@smartclub/types';
import { apiClient } from '@/lib/api-client';

/**
 * Fetch venue payment settings
 */
export async function getPaymentSettings(venueId: string): Promise<VenuePaymentSettings> {
  const result = await apiClient.get<VenuePaymentSettings>(`/venues/${venueId}/payment-settings`);
  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to fetch payment settings');
  }
  return result.data;
}

/**
 * Update venue payment settings
 */
export async function updatePaymentSettings(
  venueId: string,
  settings: Partial<VenuePaymentSettings>
): Promise<VenuePaymentSettings> {
  const result = await apiClient.put<VenuePaymentSettings>(`/venues/${venueId}/payment-settings`, settings);

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to update payment settings');
  }

  return result.data;
}

/**
 * Test payment gateway connection
 */
export async function testGatewayConnection(
  venueId: string,
  gateway: string
): Promise<{ success: boolean; message: string }> {
  const result = await apiClient.post<{ success: boolean; message: string }>(
    `/venues/${venueId}/payment-settings/test-gateway`,
    { gateway }
  );

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to test gateway connection');
  }

  return result.data;
}
