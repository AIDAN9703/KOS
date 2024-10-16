'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative h-screen flex items-center justify-center text-white overflow-hidden">
      <video
        src="/background.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className={`relative z-10 text-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Experience Luxury on the Water</h1>
        <p className="text-xl md:text-2xl mb-8">Discover our fleet of premium yachts for unforgettable journeys</p>
        <Link href="/our-fleet" className="bg-gold text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-gold-dark transition duration-300">
          Explore Our Fleet
        </Link>
      </div>
    </div>
  );
}
