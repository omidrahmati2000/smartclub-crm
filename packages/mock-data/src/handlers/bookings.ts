import { http, HttpResponse } from 'msw';
import type { Booking, TimeSlot } from '@smartclub/types';
import { BookingType, BookingStatus, PaymentStatus } from '@smartclub/types';
import { mockAssets } from '../fixtures/venues';
import { mockBookings as initialMockBookings } from '../fixtures/bookings';

// Generate time slots for a given date and asset
function generateTimeSlots(date: string, assetId: string): TimeSlot[] {
  const asset = mockAssets.find((a) => a.id === assetId);
  if (!asset || asset.bookingType !== BookingType.SLOT_BASED) {
    return [];
  }

  const slots: TimeSlot[] = [];
  const slotDuration = asset.slotDuration || 90;

  // Generate slots from 8 AM to 10 PM
  for (let hour = 8; hour < 22; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const startHour = Math.floor((hour * 60 + minute) / 60);
      const startMinute = (hour * 60 + minute) % 60;
      const endHour = Math.floor((hour * 60 + minute + slotDuration) / 60);
      const endMinute = (hour * 60 + minute + slotDuration) % 60;

      if (endHour >= 22) break;

      const startTime = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

      // Randomly make some slots unavailable (30% booked)
      const isAvailable = Math.random() > 0.3;

      slots.push({
        startTime,
        endTime,
        isAvailable,
        price: asset.pricePerSlot || 0,
        currency: asset.currency,
      });
    }
  }

  return slots;
}

// Mock bookings storage - initialized with fixture data
const mockBookingsStore: Booking[] = [...initialMockBookings];

