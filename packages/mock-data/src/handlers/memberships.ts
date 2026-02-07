import { http, HttpResponse } from 'msw';
import {
  getMembershipsByVenue,
  getMembershipById,
  createMembership,
  updateMembership,
  deleteMembership,
} from '../fixtures/memberships';

export const membershipsHandlers = [
  // GET /api/venues/:venueId/memberships - Get memberships list
  http.get('/api/venues/:venueId/memberships', ({ params, request }) => {
    const { venueId } = params;
    const url = new URL(request.url);

    const search = url.searchParams.get('search')?.toLowerCase();
    const sortBy = url.searchParams.get('sortBy') || 'name';
    const sortOrder = url.searchParams.get('sortOrder') || 'asc';

    let memberships = getMembershipsByVenue(venueId as string);

    // Apply search filter
    if (search) {
      memberships = memberships.filter(
        (m) =>
          m.name.toLowerCase().includes(search) ||
          m.description.toLowerCase().includes(search)
      );
    }

    // Sort
    memberships.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'subscribers':
          aValue = a.subscribers;
          bValue = b.subscribers;
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
      data: memberships,
      total: memberships.length,
      success: true,
    });
  }),

  // GET /api/memberships/:membershipId - Get membership details
  http.get('/api/memberships/:membershipId', ({ params }) => {
    const { membershipId } = params;
    const membership = getMembershipById(membershipId as string);

    if (!membership) {
      return HttpResponse.json(
        { success: false, message: 'Membership not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      data: membership,
      success: true,
    });
  }),

  // POST /api/venues/:venueId/memberships - Create new membership
  http.post('/api/venues/:venueId/memberships', async ({ params, request }) => {
    const { venueId } = params;
    const data = await request.json() as any;

    const newMembership = createMembership(venueId as string, data);

    return HttpResponse.json(
      {
        data: newMembership,
        success: true,
        message: 'Membership plan created successfully',
      },
      { status: 201 }
    );
  }),

  // PUT /api/memberships/:membershipId - Update membership
  http.put('/api/memberships/:membershipId', async ({ params, request }) => {
    const { membershipId } = params;
    const data = await request.json() as any;

    const updatedMembership = updateMembership(membershipId as string, data);

    if (!updatedMembership) {
      return HttpResponse.json(
        { success: false, message: 'Membership not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      data: updatedMembership,
      success: true,
      message: 'Membership updated successfully',
    });
  }),

  // DELETE /api/memberships/:membershipId - Delete membership
  http.delete('/api/memberships/:membershipId', ({ params }) => {
    const { membershipId } = params;
    const deleted = deleteMembership(membershipId as string);

    if (!deleted) {
      return HttpResponse.json(
        { success: false, message: 'Membership not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      message: 'Membership deleted successfully',
    });
  }),
];
