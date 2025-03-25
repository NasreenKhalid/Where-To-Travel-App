import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const API_KEY = process.env.OPENTRIPMAP_API_KEY;
  
  try {
    // Fetch place details from OpenTripMap
    const detailUrl = `https://api.opentripmap.com/0.1/en/places/xid/${id}?apikey=${API_KEY}`;
    const response = await fetch(detailUrl);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      );
    }
    
    const placeData = await response.json();
    
    // Transform to your Destination format
    const destination = {
      id: placeData.xid,
      name: placeData.name,
      country: placeData.address?.country || '',
      description: placeData.wikipedia_extracts?.text || 'No description available',
      imageUrl: placeData.preview?.source || '/placeholder-destination.jpg',
      bestTimeToVisit: 'All year',
      budget: {
        low: { min: 0, max: 1000, currency: 'USD' },
        medium: { min: 1000, max: 3000, currency: 'USD' },
        high: { min: 3000, max: 10000, currency: 'USD' }
      },
      interests: placeData.kinds?.split(',') || [],
      topAttractions: [],
      coordinates: {
        lat: placeData.point?.lat || 0,
        lon: placeData.point?.lon || 0
      }
    };
    
    return NextResponse.json(destination);
  } catch (error) {
    console.error('Error fetching destination:', error);
    return NextResponse.json(
      { error: 'Failed to fetch destination details' },
      { status: 500 }
    );
  }
}