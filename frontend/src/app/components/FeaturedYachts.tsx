'use client'

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

interface Yacht {
  id: number;
  name: string;
  images: string[];
  description: string;
  pricePerDay: number;
}

export default function FeaturedYachts() {
  const [isVisible, setIsVisible] = useState(false);
  const [featuredYachts, setFeaturedYachts] = useState<Yacht[]>([]);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFeaturedYachts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/boats/featured');
        setFeaturedYachts(response.data);
      } catch (error) {
        console.error('Error fetching featured yachts:', error);
        setError('Failed to load featured yachts. Please try again later.');
      }
    };

    fetchFeaturedYachts();

    const handleScroll = () => {
      const element = document.getElementById('featured-yachts');
      if (element) {
        const rect = element.getBoundingClientRect();
        setIsVisible(rect.top < window.innerHeight && rect.bottom >= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="featured-yachts" className={`py-16 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Featured Yachts</h2>
        {error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : featuredYachts.length > 0 ? (
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-4 space-x-6 scrollbar-hide"
          >
            {featuredYachts.map((yacht) => (
              <div key={yacht.id} className="flex-shrink-0 w-80 bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="relative w-full h-64">
                  <Image
                    src={yacht.images && yacht.images.length > 0 ? yacht.images[0] : '/placeholder-yacht.jpg'}
                    alt={yacht.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{yacht.name}</h3>
                  <p className="text-gray-600 mb-4">{yacht.description}</p>
                  <p className="text-gold font-bold mb-4">${yacht.pricePerDay} / day</p>
                  <Link href={`/yacht/${yacht.id}`} className="bg-gold text-white px-4 py-2 rounded hover:bg-gold-dark transition duration-300">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No featured yachts available at the moment.</p>
        )}
      </div>
    </section>
  );
}