export const bookingHandlers = [
  // Get available start times for duration-based bookings
  http.get('/api/assets/:assetId/available-times', ({ request, params }) => {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    const duration = parseInt(url.searchParams.get('duration') || '30', 10);

    if (!date) {
      return HttpResponse.json(
        { error: 'Bad Request', message: 'Date parameter is required', statusCode: 400 },
        { status: 400 }
      );
    }

    const asset = mockAssets.find((a) => a.id === params.assetId);
    if (!asset || asset.bookingType !== BookingType.DURATION_BASED) {
      return HttpResponse.json({ data: [], success: true });
    }

    // Generate available start times from 8 AM to 10 PM
    const times: string[] = [];
    for (let hour = 8; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const totalMinutes = hour * 60 + minute;
        const endTotalMinutes = totalMinutes + duration;

        // Don't allow bookings that end after 10 PM (22:00)
        if (endTotalMinutes / 60 >= 22) continue;

        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        // Randomly make some times unavailable (20% booked)
        if (Math.random() > 0.2) {
          times.push(timeStr);
        }
      }
    }

    return HttpResponse.json({
      data: times,
      success: true,
    });
  }),

  // Get available slots for an asset on a specific date
  http.get('/api/assets/:assetId/slots', ({ request, params }) => {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');

    if (!date) {
      return HttpResponse.json(
        { error: 'Bad Request', message: 'Date parameter is required', statusCode: 400 },
        { status: 400 }
      );
    }

    const slots = generateTimeSlots(date, params.assetId as string);

    return HttpResponse.json({
      data: slots,
      success: true,
    });
  }),

  // Create a new booking
  http.post('/api/bookings', async ({ request }) => {
    const body = (await request.json()) as any;

    const asset = mockAssets.find((a) => a.id === body.assetId);
    if (!asset) {
      return HttpResponse.json(
        { error: 'Not Found', message: 'Asset not found', statusCode: 404 },
        { status: 404 }
      );
    }

    const booking: Booking = {
      id: `booking-${Date.now()}`,
      venueId: asset.venueId,
      assetId: body.assetId,
      userId: body.userId,
      customerId: body.userId,
      bookingType: asset.bookingType,
      status: BookingStatus.CONFIRMED,
      date: body.date || new Date().toISOString().split('T')[0],
      startTime: body.startTime,
      endTime: body.endTime,
      duration: body.duration,
      participants: body.participants || [
        {
          userId: body.userId,
          name: 'Guest User',
          isHost: true,
          paymentStatus: PaymentStatus.COMPLETED,
        },
      ],
      totalPrice: body.totalPrice,
      currency: body.currency,
      paymentMethod: body.paymentMethod,
      paymentStatus: PaymentStatus.COMPLETED,
      notes: body.notes,
      isRecurring: body.isRecurring || false,
      isVip: body.isVip || false,
      priority: body.priority || 'normal',
      tags: body.tags || [],
      bookingSource: body.bookingSource || 'online',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockBookingsStore.push(booking);

    return HttpResponse.json({
      data: booking,
      success: true,
      message: 'Booking created successfully',
    });
  }),

  // Get user bookings
  http.get('/api/bookings', ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    let bookings = [...mockBookingsStore];

    if (userId) {
      bookings = bookings.filter((b) => b.customerId === userId);
    }

    // Sort by created at descending
    bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return HttpResponse.json({
      data: bookings,
      pagination: {
        page: 1,
        limit: 20,
        total: bookings.length,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      },
      success: true,
    });
  }),

  // Get venue bookings (for calendar and management)
  http.get('/api/venues/:venueId/bookings', ({ request, params }) => {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const status = url.searchParams.get('status');
    const assetId = url.searchParams.get('asset');

    let bookings = mockBookingsStore.filter(
      (b) => b.venueId === params.venueId,
    );

    // Filter by single date or date range
    if (date) {
      bookings = bookings.filter((b) => b.date === date);
    } else if (startDate && endDate) {
      bookings = bookings.filter((b) => b.date >= startDate && b.date <= endDate);
    }

    if (status) {
      bookings = bookings.filter((b) => b.status === status);
    }

    if (assetId) {
      bookings = bookings.filter((b) => b.assetId === assetId);
    }

    // Sort by date and start time
    bookings.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.startTime.localeCompare(b.startTime);
    });

    return HttpResponse.json({
      data: bookings,
      pagination: {
        page: 1,
        limit: 100,
        total: bookings.length,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      },
      success: true,
    });
  }),

  // Get single booking
  http.get('/api/bookings/:id', ({ params }) => {
    const booking = mockBookingsStore.find((b) => b.id === params.id);

    if (!booking) {
      return HttpResponse.json(
        { error: 'Not Found', message: 'Booking not found', statusCode: 404 },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      data: booking,
      success: true,
    });
  }),

  // Check-in a booking
  http.patch('/api/bookings/:id/check-in', ({ params }) => {
    const bookingIndex = mockBookingsStore.findIndex((b) => b.id === params.id);

    if (bookingIndex === -1) {
      return HttpResponse.json(
        { error: 'Not Found', message: 'Booking not found', statusCode: 404 },
        { status: 404 }
      );
    }

    mockBookingsStore[bookingIndex] = {
      ...mockBookingsStore[bookingIndex],
      status: BookingStatus.CHECKED_IN,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json({
      data: mockBookingsStore[bookingIndex],
      success: true,
      message: 'Booking checked in successfully',
    });
  }),

  // Cancel a booking
  http.patch('/api/bookings/:id/cancel', ({ params }) => {
    const bookingIndex = mockBookingsStore.findIndex((b) => b.id === params.id);

    if (bookingIndex === -1) {
      return HttpResponse.json(
        { error: 'Not Found', message: 'Booking not found', statusCode: 404 },
        { status: 404 }
      );
    }

    mockBookingsStore[bookingIndex] = {
      ...mockBookingsStore[bookingIndex],
      status: BookingStatus.CANCELLED,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json({
      data: mockBookingsStore[bookingIndex],
      success: true,
      message: 'Booking cancelled successfully',
    });
  }),

  // Mark booking as no-show
  http.patch('/api/bookings/:id/no-show', ({ params }) => {
    const bookingIndex = mockBookingsStore.findIndex((b) => b.id === params.id);

    if (bookingIndex === -1) {
      return HttpResponse.json(
        { error: 'Not Found', message: 'Booking not found', statusCode: 404 },
        { status: 404 }
      );
    }

    mockBookingsStore[bookingIndex] = {
      ...mockBookingsStore[bookingIndex],
      status: BookingStatus.NO_SHOW,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json({
      data: mockBookingsStore[bookingIndex],
      success: true,
      message: 'Booking marked as no-show',
    });
  }),

  // Freeze a booking (reserved slot)
  http.patch('/api/bookings/:id/freeze', ({ params }) => {
    const bookingIndex = mockBookingsStore.findIndex((b) => b.id === params.id);

    if (bookingIndex === -1) {
      return HttpResponse.json(
        { error: 'Not Found', message: 'Booking not found', statusCode: 404 },
        { status: 404 }
      );
    }

    mockBookingsStore[bookingIndex] = {
      ...mockBookingsStore[bookingIndex],
      status: BookingStatus.FROZEN,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json({
      data: mockBookingsStore[bookingIndex],
      success: true,
      message: 'Time slot frozen successfully',
    });
  }),

  // Block for maintenance
  http.patch('/api/bookings/:id/maintenance', ({ params }) => {
    const bookingIndex = mockBookingsStore.findIndex((b) => b.id === params.id);

    if (bookingIndex === -1) {
      return HttpResponse.json(
        { error: 'Not Found', message: 'Booking not found', statusCode: 404 },
        { status: 404 }
      );
    }

    mockBookingsStore[bookingIndex] = {
      ...mockBookingsStore[bookingIndex],
      status: BookingStatus.MAINTENANCE,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json({
      data: mockBookingsStore[bookingIndex],
      success: true,
      message: 'Court blocked for maintenance',
    });
  }),

  // Toggle VIP status
  http.patch('/api/bookings/:id/vip', ({ params }) => {
    const bookingIndex = mockBookingsStore.findIndex((b) => b.id === params.id);

    if (bookingIndex === -1) {
      return HttpResponse.json(
        { error: 'Not Found', message: 'Booking not found', statusCode: 404 },
        { status: 404 }
      );
    }

    const currentVip = mockBookingsStore[bookingIndex].isVip || false;
    mockBookingsStore[bookingIndex] = {
      ...mockBookingsStore[bookingIndex],
      isVip: !currentVip,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json({
      data: mockBookingsStore[bookingIndex],
      success: true,
      message: currentVip ? 'VIP status removed' : 'Marked as VIP',
    });
  }),

  // Complete a booking
  http.patch('/api/bookings/:id/complete', ({ params }) => {
    const bookingIndex = mockBookingsStore.findIndex((b) => b.id === params.id);

    if (bookingIndex === -1) {
      return HttpResponse.json(
        { error: 'Not Found', message: 'Booking not found', statusCode: 404 },
        { status: 404 }
      );
    }

    mockBookingsStore[bookingIndex] = {
      ...mockBookingsStore[bookingIndex],
      status: BookingStatus.COMPLETED,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json({
      data: mockBookingsStore[bookingIndex],
      success: true,
      message: 'Booking completed successfully',
    });
  }),
];
