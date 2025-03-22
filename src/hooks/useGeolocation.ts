'use client';

import { useState, useEffect } from 'react';
import { Coordinates } from '../types';

export const useGeolocation = () => {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
        setLoading(false);
      },
      (error) => {
        setError(`Unable to get location: ${error.message}`);
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  return { userLocation, loading, error };
};