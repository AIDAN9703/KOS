'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiUsers, FiMapPin, FiSearch } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Image from 'next/image';

interface HeroSectionProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function HeroSection({ darkMode, toggleDarkMode }: HeroSectionProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const popularLocations = [
    "Miami, FL", "San Diego, CA", "Newport, RI", "Seattle, WA"
  ];

  const handleSearch = () => {
    const guestsNumber = guests ? parseInt(guests) : 0;
    console.log({ startDate, guests: guestsNumber, location });
  };

  return (
    <div className="relative min-h-screen pt-10">
      <div className="absolute inset-0 scale-105 animate-kenburns">
        <Image 
          src="/images/boats/catamaran2.jpg" 
          alt="Hero Background" 
          fill className="object-cover" />
      </div>

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-20 min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-4"
          >
            <span className="block text-white/90 text-xl font-light tracking-wider">
              WELCOME TO KOS YACHTS
            </span>
            <h1 className="text-4xl md:text-7xl font-bold text-white tracking-wide leading-tight">
              <span className="block mb-2 font-serif">The World's Leading</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/80">
                Yacht Loyalty Club
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-xl text-gray-200/90 font-light max-w-2xl mx-auto leading-relaxed"
          >
            Discover unparalleled luxury and adventure with our premium yacht charter services.
            Your journey to extraordinary experiences begins here.
          </motion.p>
        </div>

        <div className="w-full max-w-4xl relative z-30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">When</label>
                  <div className="relative">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      dateFormat="MM/dd/yyyy"
                      minDate={new Date()}
                      placeholderText="Select date"
                      className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-[#21336a] 
                               transition-colors duration-200 outline-none"
                      wrapperClassName="z-50"
                    />
                    <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                  <input
                    type="text"
                    value={guests}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d+$/.test(value)) {
                        setGuests(value);
                      }
                    }}
                    placeholder="Number of guests"
                    className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-[#21336a] 
                             transition-colors duration-200 outline-none"
                  />
                  <FiUsers className="absolute right-3 top-[38px] text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                      placeholder="Where to?"
                      className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-[#21336a] 
                               transition-colors duration-200 outline-none"
                    />
                    <FiMapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>

                  <AnimatePresence>
                    {isSearchFocused && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl 
                                 border border-gray-100 overflow-hidden z-50"
                        style={{ zIndex: 9999 }}
                      >
                        {popularLocations.map((loc) => (
                          <motion.button
                            key={loc}
                            whileHover={{ backgroundColor: '#f3f4f6' }}
                            onClick={() => setLocation(loc)}
                            className="w-full px-4 py-2 text-left text-gray-700 hover:text-[#21336a] 
                                     transition-colors duration-200"
                          >
                            {loc}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearch}
                  className="h-[46px] mt-auto bg-[#21336a] text-white rounded-lg px-6 py-3 
                           hover:bg-[#2a4086] transition-colors duration-300 flex items-center 
                           justify-center space-x-2"
                >
                  <FiSearch className="w-5 h-5" />
                  <span>Search</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative z-10 mt-6 flex flex-wrap justify-center gap-3"
        >
          {['Luxury Yachts', 'Sailing Boats', 'Catamarans', 'Day Trips'].map((term, index) => (
            <motion.button
              key={term}
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: 0.8 + index * 0.1 }
              }}
              className="px-6 py-2 rounded-full border border-white/30 text-white/90 
                       backdrop-blur-md text-sm hover:border-white/50 transition-all duration-300
                       shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
            >
              {term}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
} 