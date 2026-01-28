import { NextResponse } from 'next/server';
import { BookingStatus, BookingType, PaymentMethod, PaymentStatus } from '@smartclub/types';
import { mockBookings, mockAssets } from '@smartclub/mock-data';

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
