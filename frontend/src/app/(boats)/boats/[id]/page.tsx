'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import PricingCalendar from '@/components/boats/PricingCalendar';
import FeatureList from '@/components/boats/FeatureList';
import BookingForm from '@/components/boats/BookingForm';
import toast from 'react-hot-toast';
import { bookingApi } from '@/services/api';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';

interface Boat {
  id: number;
  name: string;
  description: string;
  length: string;
  capacity: number;
  basePrice: number;
  location: string;
  images: string[];
  features: Array<{
    id: number;
    name: string;
    category: string;
    icon: string;
  }>;
  amenities: string[];
}

export default function BoatDetailPage() {
  const { id } = useParams();
  const [boat, setBoat] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [selectedPriceId, setSelectedPriceId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchBoatDetails();
    }
  }, [id]);

  const fetchBoatDetails = async () => {
    try {
      const { data } = await bookingApi.getBoatDetails(Number(id));
      setBoat(data);
    } catch (error) {
      toast.error('Error loading boat details');
      console.error('Error fetching boat details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceSelect = (price: number) => {
    setSelectedPrice(price);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#21336a]"></div>
    </div>
  );
  
  if (!boat) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-2xl text-gray-600">Boat not found</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[50vh] w-full">
        <Image
          src={boat.images[0]}
          alt={boat.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{boat.name}</h1>
            <div className="flex items-center space-x-4 text-lg">
              <span className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {boat.location}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Up to {boat.capacity} guests
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Details and Features */}
          <div className="lg:col-span-2 space-y-12">
            {/* Image Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {boat.images.slice(1, 5).map((image: string, index: number) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden hover:opacity-90 transition-opacity">
                  <Image
                    src={image}
                    alt={`${boat.name} - Image ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Boat</h2>
              <p className="text-gray-600 leading-relaxed">{boat.description}</p>
            </div>

            {/* Quick Facts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="text-[#21336a] mb-2">
                  <svg className="h-6 w-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Length</h3>
                <p className="text-gray-600">{boat.length}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="text-[#21336a] mb-2">
                  <svg className="h-6 w-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Capacity</h3>
                <p className="text-gray-600">{boat.capacity} people</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="text-[#21336a] mb-2">
                  <svg className="h-6 w-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Location</h3>
                <p className="text-gray-600">{boat.location}</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="text-[#21336a] mb-2">
                  <svg className="h-6 w-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Base Price</h3>
                <p className="text-gray-600">${boat.basePrice}/hour</p>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Features & Amenities</h2>
              <FeatureList 
                features={boat.features} 
                amenities={boat.amenities}
              />
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900">Book This Boat</h2>
                  <p className="text-gray-600 mt-2">Select your dates and duration</p>
                </div>
                
                <div className="p-6">
                  {user ? (
                    <>
                      <PricingCalendar
                        boatId={boat.id}
                        onDateSelect={setSelectedDate}
                        onDurationSelect={setSelectedDuration}
                        onPriceSelect={setSelectedPrice}
                        onPriceOptionSelect={setSelectedPriceId}
                      />
                      {selectedDate && selectedDuration && selectedPrice && selectedPriceId && (
                        <BookingForm
                          boatId={boat.id}
                          selectedDate={selectedDate}
                          selectedDuration={selectedDuration}
                          totalPrice={selectedPrice}
                          selectedPriceId={selectedPriceId}
                        />
                      )}
                    </>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-6 text-center">
                      <h3 className="text-lg font-semibold mb-2">Login Required</h3>
                      <p className="text-gray-600 mb-4">
                        Please log in or create an account to book this boat.
                      </p>
                      <Link
                        href="/login"
                        className="inline-block bg-[#21336a] text-white px-6 py-3 rounded-lg hover:bg-[#2a4086] transition-colors"
                      >
                        Log In to Book
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 