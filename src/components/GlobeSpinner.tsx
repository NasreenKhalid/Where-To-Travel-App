// src/components/GlobeSpinner.tsx
'use client';

import React from 'react';

interface GlobeSpinnerProps {
  message?: string;
}

export const GlobeSpinner: React.FC<GlobeSpinnerProps> = ({ 
  message = "Exploring destinations for you..." 
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div 
        style={{ 
          marginBottom: '1rem',
          animation: 'spin 3s linear infinite'
        }}
      >
        <svg 
          width="64" 
          height="64" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#4F46E5"
          strokeWidth="1" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          <path d="M2 12h20"></path>
          <path d="M12 2v20"></path>
        </svg>
      </div>
      <p style={{ textAlign: 'center', color: '#4B5563' }}>{message}</p>
    </div>
  );
};