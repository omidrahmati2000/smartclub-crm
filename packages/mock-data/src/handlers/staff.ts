import { http, HttpResponse } from 'msw';
import {
  getStaffByVenue,
  getStaffById,
  getStaffActivities,
  createStaffMember,
  updateStaffMember,
  deleteStaffMember,
  getRolePermissions,
  rolePermissionsData,
} from '../fixtures/staff';

export const staffHandlers = [
  // GET /api/venues/:venueId/staff - Get staff list with filters
  http.get('/api/venues/:venueId/staff', ({ params, request }) => {
    const { venueId } = params;
    const url = new URL(request.url);

    const search = url.searchParams.get('search')?.toLowerCase();
    const role = url.searchParams.get('role');
    const status = url.searchParams.get('status');
    const sortBy = url.searchParams.get('sortBy') || 'name';
    const sortOrder = url.searchParams.get('sortOrder') || 'asc';

    let staff = getStaffByVenue(venueId as string);

    // Apply search filter
    if (search) {
      staff = staff.filter(
        (s) =>
          s.name.toLowerCase().includes(search) || s.email.toLowerCase().includes(search)
      );
    }

    // Apply role filter
    if (role && role !== 'all') {
      staff = staff.filter((s) => s.role === role);
    }

    // Apply status filter
    if (status && status !== 'all') {
      staff = staff.filter((s) => s.status === status);
    }

    // Sort
    staff.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'role':
          aValue = a.role;
          bValue = b.role;
          break;
        case 'hireDate':
          aValue = new Date(a.hireDate).getTime();
          bValue = new Date(b.hireDate).getTime();
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
      data: staff,
      total: staff.length,
      success: true,
    });
  }),

  // GET /api/staff/:staffId - Get staff member details
  http.get('/api/staff/:staffId', ({ params }) => {
    const { staffId } = params;
    const staff = getStaffById(staffId as string);

    if (!staff) {
      return HttpResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    return HttpResponse.json({
      data: staff,
      success: true,
    });
  }),

  // POST /api/venues/:venueId/staff - Create new staff member
  http.post('/api/venues/:venueId/staff', async ({ params, request }) => {
    const { venueId } = params;
    const body = (await request.json()) as any;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newStaff = createStaffMember({
      ...body,
      venueId,
      createdBy: 'current-user-id', // In real app, get from session
    });

    return HttpResponse.json({
      data: newStaff,
      success: true,
    });
  }),

  // PUT /api/staff/:staffId - Update staff member
  http.put('/api/staff/:staffId', async ({ params, request }) => {
    const { staffId } = params;
    const updates = (await request.json()) as any;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const updated = updateStaffMember(staffId as string, updates);

    if (!updated) {
      return HttpResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    return HttpResponse.json({
      data: updated,
      success: true,
    });
  }),

  // DELETE /api/staff/:staffId - Delete staff member
  http.delete('/api/staff/:staffId', async ({ params }) => {
    const { staffId } = params;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = deleteStaffMember(staffId as string);

    if (!success) {
      return HttpResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    return HttpResponse.json({
      message: 'Staff member deleted successfully',
      success: true,
    });
  }),

  // GET /api/staff/:staffId/activity - Get staff activity log
  http.get('/api/staff/:staffId/activity', ({ params, request }) => {
    const { staffId } = params;
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');

    const activities = getStaffActivities(staffId as string, limit);

    return HttpResponse.json({
      data: activities,
      total: activities.length,
      success: true,
    });
  }),

  // GET /api/roles/:role/permissions - Get permissions for a role
  http.get('/api/roles/:role/permissions', ({ params }) => {
    const { role } = params;
    const permissions = getRolePermissions(role as any);

    if (!permissions) {
      return HttpResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    return HttpResponse.json({
      data: permissions,
      success: true,
    });
  }),

  // GET /api/roles/permissions - Get all role permissions
  http.get('/api/roles/permissions', () => {
    return HttpResponse.json({
      data: rolePermissionsData,
      success: true,
    });
  }),
];
