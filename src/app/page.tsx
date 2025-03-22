'use client'; 

import { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { PreferenceForm } from '../components/PreferenceForm';
import { DestinationCard } from '../components/DestinationCard';
import { Destination, UserPreferences } from '../types';
import { destinations } from '../data/destinations';
import { useGeolocation } from '../hooks/useGeolocation';
import { getDistance } from '../utils/distance';
import { GlobeSpinner } from '../components/GlobeSpinner';

const Home: NextPage = () => {
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { userLocation, loading: locationLoading, error: locationError } = useGeolocation();

  const handleSubmit = (preferences: UserPreferences) => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
     let filteredDestinations = destinations.filter((destination) => {
        // Match by budget
        const budgetMatch = true; // All destinations have all budget options
        
        // Match by interests (at least one interest should match)
        const interestsMatch = destination.interests.some(interest => 
          preferences.interests.includes(interest)
        );
        
        return budgetMatch && interestsMatch;
      });
      
// Filter by distance if user location is available and budget is low
if (userLocation && preferences.budget === 'low') {
  const MAX_DISTANCE_KM = 2000; // Adjust as needed
  
  filteredDestinations = filteredDestinations.filter(destination => {
    const distance = getDistance(
      userLocation.lat,
      userLocation.lon,
      destination.coordinates.lat,
      destination.coordinates.lon
    );
    
    return distance <= MAX_DISTANCE_KM;
  });
}


      if (filteredDestinations.length === 0) {
        alert('No destinations match your preferences. Please try different options.');
        setIsLoading(false);
        return;
      }
      
      // Select a random destination from filtered results
      const randomIndex = Math.floor(Math.random() * filteredDestinations.length);
      setSelectedDestination(filteredDestinations[randomIndex]);
      setUserPreferences(preferences);
      setIsLoading(false);
    }, 1000);
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
        const budgetMatch = true; // All destinations have all budget options
        
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
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Where To? | Spontaneous Travel Idea Generator</title>
        <meta name="description" content="Get instant travel destination recommendations based on your preferences" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        {/* Show location status if needed */}
        {locationLoading && !selectedDestination && (
          <div className="text-center text-gray-500 mb-4">
            Getting your location to find nearby destinations...
          </div>
        )}
        {locationError && !selectedDestination && (
          <div className="text-center text-red-500 mb-4">
            {locationError}. We&apos;ll show you destinations from around the world.
          </div>
        )}
        {/* Hero Section */}
        {!selectedDestination && (
          <div className="text-center max-w-3xl mx-auto mb-10">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Where To Next? Let Us Surprise You!
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 mb-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Enter your travel preferences & get an instant destination!
            </motion.p>
            

          </div>

          
        )}

        {/* Loading State */}
        {isLoading && (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '16rem' }}>
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
              <PreferenceForm onSubmit={handleSubmit} />
            </motion.div>
          ) : null}

          {selectedDestination && !isLoading ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <DestinationCard 
                destination={selectedDestination} 
                selectedBudget={userPreferences?.budget || 'medium'}
                onRandomize={handleRandomizeAgain}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">
              🌍 Discover the world one random trip at a time!
            </p>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Terms & Conditions</a>
            </div>
          </div>
          
          {/* Newsletter Signup */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📩 Get weekly travel deals & destination ideas!</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;