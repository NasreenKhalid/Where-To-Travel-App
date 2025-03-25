'use client';


// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';

import React, { useState } from 'react';
import Link from 'next/link';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-transparent py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-1 cursor-pointer">
  <h1 className="text-2xl font-bold">WHERE TO</h1>
  <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded">TRAVEL ADVISOR</span>
</Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-blue-300 transition-colors">
              Home
            </Link>
            <Link href="/destinations" className="text-white hover:text-blue-300 transition-colors">
              Top Destinations
            </Link>
            <Link href="/about" className="text-white hover:text-blue-300 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-white hover:text-blue-300 transition-colors">
              Contact
            </Link>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors">
              My Trips
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-black bg-opacity-80 p-4 rounded-lg">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="text-white hover:text-blue-300 transition-colors">
                Home
              </Link>
              <Link href="/destinations" className="text-white hover:text-blue-300 transition-colors">
                Top Destinations
              </Link>
              <Link href="/about" className="text-white hover:text-blue-300 transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-white hover:text-blue-300 transition-colors">
                Contact
              </Link>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors">
                My Trips
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};