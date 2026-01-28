import { NextResponse } from 'next/server';
import { mockAssets } from '@smartclub/mock-data';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    // Note: 'slug' here captures the segment after /venues/, which could be an ID or a slug.
    // The client currently sends venueId, so we treat it as venueId.

    let assets;
    if (slug === 'all') {
        assets = mockAssets;
    } else {
        assets = mockAssets.filter((a) => a.venueId === slug);
    }

    return NextResponse.json({
        success: true,
        data: assets,
    });
}
