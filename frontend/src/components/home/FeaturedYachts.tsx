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
  price4Hours: number;
  price6Hours: number;
  price8Hours: number;
  type: string;
  rating: number;
  totalBookings: number;
  length: number;
  capacity: number;
  location: string;
  owner: {
    id: number;
    name: string;
    rating: number;
  };
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
        if (response.data && Array.isArray(response.data)) {
          setFeaturedYachts(response.data);
        } else {
          setFeaturedYachts([]);
        }
      } catch (error) {
        console.error('Error fetching featured yachts:', error);
        setFeaturedYachts([]);
        setError('No featured yachts available at the moment.');
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
    <section id="featured-yachts" className={`py-16 bg-white transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-primary text-center mb-12">Featured Yachts</h2>
        {error ? (
          <p className="text-center text-white">{error}</p>
        ) : featuredYachts.length > 0 ? (
          <div 
            ref={scrollContainerRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredYachts.map((yacht) => (
              <div key={yacht.id} className="bg-white shadow-xl rounded-lg overflow-hidden transform transition duration-500 hover:scale-105">
                <div className="relative w-full h-64">
                  <Image
                    src={yacht.images && yacht.images.length > 0 ? yacht.images[0] : '/placeholder-yacht.jpg'}
                    alt={yacht.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{yacht.name}</h3>
                      <p className="text-sm text-gray-500">{yacht.type}</p>
                    </div>
                    <div className="flex items-center bg-gray-100 px-2 py-1 rounded">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-gray-600 font-medium">{Number(yacht.rating).toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="mr-4">{yacht.length}ft</span>
                    <span className="mr-4">Up to {yacht.capacity} guests</span>
                    <span>{yacht.location}</span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{yacht.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">4 Hours</span>
                      <span className="font-semibold text-primary">${yacht.price4Hours}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">6 Hours</span>
                      <span className="font-semibold text-primary">${yacht.price6Hours}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">8 Hours</span>
                      <span className="font-semibold text-primary">${yacht.price8Hours}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{yacht.totalBookings} successful trips</span>
                    </div>
                    {yacht.owner && (
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500">Owner rating: </span>
                        <span className="text-yellow-400 ml-1">★</span>
                        <span className="ml-1 text-gray-600">{Number(yacht.owner.rating).toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  <Link 
                    href={`/boat/${yacht.id}`} 
                    className="block text-center bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-white">No featured yachts available at the moment.</p>
        )}
      </div>
    </section>
  );
}
