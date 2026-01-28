import { http, HttpResponse } from 'msw';
import { mockVenues, mockAssets } from '../fixtures/venues';

export const venueHandlers = [
  http.get('/api/venues', ({ request }) => {
    const url = new URL(request.url);
    const city = url.searchParams.get('city');
    const query = url.searchParams.get('query');

    let venues = [...mockVenues];

    if (city) {
      venues = venues.filter((v) => v.city === city);
    }
    if (query) {
      venues = venues.filter(
        (v) =>
          v.name.includes(query) ||
          v.description.includes(query),
      );
    }

    return HttpResponse.json({
      data: venues,
      pagination: {
        page: 1,
        limit: 20,
        total: venues.length,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      },
      success: true,
    });
  }),

  http.get('/api/venues/:slug', ({ params }) => {
    const venue = mockVenues.find((v) => v.slug === params.slug || v.id === params.slug);
    if (!venue) {
      return HttpResponse.json(
        { error: 'Not found', message: 'Venue not found', statusCode: 404 },
        { status: 404 },
      );
    }
    return HttpResponse.json({ data: venue, success: true });
  }),

  http.get('/api/venues/:venueId/assets', ({ params }) => {
    const assets = mockAssets.filter((a) => a.venueId === params.venueId);
    return HttpResponse.json({ data: assets, success: true });
  }),

  // PUT /api/venues/:venueId - Update venue profile
  http.put('/api/venues/:venueId', async ({ params, request }) => {
    const { venueId } = params;
    const updates = await request.json();

    const venueIndex = mockVenues.findIndex((v) => v.id === venueId);

    if (venueIndex === -1) {
      return HttpResponse.json(
        { error: 'Venue not found' },
        { status: 404 }
      );
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Update the venue
    mockVenues[venueIndex] = {
      ...mockVenues[venueIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json({
      data: mockVenues[venueIndex],
      success: true,
    });
  }),
];
