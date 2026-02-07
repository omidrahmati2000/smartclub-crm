import { http, HttpResponse } from 'msw';
import {
  getVehiclesByVenue,
  getVehicleById,
  checkInVehicle,
  updateVehicle,
  checkOutVehicle,
} from '../fixtures/valet';

export const valetHandlers = [
  // GET /api/venues/:venueId/valet - Get vehicles list
  http.get('/api/venues/:venueId/valet', ({ params, request }) => {
    const { venueId } = params;
    const url = new URL(request.url);

    const search = url.searchParams.get('search')?.toLowerCase();
    const status = url.searchParams.get('status');
    const sortBy = url.searchParams.get('sortBy') || 'timeIn';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';

    let vehicles = getVehiclesByVenue(venueId as string);

    // Apply search filter
    if (search) {
      vehicles = vehicles.filter(
        (v) =>
          v.plate.toLowerCase().includes(search) ||
          v.owner.toLowerCase().includes(search)
      );
    }

    // Apply status filter
    if (status && status !== 'all') {
      vehicles = vehicles.filter((v) => v.status === status);
    }

    // Sort
    vehicles.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'timeIn':
          aValue = new Date(a.timeIn).getTime();
          bValue = new Date(b.timeIn).getTime();
          break;
        case 'owner':
          aValue = a.owner;
          bValue = b.owner;
          break;
        case 'plate':
          aValue = a.plate;
          bValue = b.plate;
          break;
        default:
          aValue = new Date(a.timeIn).getTime();
          bValue = new Date(b.timeIn).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return HttpResponse.json({
      data: vehicles,
      total: vehicles.length,
      success: true,
    });
  }),

  // GET /api/valet/:vehicleId - Get vehicle details
  http.get('/api/valet/:vehicleId', ({ params }) => {
    const { vehicleId } = params;
    const vehicle = getVehicleById(vehicleId as string);

    if (!vehicle) {
      return HttpResponse.json(
        { success: false, message: 'Vehicle not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      data: vehicle,
      success: true,
    });
  }),

  // POST /api/venues/:venueId/valet - Check in new vehicle
  http.post('/api/venues/:venueId/valet', async ({ params, request }) => {
    const { venueId } = params;
    const data = await request.json() as any;

    const newVehicle = checkInVehicle(venueId as string, data);

    return HttpResponse.json(
      {
        data: newVehicle,
        success: true,
        message: 'Vehicle checked in successfully',
      },
      { status: 201 }
    );
  }),

  // PUT /api/valet/:vehicleId - Update vehicle
  http.put('/api/valet/:vehicleId', async ({ params, request }) => {
    const { vehicleId } = params;
    const data = await request.json() as any;

    const updatedVehicle = updateVehicle(vehicleId as string, data);

    if (!updatedVehicle) {
      return HttpResponse.json(
        { success: false, message: 'Vehicle not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      data: updatedVehicle,
      success: true,
      message: 'Vehicle updated successfully',
    });
  }),

  // DELETE /api/valet/:vehicleId - Check out vehicle
  http.delete('/api/valet/:vehicleId', ({ params }) => {
    const { vehicleId } = params;
    const deleted = checkOutVehicle(vehicleId as string);

    if (!deleted) {
      return HttpResponse.json(
        { success: false, message: 'Vehicle not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      message: 'Vehicle checked out successfully',
    });
  }),
];
