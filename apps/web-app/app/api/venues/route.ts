import { NextResponse } from 'next/server';
import { mockVenues } from '@smartclub/mock-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const city = searchParams.get('city');

  let filteredVenues = [...mockVenues];

  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredVenues = filteredVenues.filter(venue => 
      venue.name.toLowerCase().includes(lowerQuery) ||
      venue.description.toLowerCase().includes(lowerQuery)
    );
  }

  if (city && city !== 'all') {
    filteredVenues = filteredVenues.filter(venue => 
      venue.city.toLowerCase() === city.toLowerCase()
    );
  }

  return NextResponse.json({
    success: true,
    data: filteredVenues
  });
}
