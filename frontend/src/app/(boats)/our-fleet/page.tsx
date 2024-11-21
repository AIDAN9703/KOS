'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Boat {
  id: number;
  name: string;
  type: string;
  length: string;
  capacity: number;
  location: string;
  images: string[];
  prices: Array<{
    hours: number;
    price: number;
    description: string;
  }>;
}

export default function OurFleet() {
  const [boats, setBoats] = useState<Boat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoats();
  }, []);

  const fetchBoats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/boats`);
      const data = await response.json();
      setBoats(data);
    } catch (error) {
      console.error('Error fetching boats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLowestPrice = (prices: Boat['prices']) => {
    if (!prices || prices.length === 0) return null;
    return Math.min(...prices.map(p => p.price));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#21336a]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Fleet</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {boats.map((boat) => (
          <Link href={`/boats/${boat.id}`} key={boat.id}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-64">
                <Image
                  src={boat.images[0] || '/images/boats/yacht1.jpg'}
                  alt={boat.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{boat.name}</h2>
                <div className="space-y-2 text-gray-600">
                  <p>Type: {boat.type}</p>
                  <p>Length: {boat.length}</p>
                  <p>Capacity: {boat.capacity} people</p>
                  <p>Location: {boat.location}</p>
                  {getLowestPrice(boat.prices) && (
                    <p className="text-[#21336a] font-semibold">
                      Starting at ${getLowestPrice(boat.prices)}
                    </p>
                  )}
                </div>
                
                <button className="mt-4 w-full bg-[#21336a] text-white py-2 px-4 rounded-lg hover:bg-[#2a4086] transition-colors duration-200">
                  View Details
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
