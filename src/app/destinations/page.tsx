'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGeolocation } from '@/hooks/useGeolocation';
import { destinations } from '@/data/destinations';
import { getDistance } from '@/utils/distance';
import { Destination } from '@/types';

// Define enums for filtering
type DestinationType = 'all' | 'beaches' | 'mountains' | 'cities' | 'historical';
type BudgetFilter = 'all' | 'low' | 'medium' | 'high';
type TravelTime = 'all' | 'short' | 'weekend' | 'long';

export default function DestinationsPage() {
  // State for user location
  const { userLocation, loading: locationLoading, error: locationError } = useGeolocation();
  const [manualLocation, setManualLocation] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [locationName, setLocationName] = useState<string>('');

  // State for filtered destinations
  const [domesticDestinations, setDomesticDestinations] = useState<Destination[]>([]);
  const [internationalDestinations, setInternationalDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  
  // State for filters
  const [destinationType, setDestinationType] = useState<DestinationType>('all');
  const [budgetFilter, setBudgetFilter] = useState<BudgetFilter>('all');
  const [travelTimeFilter, setTravelTimeFilter] = useState<TravelTime>('all');
  
  const [userCountry, setUserCountry] = useState<string>('');
  
  // Constants
  const DOMESTIC_RADIUS_KM = 1000;
  const INTERNATIONAL_RADIUS_KM = 5000;


  const getLocationNameFromCoordinates = async (lat: number, lon: number) => {
    try {
      // In a real app, you would use a reverse geocoding API like Google Maps Geocoding API
      // For now, we'll use a simplified approach
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location name');
      }
      
      const data = await response.json();
      
      // Extract city and country from the response
      const city = data.address.city || 
                   data.address.town || 
                   data.address.village || 
                   data.address.county || 
                   'Unknown City';
                   
      const country = data.address.country || 'Unknown Country';
       // Set the user's country
      setUserCountry(data.address.country_code?.toUpperCase() || 'Unknown');
      setLocationName(`${city}, ${country}`);
    } catch (error) {
      console.error('Error getting location name:', error);
      setLocationName('your current location');
    }
  };

  useEffect(() => {
    if (userLocation || manualLocation) {
      filterDestinationsByLocation();
    }
  }, [userLocation, manualLocation, destinationType, budgetFilter, travelTimeFilter]);

  const filterDestinationsByLocation = async () => {
    if (!userLocation && !manualLocation) return;
    
    setIsLoading(true);
    
    try {
      let lat, lon;
      
      if (userLocation) {
        lat = userLocation.lat;
        lon = userLocation.lon;
      } else {
        // For manual location, you'd need geocoding
        // For simplicity, we'll skip this for now
        setIsLoading(false);
        return;
      }
      
      // Build query string
      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        country: userCountry || 'US',
        domestic: travelTypeFilter === 'domestic' ? 'true' : 'false',
        radius: '100000',
        limit: '30',
        budget: budgetFilter !== 'all' ? budgetFilter : ''
      });
      
      const response = await fetch(`/api/destinations?${params}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      setDomesticDestinations(data.domestic || []);
      setInternationalDestinations(data.international || []);
      setFilteredDestinations(data.destinations || []);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      // Fallback to empty arrays
      setDomesticDestinations([]);
      setInternationalDestinations([]);
      setFilteredDestinations([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleManualLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would geocode this location to get coordinates
    // For now, we'll just use it as a flag to filter destinations
    filterDestinationsByLocation();
  };
  
  const getTravelOptions = (destination: Destination) => {
    // This would be fetched from an API in a real application
    // For now, we'll return mock data based on distance
    
    const distance = destination.distance || 0;
    
    if (distance < 200) {
      return "1-hour flight | 2-hour drive | Train available";
    } else if (distance < 500) {
      return "2-hour flight | 5-hour drive";
    } else if (distance < 1000) {
      return "3-hour flight";
    } else {
      return "6+ hour flight";
    }
  };

  useEffect(() => {
    if (userLocation) {
      getLocationNameFromCoordinates(userLocation.lat, userLocation.lon);
      filterDestinationsByLocation();
    }
  }, [userLocation]);
  
  const getWeatherInfo = (destination: Destination) => {
    // This would be fetched from a weather API in a real application
    // For now, we'll return mock data
    
    // Generate a realistic temperature based on destination name (for demo purposes)
    const hash = destination.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const temperature = 15 + (hash % 20); // Temperature between 15-35°C
    
    return `${temperature}°C currently`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header/Navigation would be here - reused from your main page */}
      
      {/* Hero Banner */}
      <div 
        className="relative bg-cover bg-center py-24" 
        style={{ 
          backgroundImage: "url('/destinations-hero.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative container mx-auto text-center text-white z-10">
          <h1 className="text-5xl font-bold mb-4">Discover Amazing Destinations</h1>
          <p className="text-xl mb-8">Find perfect travel spots based on your location</p>
          <div className="w-24 h-1 bg-purple-500 mx-auto mb-8"></div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
      <div className="mb-6">
  <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
    </svg>
    Back to Homepage
  </Link>
</div>
        {/* Location Section */}
        <section className="mb-12">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Location</h2>
            
            {locationLoading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Getting your location...</p>
              </div>
            )}
            
            {locationError && !showManualInput && (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-4">{locationError}</p>
                <button 
                  onClick={() => setShowManualInput(true)}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Enter Location Manually
                </button>
              </div>
            )}
            
            {showManualInput && (
              <form onSubmit={handleManualLocationSubmit} className="mb-6">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={manualLocation}
                    onChange={(e) => setManualLocation(e.target.value)}
                    placeholder="Enter your city, country"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>
            )}
            
            {userLocation && (
             <div className="py-2">
             <p className="text-gray-600">
               {locationName ? (
                 `Showing destinations near ${locationName}`
               ) : (
                 `Showing destinations near your current location`
               )}
             </p>
           </div>
            )}
            
            {manualLocation && (
              <div className="py-2">
                <p className="text-gray-600">
                  Showing destinations near {manualLocation}
                </p>
              </div>
            )}
          </div>
        </section>
        
        {/* Filters Section */}
        <section className="mb-12">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Filter Destinations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Destination Type Filter */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Destination Type</label>
                <select
                  value={destinationType}
                  onChange={(e) => setDestinationType(e.target.value as DestinationType)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Types</option>
                  <option value="beaches">Beaches</option>
                  <option value="mountains">Mountains</option>
                  <option value="cities">Cities</option>
                  <option value="historical">Historical Sites</option>
                </select>
              </div>
              
              {/* Budget Filter */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Budget</label>
                <select
                  value={budgetFilter}
                  onChange={(e) => setBudgetFilter(e.target.value as BudgetFilter)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Budgets</option>
                  <option value="low">Budget</option>
                  <option value="medium">Moderate</option>
                  <option value="high">Luxury</option>
                </select>
              </div>
              
              {/* Travel Time Filter */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Travel Time</label>
                <select
                  value={travelTimeFilter}
                  onChange={(e) => setTravelTimeFilter(e.target.value as TravelTime)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Durations</option>
                  <option value="short">Short Trips (1-3 days)</option>
                  <option value="weekend">Weekend Getaways (3-5 days)</option>
                  <option value="long">Long Vacations (1 week+)</option>
                </select>
              </div>
            </div>
          </div>
        </section>
        
        {/* Domestic Destinations */}
        {domesticDestinations.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Domestic Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {domesticDestinations.map(destination => (
                <div key={destination.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* Destination Image */}
                  <div className="relative h-48">
                    <img 
                      src={destination.imageUrl} 
                      alt={destination.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{destination.name}</h3>
                      <p className="text-sm">{destination.country}</p>
                    </div>
                  </div>
                  
                  {/* Destination Info */}
                  <div className="p-4">
                    <p className="text-gray-600 mb-4 line-clamp-2">{destination.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-800">Distance</h4>
                      <p className="text-gray-600">
                        {destination.distance 
                          ? `${Math.round(destination.distance)} km away` 
                          : 'Distance not available'}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-800">Travel Options</h4>
                      <p className="text-gray-600">{getTravelOptions(destination)}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-800">Weather</h4>
                      <p className="text-gray-600">
                        {getWeatherInfo(destination)} | 
                        Best time: {destination.bestTimeToVisit}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-800">Top Attractions</h4>
                      <p className="text-gray-600">
                        {destination.topAttractions?.slice(0, 3).map(a => a.name).join(', ')}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                          {budgetFilter !== 'all' ? budgetFilter : 'medium'} budget
                        </span>
                      </div>
                      
                      <Link 
                        href={`/destination/${destination.id}`}
                        className="text-purple-600 hover:text-purple-800 font-medium"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* International Destinations */}
        {internationalDestinations.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">International Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {internationalDestinations.map(destination => (
                <div key={destination.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* Destination Image */}
                  <div className="relative h-48">
                    <img 
                      src={destination.imageUrl} 
                      alt={destination.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{destination.name}</h3>
                      <p className="text-sm">{destination.country}</p>
                    </div>
                  </div>
                  
                  {/* Destination Info */}
                  <div className="p-4">
                    <p className="text-gray-600 mb-4 line-clamp-2">{destination.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-800">Distance</h4>
                      <p className="text-gray-600">
                        {destination.distance 
                          ? `${Math.round(destination.distance)} km away` 
                          : 'Distance not available'}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-800">Travel Options</h4>
                      <p className="text-gray-600">{getTravelOptions(destination)}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-800">Weather</h4>
                      <p className="text-gray-600">
                        {getWeatherInfo(destination)} | 
                        Best time: {destination.bestTimeToVisit}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-800">Top Attractions</h4>
                      <p className="text-gray-600">
                        {destination.topAttractions?.slice(0, 3).map(a => a.name).join(', ')}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                          {budgetFilter !== 'all' ? budgetFilter : 'medium'} budget
                        </span>
                      </div>
                      
                      <Link 
                        href={`/destination/${destination.id}`}
                        className="text-purple-600 hover:text-purple-800 font-medium"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* No Results */}
        {domesticDestinations.length === 0 && internationalDestinations.length === 0 && 
         (userLocation || manualLocation) && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No destinations found</h3>
            <p className="text-gray-600">Try adjusting your filters or entering a different location.</p>
          </div>
        )}
      </main>
      
      {/* Footer would be here - reused from your main page */}
    </div>
  );
}