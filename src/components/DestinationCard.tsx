
'use client'; 
import React from 'react';
import { motion } from 'framer-motion';
import { Destination, Budget } from '../types';

interface DestinationCardProps {
  destination: Destination;
  selectedBudget: Budget;
  onRandomize: () => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  selectedBudget,
  onRandomize
}) => {
  const { min, max, currency } = destination.budget[selectedBudget];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Destination Header */}
      <div className="relative h-64 w-full">
        <img
          src={destination.imageUrl}
          alt={`${destination.name}, ${destination.country}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h2 className="text-3xl font-bold text-white">
            {destination.name}, <span className="font-normal">{destination.country}</span>
          </h2>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {/* Description */}
        <p className="text-gray-700 mb-6">{destination.description}</p>

        {/* Quick Info Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
            <span className="text-xl">🌤️</span>
            <div>
              <p className="text-sm text-gray-500">Best Time to Visit</p>
              <p className="font-medium">{destination.bestTimeToVisit}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
            <span className="text-xl">💰</span>
            <div>
              <p className="text-sm text-gray-500">Estimated Budget ({selectedBudget})</p>
              <p className="font-medium">
                {currency} {min} - {currency} {max}
              </p>
            </div>
          </div>
        </div>

        {/* Top Attractions */}
        <h3 className="text-xl font-semibold mb-4">Top Attractions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {destination.topAttractions.map((attraction, index) => (
            <div key={index} className="rounded-lg overflow-hidden shadow-md">
              <img 
                src={attraction.imageUrl} 
                alt={attraction.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-3">
                <h4 className="font-medium text-gray-900">{attraction.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{attraction.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <a 
            href={destination.flightLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 py-3 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            <span>✈️</span>
            <span>Find Flights</span>
          </a>
          <a 
            href={destination.hotelLink}
            target="_blank"
            rel="noopener noreferrer" 
            className="flex items-center justify-center space-x-2 py-3 px-4 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
          >
            <span>🏨</span>
            <span>Book Accommodation</span>
            </a>
        </div>
        
        <div className="grid grid-cols-1 gap-4 mb-8">
          <a 
            href={destination.tourLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 py-3 px-4 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
          >
            <span>🎟️</span>
            <span>Explore Tours & Experiences</span>
          </a>
        </div>

        {/* Premium Feature Prompt */}
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-lg border border-yellow-200 mb-8">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">💰</span>
            <div>
              <h4 className="font-semibold text-gray-900">Want a custom plan for your trip?</h4>
              <p className="text-sm text-gray-600 mt-1 mb-3">
                Let us create a detailed itinerary for you based on your preferences and travel style!
              </p>
              <button className="py-2 px-4 rounded-lg bg-yellow-500 text-white font-medium hover:bg-yellow-600 transition-colors">
                Get Your Custom Plan – $9.99
              </button>
            </div>
          </div>
        </div>

        {/* Random Again Button */}
        <div className="flex justify-center">
          <motion.button
            onClick={onRandomize}
            className="py-3 px-6 rounded-full bg-primary text-white font-medium hover:bg-primary-dark transition-colors flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>🔄</span>
            <span>Randomize Again</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};