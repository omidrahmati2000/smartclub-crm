import { http, HttpResponse } from 'msw';
import { getCoachesByVenue, getCoachById, createCoach, updateCoach, deleteCoach } from '../fixtures/coaches';

export const coachesHandlers = [
  // GET /api/venues/:venueId/coaches - Get coaches list
  http.get('/api/venues/:venueId/coaches', ({ params, request }) => {
    const { venueId } = params;
    const url = new URL(request.url);

    const search = url.searchParams.get('search')?.toLowerCase();
    const specialty = url.searchParams.get('specialty');
    const sortBy = url.searchParams.get('sortBy') || 'name';
    const sortOrder = url.searchParams.get('sortOrder') || 'asc';

    let coaches = getCoachesByVenue(venueId as string);

    // Apply search filter
    if (search) {
      coaches = coaches.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.specialty.toLowerCase().includes(search)
      );
    }

    // Apply specialty filter
    if (specialty && specialty !== 'all') {
      coaches = coaches.filter((c) => c.specialty === specialty);
    }

    // Sort
    coaches.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'students':
          aValue = a.students;
          bValue = b.students;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return HttpResponse.json({
      data: coaches,
      total: coaches.length,
      success: true,
    });
  }),

  // GET /api/coaches/:coachId - Get coach details
  http.get('/api/coaches/:coachId', ({ params }) => {
    const { coachId } = params;
    const coach = getCoachById(coachId as string);

    if (!coach) {
      return HttpResponse.json(
        { success: false, message: 'Coach not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      data: coach,
      success: true,
    });
  }),

  // POST /api/venues/:venueId/coaches - Create new coach
  http.post('/api/venues/:venueId/coaches', async ({ params, request }) => {
    const { venueId } = params;
    const data = await request.json() as any;

    const newCoach = createCoach(venueId as string, data);

    return HttpResponse.json(
      {
        data: newCoach,
        success: true,
        message: 'Coach registered successfully',
      },
      { status: 201 }
    );
  }),

  // PUT /api/coaches/:coachId - Update coach
  http.put('/api/coaches/:coachId', async ({ params, request }) => {
    const { coachId } = params;
    const data = await request.json() as any;

    const updatedCoach = updateCoach(coachId as string, data);

    if (!updatedCoach) {
      return HttpResponse.json(
        { success: false, message: 'Coach not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      data: updatedCoach,
      success: true,
      message: 'Coach updated successfully',
    });
  }),

  // DELETE /api/coaches/:coachId - Delete coach
  http.delete('/api/coaches/:coachId', ({ params }) => {
    const { coachId } = params;
    const deleted = deleteCoach(coachId as string);

    if (!deleted) {
      return HttpResponse.json(
        { success: false, message: 'Coach not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      message: 'Coach deleted successfully',
    });
  }),
];
