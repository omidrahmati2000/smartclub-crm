import { http, HttpResponse } from 'msw';
import { getVenueSettings, updateVenueSettings } from '../fixtures/venue-settings';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const venueSettingsHandlers = [
  // GET /api/venues/:venueId/settings - Get venue settings
  http.get(`${BASE_URL}/venues/:venueId/settings`, ({ params }) => {
    const { venueId } = params;

    const settings = getVenueSettings(venueId as string);

    if (!settings) {
      return HttpResponse.json(
        { error: 'Venue settings not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(settings);
  }),

  // PUT /api/venues/:venueId/settings - Update venue settings
  http.put(`${BASE_URL}/venues/:venueId/settings`, async ({ params, request }) => {
    const { venueId } = params;
    const updates = await request.json();

    try {
      const updatedSettings = updateVenueSettings(venueId as string, updates);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return HttpResponse.json(updatedSettings);
    } catch (error) {
      return HttpResponse.json(
        { error: 'Failed to update settings' },
        { status: 400 }
      );
    }
  }),
];
