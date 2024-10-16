'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from '../../components/Navigation';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useParams } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

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

export default function BoatDetails() {
  const [boat, setBoat] = useState<Boat | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    const fetchBoat = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/boats/${id}`);
        setBoat(response.data);
      } catch (error) {
        console.error('Error fetching boat details:', error);
      }
    };

    if (id) {
      fetchBoat();
    }
  }, [id]);

  if (!boat) {
    return <div>Loading...</div>;
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % boat.images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + boat.images.length) % boat.images.length);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navigation />
      <main className="flex-grow container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold mb-8">{boat.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative">
            <div className="relative h-96 overflow-hidden rounded-lg">
              {boat.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${boat.name} - Image ${index + 1}`}
                  className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-4 flex space-x-2 overflow-x-auto">
              {boat.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${boat.name} - Thumbnail ${index + 1}`}
                  className={`h-20 w-20 object-cover cursor-pointer rounded-md ${
                    index === currentSlide ? 'border-2 border-gold' : ''
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Specifications</h2>
            <p className="mb-2"><strong>Type:</strong> {boat.type}</p>
            <p className="mb-2"><strong>Length:</strong> {boat.length} ft</p>
            <p className="mb-2"><strong>Capacity:</strong> {boat.capacity} people</p>
            <p className="mb-2"><strong>Location:</strong> {boat.location}</p>
            <p className="mb-2"><strong>Price:</strong> ${boat.pricePerDay} / day</p>
            <h2 className="text-2xl font-semibold mt-6 mb-4">Description</h2>
            <p>{boat.description}</p>
          </div>
        </div>
      </main>
    </div>
  );
}