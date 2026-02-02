import { http, HttpResponse } from 'msw';
import { getMockPaymentSettings, updateMockPaymentSettings } from '../fixtures/payment-settings';

export const paymentSettingsHandlers = [
  // GET /api/venues/:venueId/payment-settings
  http.get('/api/venues/:venueId/payment-settings', ({ params }) => {
    const { venueId } = params;
    const settings = getMockPaymentSettings(venueId as string);
    return HttpResponse.json(settings);
  }),

  // PUT /api/venues/:venueId/payment-settings
  http.put('/api/venues/:venueId/payment-settings', async ({ params, request }) => {
    const { venueId } = params;
    const updates = await request.json();
    const updated = updateMockPaymentSettings(venueId as string, updates as any);
    return HttpResponse.json(updated);
  }),

  // POST /api/venues/:venueId/payment-settings/test-gateway
  http.post('/api/venues/:venueId/payment-settings/test-gateway', async ({ request }) => {
    const { gateway } = (await request.json()) as { gateway: string };

    // Simulate gateway connection test
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock: 90% success rate
    const success = Math.random() > 0.1;

    return HttpResponse.json({
      success,
      message: success
        ? `Successfully connected to ${gateway}`
        : `Failed to connect to ${gateway}. Please check your credentials.`,
    });
  }),
];
