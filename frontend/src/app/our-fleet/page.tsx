'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

interface Boat {
  id: number;
  name: string;
  type: string;
  length: number;
  capacity: number;
  description: string;
  images: string[];
  pricePerDay: number;
  location: string;
}

const locations = ['All', 'Miami', 'Fort Lauderdale', 'New Jersey', 'Key Largo', 'Connecticut', 'Dominican Republic'];
const boatTypes = ['All', 'Yacht', 'Catamaran', 'Speedboat', 'Sailboat', 'Motor Yacht', 'Fishing Boat', 'Pontoon', 'Jet Ski'];

export default function OurFleet() {
  const [boats, setBoats] = useState<Boat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [minCapacity, setMinCapacity] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchBoats();
  }, [selectedLocation, selectedType, minCapacity, maxPrice]);

  const fetchBoats = async (query: string = '') => {
    try {
      const params: any = {};
      if (query) params.query = query;
      if (selectedLocation && selectedLocation !== 'All') params.location = selectedLocation;
      if (selectedType && selectedType !== 'All') params.type = selectedType;
      if (minCapacity) params.minCapacity = minCapacity;
      if (maxPrice) params.maxPrice = maxPrice;

      const response = await axios.get(`http://localhost:5000/api/boats${query ? '/search' : ''}`, { params });
      setBoats(response.data);
    } catch (error) {
      console.error('Error fetching boats:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBoats(searchQuery);
  };

  const handleCarouselClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-500">
      <main className="flex-grow container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold mb-8">Our Fleet</h1>
        <form onSubmit={handleSearch} className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search boats..."
              className="p-2 border border-black bg-white text-black rounded"
            />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="p-2 border border-black bg-white text-gray rounded"
            >
              <option value="">Select location</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="p-2 border border-black bg-white text-gray rounded"
            >
              <option value="">Select boat type</option>
              {boatTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input
              type="number"
              value={minCapacity}
              onChange={(e) => setMinCapacity(e.target.value)}
              placeholder="Min capacity"
              className="p-2 border border-black bg-white text-gray rounded"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max price per day"
              className="p-2 border border-black bg-white text-gray rounded"
            />
          </div>
          <button type="submit" className="bg-gold text-white px-4 py-2 rounded hover:bg-gold-dark">Search</button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {boats.map((boat) => (
            <div key={boat.id} className="border border-white rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300">
              <div onClick={handleCarouselClick}>
                <Carousel showThumbs={false} showStatus={false}>
                  {boat.images.map((image, index) => (
                    <div key={index}>
                      <img src={image} alt={`${boat.name} - Image ${index + 1}`} className="w-full h-48 object-cover" />
                    </div>
                  ))}
                </Carousel>
              </div>
              <Link href={`/boat/${boat.id}`}>
                <div className="p-4">
                  <h2 className="text-xl text-black font-semibold mb-2">{boat.name}</h2>
                  <p className="text-black mb-2">{boat.type} - {boat.length}ft</p>
                  <p className="text-black mb-2">Location: {boat.location}</p>
                  <p className="text-black mb-2">Capacity: {boat.capacity} people</p>
                  <p className="text-xl font-bold">${boat.pricePerDay} / day</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
