import { NextResponse } from 'next/server';
import { Destination } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const country = searchParams.get('country');
  const isDomestic = searchParams.get('domestic') === 'true';
  const radius = searchParams.get('radius') || '100000'; // 100km default
  const limit = searchParams.get('limit') || '20';
  const kinds = searchParams.get('kinds') || 'interesting_places';
  const budgetFilter = searchParams.get('budget');
  
  if (!lat || !lon) {
    return NextResponse.json({ error: 'Missing latitude or longitude' }, { status: 400 });
  }
  
  const API_KEY = process.env.OPENTRIPMAP_API_KEY;
  
  try {
    // Step 1: Get places in radius
    const radiusUrl = `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&limit=${limit}&format=json&apikey=${API_KEY}`;
    const radiusResponse = await fetch(radiusUrl);
    
    if (!radiusResponse.ok) {
      throw new Error(`OpenTripMap API error: ${radiusResponse.status}`);
    }
    
    const places = await radiusResponse.json();
    
    // Step 2: Filter domestic vs international
    const filteredPlaces = isDomestic 
      ? places.filter(place => place.country === country)
      : places.filter(place => place.country !== country);
    
    // Step 3: Get detailed info for each place
    const detailedPlaces = await Promise.all(
      filteredPlaces.slice(0, 10).map(async (place) => {
        const detailUrl = `https://api.opentripmap.com/0.1/en/places/xid/${place.xid}?apikey=${API_KEY}`;
        const detailResponse = await fetch(detailUrl);
        
        if (!detailResponse.ok) {
          return null;
        }
        
        const detail = await detailResponse.json();
        
        // Map to our application's Destination type
        return {
          id: place.xid,
          name: detail.name || place.name,
          country: detail.address?.country || place.country,
          description: detail.wikipedia_extracts?.text || 'No description available',
          imageUrl: detail.preview?.source || '/placeholder-destination.jpg',
          bestTimeToVisit: 'All year', // OpenTripMap doesn't provide this
          budget: {
            low: { min: 0, max: 1000, currency: 'USD' },
            medium: { min: 1000, max: 3000, currency: 'USD' },
            high: { min: 3000, max: 10000, currency: 'USD' }
          },
          interests: detail.kinds?.split(',') || [],
          topAttractions: detail.otm 
            ? [{ name: detail.name, description: '', imageUrl: '' }] 
            : [],
          coordinates: {
            lat: parseFloat(place.point.lat),
            lon: parseFloat(place.point.lon)
          },
          distance: place.dist
        } as Destination;
      })
    );
    
    // Filter out nulls and apply budget filter if specified
    const validPlaces = detailedPlaces.filter(place => place !== null);
    
    // Budget filtering would be approximate since OpenTripMap doesn't have budget info
    const budgetFiltered = budgetFilter 
      ? validPlaces.filter(place => place.budget && place.budget[budgetFilter])
      : validPlaces;
    
    return NextResponse.json({ 
      destinations: budgetFiltered,
      domestic: budgetFiltered.filter(place => place.country === country),
      international: budgetFiltered.filter(place => place.country !== country)
    });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 });
  }
}