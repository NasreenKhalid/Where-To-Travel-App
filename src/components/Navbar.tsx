'use client';

// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';

export const Navbar: React.FC = () => {
  const forceReload = () => {
    window.location.replace('/');
  };
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <button 
          onClick={forceReload}
          className="text-2xl font-bold text-primary flex items-center border-0 bg-transparent"
        >
          <span className="mr-2">✈️</span>
          <span>Where To?</span>
        </button>
        
        <nav>
          <ul className="flex space-x-6">
            <li>
              <button 
                onClick={forceReload}
                className="text-gray-600 hover:text-primary transition-colors border-0 bg-transparent"
              >
                Home
              </button>
            </li>
            <li>
              <button 
                onClick={forceReload}
                className="text-gray-600 hover:text-primary transition-colors border-0 bg-transparent"
              >
                New Search
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};