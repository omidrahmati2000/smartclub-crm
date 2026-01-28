import { NextResponse } from 'next/server';
import { mockAssets, mockVenues, mockBookings } from '@smartclub/mock-data';
import { BookingStatus } from '@smartclub/types';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ assetId: string }> }
) {
    const { assetId } = await params;
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date');

    if (!dateStr) {
        return NextResponse.json(
            { success: false, error: 'Date is required' },
            { status: 400 }
        );
    }

    const asset = mockAssets.find((a) => a.id === assetId);
    if (!asset) {
        return NextResponse.json(
            { success: false, error: 'Asset not found' },
            { status: 404 }
        );
    }

    const venue = mockVenues.find((v) => v.id === asset.venueId);
    if (!venue) {
        return NextResponse.json(
            { success: false, error: 'Venue not found' },
            { status: 404 }
        );
    }

    // Get operating hours for the day of week
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    const operatingHours = venue.operatingHours.find((h) => h.dayOfWeek === dayOfWeek);

    if (!operatingHours || operatingHours.isClosed) {
        return NextResponse.json({ success: true, data: [] });
    }

    // Get existing bookings for this asset and date
    const existingBookings = mockBookings.filter(
        (b) =>
            b.assetId === assetId &&
            b.date === dateStr &&
            b.status !== BookingStatus.CANCELLED &&
            b.status !== BookingStatus.NO_SHOW
    );

    // Generate slots
    const slots = [];
    const [openHour, openMin] = operatingHours.openTime.split(':').map(Number);
    const [closeHour, closeMin] = operatingHours.closeTime.split(':').map(Number);

    let currentHour = openHour;
    let currentMin = openMin;

    const slotDuration = asset.slotDuration || 90; // Default to 90 mins if not set

    // Convert closing time to minutes for easier comparison
    // Handle closing after midnight (e.g., 02:00)
    let closeTimeInMinutes = closeHour * 60 + closeMin;
    if (closeTimeInMinutes < openHour * 60 + openMin) {
        closeTimeInMinutes += 24 * 60;
    }

    while (true) {
        const startTimeInMinutes = currentHour * 60 + currentMin;
        const endTimeInMinutes = startTimeInMinutes + slotDuration;

        if (endTimeInMinutes > closeTimeInMinutes) {
            break;
        }

        const startHourStr = Math.floor(startTimeInMinutes / 60) % 24;
        const startMinStr = startTimeInMinutes % 60;
        const endHourStr = Math.floor(endTimeInMinutes / 60) % 24;
        const endMinStr = endTimeInMinutes % 60;

        const startTime = `${String(startHourStr).padStart(2, '0')}:${String(startMinStr).padStart(2, '0')}`;
        const endTime = `${String(endHourStr).padStart(2, '0')}:${String(endMinStr).padStart(2, '0')}`;

        // Check availability
        const isAvailable = !existingBookings.some((booking) => {
            // Simple overlap check
            // Booking: [bookingStart, bookingEnd)
            // Slot: [startTime, endTime)
            // Overlap if startTime < bookingEnd AND endTime > bookingStart

            // Note: This string comparison works for HH:MM format within the same day
            // But we should be careful with cross-day times. 
            // For simplicity in this mock, assuming same day.

            return startTime < booking.endTime && endTime > booking.startTime;
        });

        slots.push({
            startTime,
            endTime,
            price: asset.pricePerSlot || 0,
            currency: asset.currency,
            isAvailable,
        });

        currentMin += slotDuration;
        if (currentMin >= 60) {
            currentHour += Math.floor(currentMin / 60);
            currentMin = currentMin % 60;
        }
    }

    return NextResponse.json({
        success: true,
        data: slots,
    });
}
