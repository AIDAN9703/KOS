'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { FeaturedBoat } from '@/types/types';
import { FiAnchor, FiUsers, FiNavigation, FiClock, FiArrowRight } from 'react-icons/fi';

export default function FeaturedYachts() {
  const [featuredYachts, setFeaturedYachts] = useState<FeaturedBoat[]>([]);
  const [activeYacht, setActiveYacht] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedYachts = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get<FeaturedBoat[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/boats/featured`
        );
        
        const featuredData = data.map(boat => ({
          ...boat,
          image: boat.images[0]
        }));

        setFeaturedYachts(featuredData);
      } catch (error) {
        console.error('Failed to fetch featured yachts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedYachts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="animate-pulse">
          <FiAnchor className="w-12 h-12 text-[#21336a]" />
        </div>
      </div>
    );
  }

  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white"
          >
            Featured <span className="text-[#21336a] dark:text-blue-400">Yachts</span>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {featuredYachts.map((yacht, index) => (
            <motion.div
              key={yacht.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="group relative"
            >
              {/* Image Container */}
              <div className="relative h-[500px] rounded-2xl overflow-hidden">
                <Image
                  src={yacht.image}
                  alt={yacht.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="text-3xl font-bold text-white mb-4">
                    {yacht.name}
                  </h3>
                  
                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-white/90">
                      <FiNavigation className="w-5 h-5 mr-2" />
                      <span>{yacht.length}</span>
                    </div>
                    <div className="flex items-center text-white/90">
                      <FiUsers className="w-5 h-5 mr-2" />
                      <span>{yacht.capacity} Guests</span>
                    </div>
                    <div className="flex items-center text-white/90">
                      <FiClock className="w-5 h-5 mr-2" />
                      {/* <span>{yacht.boatPrice.hours}h</span> */}
                    </div>
                    <div className="flex items-center text-white/90">
                     {/* <span className="font-semibold">${yacht.boatPrice.price}/day</span> */}
                    </div>
                  </div>

                  {/* Features Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {yacht.features?.slice(0, 3).map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full 
                                 text-sm text-white/90"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={`/boats/${yacht.id}`}
                    className="inline-flex items-center justify-between px-6 py-3 
                             bg-white/10 backdrop-blur-sm rounded-lg text-white 
                             group-hover:bg-[#21336a] transition-all duration-300"
                  >
                    <span>View Details</span>
                    <FiArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mt-12"
        >
          <Link
            href="/our-fleet"
            className="inline-flex items-center px-8 py-4 bg-[#21336a] text-white 
                     rounded-lg hover:bg-[#2a4086] transition-all duration-300 
                     transform hover:-translate-y-1"
          >
            <span className="mr-2">View All Yachts</span>
            <FiArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
