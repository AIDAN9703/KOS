'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '@/components/boats/SearchBar';
import FilterSidebar from '@/components/boats/FilterSidebar';
import BoatGrid from '@/components/boats/BoatGrid';
import { Boat, BoatFeature } from '@/types/types';

export default function OurFleet() {
  const searchParams = useSearchParams();
  const [boats, setBoats] = useState<Boat[]>([]);
  const [features, setFeatures] = useState<BoatFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  useEffect(() => {
    // Fetch initial data (features, price range)
    fetchInitialData();
  }, []);

  useEffect(() => {
    // Fetch boats based on search params
    fetchBoats();
  }, [searchParams]);

  const fetchInitialData = async () => {
    try {
      const [featuresRes, priceRangeRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/features`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/boats/price-range`)
      ]);

      const [featuresData, priceRangeData] = await Promise.all([
        featuresRes.json(),
        priceRangeRes.json()
      ]);

      setFeatures(featuresData);
      setPriceRange([priceRangeData.min, priceRangeData.max]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchBoats = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/boats/search?${searchParams.toString()}`
      );
      const data = await response.json();
      setBoats(data);
    } catch (error) {
      console.error('Error fetching boats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <div className="bg-[#21336a] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">Our Fleet</h1>
          <p className="text-xl mb-8 text-gray-200">
            Discover our collection of premium yachts and boats
          </p>
          <SearchBar />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                features={features}
                priceRange={priceRange}
                onFilterChange={fetchBoats}
              />
            </div>
          </div>
          
          {/* Results */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {boats.length} boats available
              </h2>
              <select 
                className="border rounded-lg px-4 py-2"
                onChange={(e) => {
                  // Handle sorting
                }}
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
            <BoatGrid boats={boats} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
