import { http, HttpResponse } from 'msw';
import { generateDashboardData } from '../fixtures/dashboard-data';

export const venueDashboardHandlers = [
  http.get('/api/venues/:venueId/dashboard', ({ params }) => {
    const { venueId } = params;

    if (!venueId || typeof venueId !== 'string') {
      return HttpResponse.json(
        {
          error: 'Bad Request',
          message: 'Venue ID is required',
          statusCode: 400,
        },
        { status: 400 },
      );
    }

    const dashboardData = generateDashboardData(venueId);

    return HttpResponse.json({
      data: dashboardData,
      success: true,
    });
  }),
];
