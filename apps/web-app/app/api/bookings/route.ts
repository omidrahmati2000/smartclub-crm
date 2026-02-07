import { NextRequest, NextResponse } from 'next/server';
import { BookingStatus, BookingType, PaymentMethod, PaymentStatus } from '@smartclub/types';
import { mockBookings, mockAssets, mockVenues } from '@smartclub/mock-data/fixtures';

// GET /api/bookings - Fetch user's bookings
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');
        const status = searchParams.get('status');
        const tab = searchParams.get('tab'); // upcoming, past, cancelled, all

        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'userId is required' },
                { status: 400 }
            );
        }

        // Filter bookings by userId
        let userBookings = mockBookings.filter(
            (b) => b.userId === userId || b.customerId === userId
        );

        // Filter by status if provided
        if (status && status !== 'all') {
            userBookings = userBookings.filter((b) => b.status === status);
        }

        // Filter by tab
        const today = new Date().toISOString().split('T')[0];
        if (tab === 'upcoming') {
            userBookings = userBookings.filter(
                (b) =>
                    b.date >= today &&
                    b.status !== BookingStatus.CANCELLED &&
                    b.status !== BookingStatus.COMPLETED
            );
        } else if (tab === 'past') {
            userBookings = userBookings.filter(
                (b) =>
                    b.date < today ||
                    b.status === BookingStatus.COMPLETED
            );
        } else if (tab === 'cancelled') {
            userBookings = userBookings.filter(
                (b) => b.status === BookingStatus.CANCELLED
            );
        }

        // Enrich bookings with venue and asset info
        const enrichedBookings = userBookings.map((booking) => {
            const venue = mockVenues.find((v) => v.id === booking.venueId);
            const asset = mockAssets.find((a) => a.id === booking.assetId);
            return {
                ...booking,
                venue: venue ? { id: venue.id, name: venue.name, slug: venue.slug } : null,
                asset: asset ? { id: asset.id, name: asset.name, type: asset.type } : null,
            };
        });

        // Sort by date descending (newest first)
        enrichedBookings.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.startTime}`);
            const dateB = new Date(`${b.date}T${b.startTime}`);
            return dateB.getTime() - dateA.getTime();
        });

        return NextResponse.json({
            success: true,
            data: enrichedBookings,
            total: enrichedBookings.length,
        });
    } catch (error) {
        console.error('Failed to fetch bookings:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/bookings - Create new booking
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { assetId, userId, date, startTime, endTime, duration, totalPrice, currency } = body;

        // Validate required fields
        if (!assetId || !userId || !date || !startTime || !endTime) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Find the asset to get venueId
        const asset = mockAssets.find((a) => a.id === assetId);
        if (!asset) {
            return NextResponse.json(
                { success: false, message: 'Asset not found' },
                { status: 404 }
            );
        }

        // Create new booking object
        const newBooking = {
            id: `booking-${Date.now()}`,
            venueId: asset.venueId,
            assetId,
            userId, // Required by Booking interface
            customerId: userId,
            date,
            startTime,
            endTime,
            duration: duration || 90,
            status: BookingStatus.CONFIRMED, // Auto-confirm for now
            bookingType: BookingType.SLOT_BASED,
            subtotal: totalPrice || 0,
            totalPrice: totalPrice || 0,
            currency: currency || 'IRT',
            participants: [
                {
                    userId,
                    name: 'Current User', // In real app, get from user profile
                    isHost: true,
                    paymentStatus: PaymentStatus.COMPLETED,
                },
            ],
            paymentMethod: PaymentMethod.ONLINE,
            paymentStatus: PaymentStatus.COMPLETED, // Assume paid
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Add to mock bookings array (in-memory for this session)
        mockBookings.push(newBooking);

        return NextResponse.json({
            success: true,
            data: newBooking,
        });
    } catch (error) {
        console.error('Booking creation failed:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
