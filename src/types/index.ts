// User preference types
export type Budget = 'low' | 'medium' | 'high';
export type Interest = 'adventure' | 'beaches' | 'culture' | 'food' | 'nature' | 'relaxation';
export type Duration = 'weekend' | '1 week' | '2 weeks';

export interface UserPreferences {
  budget: Budget;
  interests: Interest[];
  duration: Duration;
  departureCity?: string;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

// Destination types
export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  imageUrl: string;
  bestTimeToVisit: string;
  budget: {
    low: { min: number; max: number; currency: string };
    medium: { min: number; max: number; currency: string };
    high: { min: number; max: number; currency: string };
  };
  interests: Interest[];
  topAttractions: {
    name: string;
    description: string;
    imageUrl: string;
  }[];
  flightLink?: string;
  hotelLink?: string;
  tourLink?: string;
  coordinates: Coordinates;
}