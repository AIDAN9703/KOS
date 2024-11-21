'use client'

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface HeroProps {
  toggleDarkMode: () => void;
  darkMode: boolean;
}

export default function HeroSection({ toggleDarkMode, darkMode }: HeroProps) {
  return (
    <section className="relative h-screen">
      <Image
        src="/images/boats/aerial3.jpg"
        alt="Luxury Yacht"
        fill
        className="object-cover brightness-75 transition-all duration-700 dark:brightness-50"
        priority
        quality={100}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#21336a]/90 dark:to-gray-800/90"></div>

      <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg dark:text-white"
        >
          Discover the World
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl mb-8 max-w-2xl font-light tracking-wide dark:text-gray-300"
        >
          Experience luxury yachting like never before
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-x-4"
        >
          <Link
            href="/boats"
            className="bg-white text-[#21336a] px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all text-sm tracking-wider shadow-md hover:shadow-lg dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            EXPLORE OUR FLEET
          </Link>
          <Link
            href="/contact"
            className="bg-transparent text-white px-8 py-3 rounded-full font-semibold border-2 border-white hover:bg-white hover:text-[#21336a] transition-all text-sm tracking-wider shadow-md hover:shadow-lg dark:border-gray-300 dark:hover:bg-gray-300 dark:hover:text-gray-800"
          >
            CONTACT US
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <svg className="w-6 h-6 text-white dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
} 