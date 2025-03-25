'use client'; 
import Link from 'next/link';
import { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Destination, UserPreferences, Budget, Interest, Duration } from '../types';
import { destinations } from '../data/destinations';
import { useGeolocation } from '../hooks/useGeolocation';
import { getDistance } from '../utils/distance';
import { GlobeSpinner } from '../components/GlobeSpinner';
import Image from 'next/image';
import { getAIDestinationRecommendations } from '../services/aiDestinationService';

const Home: NextPage = () => {
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUsingAI, setIsUsingAI] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const { userLocation, loading: locationLoading, error: locationError } = useGeolocation();
  const [userCountry, setUserCountry] = useState<string>('');
  // Form state
  const [budget, setBudget] = useState<Budget | ''>('');
  const [minBudget, setMinBudget] = useState<string>('');
  const [maxBudget, setMaxBudget] = useState<string>('');
  const [useCustomBudget, setUseCustomBudget] = useState<boolean>(false);
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [departureCity, setDepartureCity] = useState<string>('');
  const [travelType, setTravelType] = useState<string>('');
  const [duration, setDuration] = useState<Duration | ''>('');
  
  // Popular destinations (example data - replace with real data)
  const [popularDestinations, setPopularDestinations] = useState([
    { id: 1, name: 'Bali, Indonesia', image: '/destinations/bali.jpg' },
    { id: 2, name: 'Santorini, Greece', image: '/destinations/santorini.jpg' },
    { id: 3, name: 'Kyoto, Japan', image: '/destinations/kyoto.jpg' },
    { id: 4, name: 'Paris, France', image: '/destinations/paris.jpg' },
  ]);

  const interestOptions = [
    { id: 'adventure', label: 'Adventure', icon: '🧗‍♂️' },
    { id: 'beaches', label: 'Beaches', icon: '🏖️' },
    { id: 'culture', label: 'Culture', icon: '🏛️' },
    { id: 'food', label: 'Food', icon: '🍜' },
    { id: 'nature', label: 'Nature', icon: '🌲' },
    { id: 'relaxation', label: 'Relaxation', icon: '🧘‍♀️' },
  ] as const;

  const durationOptions = [
    { id: 'weekend', label: 'Weekend' },
    { id: '1 week', label: '1 Week' },
    { id: '2 weeks', label: '2 Weeks' },
  ] as const;

  const getCountryFromCoordinates = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }
      
      const data = await response.json();
      
      // Extract country code from the response
      const countryCode = data.address?.country_code?.toUpperCase() || 'US';
      setUserCountry(countryCode);
      return countryCode;
    } catch (error) {
      console.error('Error getting country from coordinates:', error);
      return 'US'; // Default fallback
    }
  };

  useEffect(() => {
    if (userLocation) {
      getCountryFromCoordinates(userLocation.lat, userLocation.lon);
    }
  }, [userLocation]);

  const handleInterestToggle = (interest: Interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleShowMeDestination = () => {
    if (!budget && !useCustomBudget) {
      alert('Please select a budget');
      return;
    }
    
    if (selectedInterests.length === 0) {
      alert('Please select at least one interest');
      return;
    }
    
    let selectedDuration: Duration = duration as Duration;
    if (!duration) {
      // Default to 1 week if not specified
      selectedDuration = '1 week';
    }
    
    const preferences: UserPreferences = {
      budget: budget as Budget,
      interests: selectedInterests,
      duration: selectedDuration,
      departureCity: departureCity || undefined
    };
    
    handleSubmit(preferences);
  };

  const handleSubmit = async (preferences: UserPreferences) => {
    setIsLoading(true);
    
    console.log("Handling submit with preferences:", preferences);
    
    try {
      // Determine whether to use AI recommendations
      if (isUsingAI) {
        // You can implement AI features here if needed
      }
      
      // Get user location
      let lat = 0, lon = 0;
      let country = userCountry || 'US';
      if (userLocation) {
        lat = userLocation.lat;
        lon = userLocation.lon;
      }else if (departureCity) {
        // If user entered a departure city but we don't have coordinates,
        // we'll still use this for the country filtering
        country = userCountry || 'US';
      }
      
      // Build API request
      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        country: country,
        domestic: travelType === 'domestic' ? 'true' : 'false',
        radius: '500000', // Larger radius for more options
        limit: '50',
        budget: budget !== '' ? budget : ''
      });
      
      const response = await fetch(`/api/destinations?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch destinations');
      }
      
      const data = await response.json();
      
      if (data.destinations && data.destinations.length > 0) {
        // Select a random destination that matches user's interests
        const matchingDestinations = data.destinations.filter(destination => 
          destination.interests.some(interest => 
            preferences.interests.includes(interest)
          )
        );
        
        const destinationsToUse = matchingDestinations.length > 0 ? 
          matchingDestinations : data.destinations;
        
      
      // Select a random destination from filtered results
      const randomIndex = Math.floor(Math.random() * destinationsToUse.length);
      setSelectedDestination(destinationsToUse[randomIndex]);
      setUserPreferences(preferences);
    } else {
      alert('No destinations match your preferences. Please try different options.');
    }
  } catch (error) {
    console.error('Error getting destinations:', error);
    alert('Error finding destinations. Please try again.');
  } finally {
    setIsLoading(false);
  }
};


  const handleRandomizeAgain = () => {
    if (!userPreferences) return;
    
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const filteredDestinations = destinations.filter((destination) => {
        // Don't show the same destination twice in a row
        if (selectedDestination && destination.id === selectedDestination.id) {
          return false;
        }
        
        // Match by budget
        let budgetMatch = true;
        const selectedBudget = userPreferences.budget;
        
        if (selectedBudget && destination.budget && destination.budget[selectedBudget]) {
          budgetMatch = true; // We have budget info for this destination
        }
        
        // Match by interests (at least one interest should match)
        const interestsMatch = destination.interests.some(interest => 
          userPreferences.interests.includes(interest)
        );
        
        return budgetMatch && interestsMatch;
      });
      
      if (filteredDestinations.length === 0) {
        alert('No other destinations match your preferences. Please try different options.');
        setIsLoading(false);
        return;
      }
      
      // Select a random destination from filtered results
      const randomIndex = Math.floor(Math.random() * filteredDestinations.length);
      setSelectedDestination(filteredDestinations[randomIndex]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Where To? | Spontaneous Travel Idea Generator</title>
        <meta name="description" content="Get instant travel destination recommendations based on your preferences" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Header/Navigation */}
      <header className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
          <Link href="/" as="/" className="flex items-center space-x-1 cursor-pointer"
           onClick={() => console.log('Logo clicked!')}
          >
         
  <h1 className="text-2xl font-bold">WHERE TO</h1>
  <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded">TRAVEL ADVISOR</span>
</Link>
            
<nav>
  <ul className="flex space-x-6">
    <li>
      <Link href="/destinations" className="hover:text-teal-300 transition-colors">
        Destinations
      </Link>
    </li>
    <li>
      <Link href="/experiences" className="hover:text-teal-300 transition-colors">
        Experiences
      </Link>
    </li>
    <li>
      <Link href="/about" className="hover:text-teal-300 transition-colors">
        About
      </Link>
    </li>
    <li>
      <Link href="/subscribe" className="bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded transition-colors">
        Subscribe
      </Link>
    </li>
  </ul>
</nav>
          </div>
        </div>
      </header>
      
      {/* Hero Section with Background Image */}
      <div 
        className="relative bg-cover bg-center py-24" 
        style={{ 
          backgroundImage: "url('/hero-travel.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative container mx-auto text-center text-white z-10">
          <h1 className="text-5xl font-bold mb-4">Your Next Adventure Awaits ✈️</h1>
          <p className="text-xl mb-8">Discover the most stunning places to visit and photograph.📍</p>
          <div className="w-24 h-1 bg-purple-500 mx-auto mb-8"></div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section - 2/3 of the width on desktop */}
          <div className="lg:w-2/3">
            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <GlobeSpinner />
              </div>
            )}
            
            {/* Form or Result */}
            <AnimatePresence mode="wait">
              {!selectedDestination && !isLoading ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div style={{
                    background: 'linear-gradient(135deg, #f3f4f6, #205294, #bfdbfe)',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }} className="p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Find Your Perfect Getaway</h2>
                    
                    {/* Budget Selection */}
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-700 mb-4">Budget</h3>
                      <div className="flex flex-wrap gap-4 mb-4">
                        <button
                          className={`px-6 py-3 rounded-full border border-gray-300 font-medium transition-all hover:border-purple-500 ${
                            budget === 'low' ? 'bg-purple-500 text-white border-purple-500' : 'text-gray-800 bg-white'
                          }`}
                          onClick={() => {
                            setBudget('low');
                            setUseCustomBudget(false);
                          }}
                        >
                          $ - Budget
                        </button>
                        <button
                          className={`px-6 py-3 rounded-full border border-gray-300 font-medium transition-all hover:border-purple-500 ${
                            budget === 'medium' ? 'bg-purple-500 text-white border-purple-500' : 'text-gray-800 bg-white'
                          }`}
                          onClick={() => {
                            setBudget('medium');
                            setUseCustomBudget(false);
                          }}
                        >
                          $$ - Moderate
                        </button>
                        <button
                          className={`px-6 py-3 rounded-full border border-gray-300 font-medium transition-all hover:border-purple-500 ${
                            budget === 'high' ? 'bg-purple-500 text-white border-purple-500' : 'text-gray-800 bg-white'
                          }`}
                          onClick={() => {
                            setBudget('high');
                            setUseCustomBudget(false);
                          }}
                        >
                          $$$ - Luxury
                        </button>
                      </div>
                      
                      {/* Custom Budget Range */}
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Or specify your price range:</p>
                        <div className="flex items-center gap-4">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                            <input
                              type="number"
                              value={minBudget}
                              onChange={(e) => {
                                setMinBudget(e.target.value);
                                setUseCustomBudget(true);
                                setBudget('custom');
                              }}
                              placeholder="Min budget"
                              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <span className="text-gray-500">to</span>
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                            <input
                              type="number"
                              value={maxBudget}
                              onChange={(e) => {
                                setMaxBudget(e.target.value);
                                setUseCustomBudget(true);
                                setBudget('custom');
                              }}
                              placeholder="Max budget"
                              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Interests */}
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-700 mb-4">Interests</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {interestOptions.map(interest => (
                          <button
                            key={interest.id}
                            className={`px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                              selectedInterests.includes(interest.id as Interest) 
                                ? 'bg-purple-500 text-white' 
                                : 'bg-white text-gray-800 hover:bg-gray-100'
                            }`}
                            onClick={() => handleInterestToggle(interest.id as Interest)}
                          >
                            <span className="text-xl">{interest.icon}</span>
                            <span>{interest.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Travel Type */}
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-700 mb-4">Travel Type</h3>
                      <div className="flex gap-4">
                        <button
                          className={`flex-1 px-6 py-3 rounded-lg border font-medium transition-all ${
                            travelType === 'domestic' 
                              ? 'bg-purple-500 text-white border-purple-500' 
                              : 'bg-white border-gray-300 text-gray-800 hover:border-purple-500'
                          }`}
                          onClick={() => setTravelType('domestic')}
                        >
                          Domestic
                        </button>
                        <button
                          className={`flex-1 px-6 py-3 rounded-lg border font-medium transition-all ${
                            travelType === 'international' 
                              ? 'bg-purple-500 text-white border-purple-500' 
                              : 'bg-white border-gray-300 text-gray-800 hover:border-purple-500'
                          }`}
                          onClick={() => setTravelType('international')}
                        >
                          International
                        </button>
                      </div>
                    </div>
                    
                    {/* Duration */}
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-700 mb-4">Trip Duration</h3>
                      <div className="flex flex-wrap gap-4">
                        {durationOptions.map(option => (
                          <button
                            key={option.id}
                            className={`px-6 py-3 rounded-full border transition-all ${
                              duration === option.id 
                                ? 'bg-purple-500 text-white border-purple-500' 
                                : 'bg-white border-gray-300 text-gray-800 hover:border-purple-500'
                            }`}
                            onClick={() => setDuration(option.id as Duration)}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Departure City */}
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-700 mb-4">Departure City</h3>
                      <input
                        type="text"
                        value={departureCity}
                        onChange={(e) => setDepartureCity(e.target.value)}
                        placeholder="Enter your departure city"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    {/* AI Recommendations Toggle */}
                    <div className="mb-8">
                      <div className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={isUsingAI}
                              onChange={() => setIsUsingAI(!isUsingAI)}
                            />
                            <div className={`block w-14 h-8 rounded-full ${isUsingAI ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isUsingAI ? 'transform translate-x-6' : ''}`}></div>
                          </div>
                          <div className="ml-3 text-gray-700 font-medium">Use AI-Enhanced Recommendations</div>
                        </label>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Enable to get personalized recommendations tailored to your preferences using AI.</p>
                    </div>
                    
                    {/* AI Recommendations */}
                    {isUsingAI && aiRecommendations.length > 0 && (
                      <div className="mb-8 mt-6">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">AI Suggested Destinations</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {aiRecommendations.slice(0, 4).map((recommendation, index) => (
                            <div 
                              key={index}
                              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                              onClick={() => {
                                // Convert to destination format and set as selected
                                const convertedDestination: Destination = {
                                  id: recommendation.name.toLowerCase().replace(/\s+/g, '-'),
                                  name: recommendation.name,
                                  country: recommendation.country,
                                  description: recommendation.description,
                                  imageUrl: recommendation.image,
                                  bestTimeToVisit: recommendation.bestTimeToVisit,
                                  budget: {
                                    low: { min: 500, max: 1000, currency: 'USD' },
                                    medium: { min: 1000, max: 2000, currency: 'USD' },
                                    high: { min: 2000, max: 5000, currency: 'USD' }
                                  },
                                  interests: userPreferences?.interests || [],
                                  topAttractions: recommendation.highlights?.map(highlight => ({
                                    name: highlight,
                                    description: '',
                                    imageUrl: ''
                                  })) || [],
                                  coordinates: { lat: 0, lon: 0 }
                                };
                                
                                setSelectedDestination(convertedDestination);
                              }}
                            >
                              <div className="relative h-32">
                                <img 
                                  src={recommendation.image || '/placeholder-destination.jpg'} 
                                  alt={recommendation.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-2 left-2 text-white font-semibold">
                                  {recommendation.name}, {recommendation.country}
                                </div>
                              </div>
                              <div className="p-3">
                                <div className="flex items-center mb-1">
                                  <span className="text-xs text-purple-600 border border-purple-200 rounded-full px-2 py-0.5 bg-purple-50">
                                    {recommendation.budget}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {recommendation.description.substring(0, 100)}...
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Submit Button with Adventure Style */}
                    <div className="text-center">
                      <button
                        onClick={handleShowMeDestination}
                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white text-lg font-bold rounded-full shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl flex items-center justify-center mx-auto"
                        style={{
                          background: 'linear-gradient(to right, #8b5cf6, #6d28d9)',
                          boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)'
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        Show Me a Destination!
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : null}

              {selectedDestination && !isLoading ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white p-8 rounded-lg shadow-lg"
                >
                  <div className="flex justify-end mb-4">
                    <button 
                      onClick={() => setSelectedDestination(null)}
                      className="text-teal-600 hover:text-teal-800"
                    >
                      ← Back to search
                    </button>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">{selectedDestination.name}, {selectedDestination.country}</h2>
                  
                  <div className="aspect-w-16 aspect-h-9 mb-6 rounded-lg overflow-hidden">
                    <img 
                      src={selectedDestination.imageUrl} 
                      alt={selectedDestination.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">About</h3>
                      <p className="text-gray-600">{selectedDestination.description}</p>
                      <p className="text-gray-600 mt-4"><strong>Best time to visit:</strong> {selectedDestination.bestTimeToVisit}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">Top Attractions</h3>
                      <ul className="list-disc list-inside text-gray-600">
                        {selectedDestination.topAttractions?.map((attraction, index) => (
                          <li key={index}>{attraction.name}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedDestination.interests.map((interest, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                         ))}
                         </div>
                         
                         <div className="flex justify-between mb-6">
                           <a href={selectedDestination.flightLink} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800">
                             Find Flights
                           </a>
                           <a href={selectedDestination.hotelLink} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800">
                             Browse Hotels
                           </a>
                           <a href={selectedDestination.tourLink} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800">
                             Explore Tours
                           </a>
                         </div>
                         
                         <div className="flex justify-center">
                           <button
                             onClick={handleRandomizeAgain}
                             className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                           >
                             Show Me Another Destination
                           </button>
                         </div>
                       </motion.div>
                     ) : null}
                   </AnimatePresence>
                 </div>
                 
                 {/* Sidebar - 1/3 of the width on desktop */}
                 <div className="lg:w-1/3">
                   <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                     <h3 className="text-xl font-bold text-gray-800 mb-4">Popular Destinations</h3>
                     
                     <div className="space-y-4">
                       {popularDestinations.map(destination => (
                         <div key={destination.id} className="group cursor-pointer">
                           <div className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-2">
                             <img 
                               src={destination.image} 
                               alt={destination.name} 
                               className="object-cover w-full h-full transform transition-transform group-hover:scale-105"
                             />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
                             <div className="absolute bottom-0 left-0 p-3">
                               <h4 className="text-white font-medium">{destination.name}</h4>
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                     
                     <button className="w-full mt-4 px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                       View All Destinations
                     </button>
                   </div>
                   
                   <div className="bg-white p-6 rounded-lg shadow-lg">
                     <h3 className="text-xl font-bold text-gray-800 mb-4">Travel Tips</h3>
                     <ul className="space-y-3">
                       <li className="flex items-start gap-2">
                         <span className="text-purple-500 mt-1">✓</span>
                         <span className="text-gray-700">Book flights 2-3 months in advance for best prices</span>
                       </li>
                       <li className="flex items-start gap-2">
                         <span className="text-purple-500 mt-1">✓</span>
                         <span className="text-gray-700">Research local cultural norms before traveling</span>
                       </li>
                       <li className="flex items-start gap-2">
                         <span className="text-purple-500 mt-1">✓</span>
                         <span className="text-gray-700">Pack versatile clothing to save luggage space</span>
                       </li>
                       <li className="flex items-start gap-2">
                         <span className="text-purple-500 mt-1">✓</span>
                         <span className="text-gray-700">Always have a backup copy of important documents</span>
                       </li>
                     </ul>
                   </div>
                 </div>
               </div>
             </main>
             
             {/* Footer */}
             <footer className="bg-gray-900 text-white py-12">
               <div className="container mx-auto px-4">
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                   <div>
                     <h3 className="text-xl font-bold mb-4">WHERE TO</h3>
                     <p className="text-gray-400 mb-4">Helping travelers discover their perfect destinations since 2023.</p>
                     <div className="flex space-x-4">
                       <a href="#" className="text-gray-400 hover:text-white transition-colors">
                         <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                         </svg>
                       </a>
                       <a href="#" className="text-gray-400 hover:text-white transition-colors">
                         <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                         </svg>
                       </a>
                       <a href="#" className="text-gray-400 hover:text-white transition-colors">
                         <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path>
                         </svg>
                       </a>
                     </div>
                   </div>
                   
                   <div>
                     <h3 className="text-lg font-semibold mb-4">Explore</h3>
                     <ul className="space-y-2">
                       <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Destinations</a></li>
                       <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Top Attractions</a></li>
                       <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Travel Guides</a></li>
                       <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Hidden Gems</a></li>
                     </ul>
                   </div>
                   
                   <div>
                     <h3 className="text-lg font-semibold mb-4">Resources</h3>
                     <ul className="space-y-2">
                       <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Travel Planning</a></li>
                       <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Hotel Reviews</a></li>
                       <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Flight Deals</a></li>
                       <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Travel Insurance</a></li>
                     </ul>
                   </div>
                   
                   <div>
                     <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
                     <p className="text-gray-400 mb-4">Subscribe for travel tips and exclusive destination deals.</p>
                     <div className="flex">
                       <input
                         type="email"
                         placeholder="Your email"
                         className="px-4 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none flex-1"
                       />
                       <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-r-lg transition-colors">
                         Subscribe
                       </button>
                     </div>
                   </div>
                 </div>
                 
                 <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
                   <p>© 2025 Where To Travel Advisor. All rights reserved.</p>
                 </div>
               </div>
             </footer>
           </div>
         );
       };
       
       export default Home;