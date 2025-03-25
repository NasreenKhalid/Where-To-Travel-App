'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Destination } from '@/types';
import { destinations } from '@/data/destinations';

export default function DestinationDetailPage() {
  const params = useParams();
  const destinationId = params.id as string;
  
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'attractions' | 'travel' | 'weather'>('overview');
  
  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/destinations/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to load destination');
        }
        
        const data = await response.json();
        setDestination(data);
      } catch (error) {
        setError('Could not load destination details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    if (params.id) {
      fetchDestination();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading destination details...</p>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error || 'Destination not found'}</p>
          <Link href="/destinations" className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
            Back to All Destinations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Banner */}
      <div 
        className="relative bg-cover bg-center h-96" 
        style={{ 
          backgroundImage: `url(${destination.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-12">
          <div className="mb-4">
            <Link href="/destinations" className="text-white bg-purple-500 bg-opacity-70 px-4 py-2 rounded-lg hover:bg-opacity-100 transition-all">
              ← Back to Destinations
            </Link>
          </div>
          <h1 className="text-5xl font-bold text-white mb-2">{destination.name}</h1>
          <h2 className="text-2xl text-white mb-4">{destination.country}</h2>
          
          <div className="flex flex-wrap gap-2">
            {destination.interests.map((interest, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm text-white rounded-full text-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
  <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
    </svg>
    Back to Homepage
  </Link>
</div>
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-8 overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'overview' 
                ? 'text-purple-600 border-b-2 border-purple-500' 
                : 'text-gray-500 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'attractions' 
                ? 'text-purple-600 border-b-2 border-purple-500' 
                : 'text-gray-500 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('attractions')}
            >
              Attractions
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'travel' 
                ? 'text-purple-600 border-b-2 border-purple-500' 
                : 'text-gray-500 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('travel')}
            >
              Travel Info
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'weather' 
                ? 'text-purple-600 border-b-2 border-purple-500' 
                : 'text-gray-500 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('weather')}
            >
              Weather
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">About {destination.name}</h3>
                <p className="text-gray-600 mb-6">
                  {destination.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Best Time to Visit</h4>
                    <p className="text-gray-600 mb-4">{destination.bestTimeToVisit}</p>
                    
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Budget Range</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-600 w-24">Budget:</span>
                        <div className="h-2 bg-gray-200 rounded-full flex-1">
                          <div className="h-2 bg-green-500 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-600 w-24">Moderate:</span>
                        <div className="h-2 bg-gray-200 rounded-full flex-1">
                          <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '50%' }}></div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-600 w-24">Luxury:</span>
                        <div className="h-2 bg-gray-200 rounded-full flex-1">
                          <div className="h-2 bg-red-500 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Local Tips</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500">✓</span>
                        <span>Best to visit major attractions early in the morning</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500">✓</span>
                        <span>Local transportation is reliable and affordable</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500">✓</span>
                        <span>Try the local cuisine for an authentic experience</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500">✓</span>
                        <span>Credit cards are widely accepted in most establishments</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {/* Attractions Tab */}
            {activeTab === 'attractions' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Top Attractions in {destination.name}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {destination.topAttractions?.map((attraction, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={attraction.imageUrl || '/placeholder-attraction.jpg'} 
                          alt={attraction.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">{attraction.name}</h4>
                        <p className="text-gray-600 mb-3">
                          {attraction.description || 'A must-visit attraction in ' + destination.name}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Popularity: High</span>
                          <a
                            href={`https://www.google.com/search?q=${encodeURIComponent(attraction.name + ' ' + destination.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-800"
                          >
                            Learn More →
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {(!destination.topAttractions || destination.topAttractions.length === 0) && (
                  <p className="text-gray-600 text-center py-8">
                    Information about attractions is currently unavailable.
                  </p>
                )}
              </div>
            )}
            
            {/* Travel Info Tab */}
            {activeTab === 'travel' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Travel Information</h3>
                
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">How to Get There</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <svg className="h-5 w-5 text-gray-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <h5 className="font-medium text-gray-800">By Air</h5>
                      </div>
                      <p className="text-gray-600 text-sm">
                        International airport with direct flights from major cities.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <svg className="h-5 w-5 text-gray-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <h5 className="font-medium text-gray-800">By Train</h5>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Connected to major cities by high-speed rail.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <svg className="h-5 w-5 text-gray-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <h5 className="font-medium text-gray-800">By Car</h5>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Well-connected road network makes driving convenient.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Accommodation Options</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-2">Budget (${destination.budget?.low?.min} - ${destination.budget?.low?.max})</h5>
                      <p className="text-gray-600 text-sm">
                        Hostels, guesthouses, and budget hotels offering basic amenities.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-2">Mid-range (${destination.budget?.medium?.min} - ${destination.budget?.medium?.max})</h5>
                      <p className="text-gray-600 text-sm">
                        3-4 star hotels with good amenities and central locations.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-2">Luxury (${destination.budget?.high?.min}+)</h5>
                      <p className="text-gray-600 text-sm">
                        5-star hotels, boutique resorts, and exclusive vacation rentals.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between gap-4">
                  <a 
                    href={destination.flightLink} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Find Flights
                  </a>
                  
                  <a 
                    href={destination.hotelLink} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Browse Hotels
                  </a>
                  
                  <a 
                    href={destination.tourLink} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Explore Tours
                  </a>
                </div>
              </div>
            )}
            
            {/* Weather Tab */}
            {activeTab === 'weather' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Weather & Climate</h3>
                
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Best Time to Visit</h4>
                  <p className="text-gray-600 mb-4">
                    {destination.bestTimeToVisit}
                  </p>
                  
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Climate Overview</h4>
                  <p className="text-gray-600">
                    {destination.name} typically has a {
                      destination.coordinates.lat > 23 ? 'temperate' : 
                      destination.coordinates.lat > 0 ? 'tropical' : 
                      'southern hemisphere'
                    } climate with {
                      destination.country.includes('Indonesia') || destination.country.includes('Thailand') ? 
                      'distinct wet and dry seasons.' : 
                      destination.country.includes('Japan') || destination.country.includes('USA') ? 
                      'four distinct seasons.' :
                      'varying seasonal patterns.'
                    }
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {['Spring', 'Summer', 'Autumn', 'Winter'].map((season, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-800 mb-2">{season}</h5>
                      <p className="text-gray-600 text-sm">
                        {season === 'Spring' && 'Mild temperatures with occasional rainfall. Excellent time for outdoor activities.'}
                        {season === 'Summer' && 'Warm to hot temperatures. Perfect for beach activities and water sports.'}
                        {season === 'Autumn' && 'Cooling temperatures with beautiful scenery. Great for hiking and photography.'}
                        {season === 'Winter' && 'Cooler temperatures with occasional precipitation. Indoor activities recommended.'}
                      </p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {season === 'Spring' && 'Mar-May'}
                          {season === 'Summer' && 'Jun-Aug'}
                          {season === 'Autumn' && 'Sep-Nov'}
                          {season === 'Winter' && 'Dec-Feb'}
                        </span>
                        <span className="text-sm font-medium text-gray-800">
                          {season === 'Spring' && '15-25°C'}
                          {season === 'Summer' && '25-35°C'}
                          {season === 'Autumn' && '15-25°C'}
                          {season === 'Winter' && '5-15°C'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Map Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Location</h3>
            
            <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
              {/* In a real application, you would embed a Google Map or similar here */}
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-600">
                  Map showing {destination.name} at coordinates {destination.coordinates.lat.toFixed(4)}, {destination.coordinates.lon.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar Destinations */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">You Might Also Like</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {destinations
                .filter(d => d.id !== destination.id)
                .filter(d => d.interests.some(i => destination.interests.includes(i)))
                .slice(0, 3)
                .map(similarDest => (
                  <Link 
                    key={similarDest.id} 
                    href={`/destination/${similarDest.id}`}
                    className="block group"
                  >
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={similarDest.imageUrl}
                          alt={similarDest.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-purple-600 transition-colors">
                          {similarDest.name}
                        </h4>
                        <p className="text-gray-600 text-sm">{similarDest.country}</p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}