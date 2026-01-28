import { NextResponse } from 'next/server';
import { mockVenues } from '@smartclub/mock-data';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const venue = mockVenues.find((v) => v.slug === slug);

    if (!venue) {
        return NextResponse.json(
            { success: false, error: 'Venue not found' },
            { status: 404 }
        );
    }

    return NextResponse.json({
        success: true,
        data: venue,
    });
}
