'use client'; 

import React, { useState } from 'react';
import { Budget, Duration, Interest, UserPreferences } from '../types';
import { motion } from 'framer-motion';

interface PreferenceFormProps {
  onSubmit: (preferences: UserPreferences) => void;
}

export const PreferenceForm: React.FC<PreferenceFormProps> = ({ onSubmit }) => {
  const [budget, setBudget] = useState<Budget>('medium');
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [duration, setDuration] = useState<Duration>('1 week');
  const [departureCity, setDepartureCity] = useState<string>('');

  const interests: Interest[] = ['adventure', 'beaches', 'culture', 'food', 'nature', 'relaxation'];

  const toggleInterest = (interest: Interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure at least one interest is selected
    if (selectedInterests.length === 0) {
      alert('Please select at least one interest');
      return;
    }
    
    onSubmit({
      budget,
      interests: selectedInterests,
      duration,
      departureCity: departureCity.trim() || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Budget</h3>
        <div className="flex space-x-4">
          {(['low', 'medium', 'high'] as Budget[]).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBudget(b)}
              className={`flex-1 py-3 px-4 rounded-full transition-all ${
                budget === b 
                  ? 'bg-primary text-white' 
                  : 'bg-white border border-gray-300 hover:border-primary'
              }`}
            >
              {b.charAt(0).toUpperCase() + b.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Interests</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {interests.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={`py-3 px-4 rounded-lg transition-all ${
                selectedInterests.includes(interest)
                  ? 'bg-primary text-white'
                  : 'bg-white border border-gray-300 hover:border-primary'
              }`}
            >
              {interest.charAt(0).toUpperCase() + interest.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Duration</h3>
        <div className="flex space-x-4">
          {(['weekend', '1 week', '2 weeks'] as Duration[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDuration(d)}
              className={`flex-1 py-3 px-4 rounded-full transition-all ${
                duration === d
                  ? 'bg-primary text-white'
                  : 'bg-white border border-gray-300 hover:border-primary'
              }`}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Departure City (Optional)</h3>
        <input
          type="text"
          value={departureCity}
          onChange={(e) => setDepartureCity(e.target.value)}
          placeholder="Where are you flying from?"
          className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <motion.button
        type="submit"
        className="w-full py-4 px-6 rounded-lg bg-primary text-white font-semibold text-lg hover:bg-primary-dark transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Show Me A Destination!
      </motion.button>
    </form>
  );
};