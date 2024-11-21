'use client'

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';

// Data Arrays
const features = [
  {
    icon: '⚓',
    title: 'Premium Fleet',
    description: 'Access to an exclusive collection of luxury yachts'
  },
  {
    icon: '🌟',
    title: 'Concierge Service',
    description: 'Personalized attention to every detail of your journey'
  },
  {
    icon: '🎯',
    title: 'Expert Crew',
    description: 'Professional and experienced crew members'
  }
];

const trustedBrands = [
  { name: 'Miami Vice', logo: '/images/brands/miamivice.png' },
  { name: 'Rolex', logo: '/images/brands/rolex.png' },
  { name: 'Century', logo: '/images/brands/century.png' },
  { name: 'Beneteau', logo: '/images/brands/beneteau.png' },
  { name: 'Sealine', logo: '/images/brands/sealine.png' },
  { name: 'Freedom Boat Club', logo: '/images/brands/freedomboatclub.png' },
];

const testimonials = [
  {
    quote: "An unforgettable experience that exceeded all expectations. The service was impeccable.",
    author: "James Hamilton",
    title: "CEO, Hamilton Industries",
    image: "/images/testimonials/1.jpg"
  },
  {
    quote: "KOS Yachts provided the perfect blend of luxury and adventure. Simply outstanding.",
    author: "Sarah Mitchell",
    title: "Travel Enthusiast",
    image: "/images/testimonials/2.jpg"
  },
  {
    quote: "The attention to detail and personalized service made our journey truly special.",
    author: "Michael Chen",
    title: "Executive Director",
    image: "/images/testimonials/3.jpg"
  }
];

const destinations = [
  {
    name: "Mediterranean",
    image: "/images/boats/beach.jpg",
    description: "Crystal clear waters and historic coastal towns"
  },
  {
    name: "Caribbean",
    image: "/images/boats/beach.jpg",
    description: "Paradise islands and tropical adventures"
  },
  {
    name: "South Pacific",
    image: "/images/boats/beach.jpg",
    description: "Exotic locations and pristine beaches"
  }
];

const featuredYachts = [
  {
    id: 1,
    name: "Ocean Paradise",
    length: "55m",
    guests: 12,
    price: "€275,000/week",
    image: "/images/boats/yacht1.jpg",
    features: ["5 Cabins", "Jacuzzi", "Beach Club", "Gym"]
  },
  {
    id: 2,
    name: "Azure Dreams",
    length: "47m",
    guests: 10,
    price: "€195,000/week",
    image: "/images/boats/yacht2.jpg",
    features: ["4 Cabins", "Swimming Pool", "Cinema", "Water Toys"]
  },
  {
    id: 3,
    name: "Royal Odyssey",
    length: "62m",
    guests: 14,
    price: "€350,000/week",
    image: "/images/boats/yacht3.jpg",
    features: ["6 Cabins", "Helipad", "Spa", "Beach Club"]
  }
];

export default function HomePageClient() {
  const [activeYacht, setActiveYacht] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Initialize Dark Mode based on localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  // Apply or remove 'dark' class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Persist preference
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Auto-advance carousel unless hovering
  useEffect(() => {
    if (!isHovering) {
      const timer = setInterval(() => {
        setActiveYacht((prev) => (prev + 1) % featuredYachts.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isHovering]);

  // Back to Top button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle Dark Mode Handler
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans transition-colors duration-500">
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-4 left-4 bg-[#21336a] text-white p-2 rounded-full shadow-md hover:bg-[#2a4086] transition-colors duration-300 z-50 dark:bg-gray-700 dark:hover:bg-gray-600"
        aria-label="Toggle Dark Mode"
      >
        {darkMode ? (
          // Sun Icon
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.485-8.485h-1M4.515 12.515h-1m15.364 4.95l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
          </svg>
        ) : (
          // Moon Icon
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
          </svg>
        )}
      </button>

      {/* Hero Section */}
      <HeroSection toggleDarkMode={toggleDarkMode} darkMode={darkMode} />

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-4xl font-bold text-[#21336a] mb-6 dark:text-white">
            Crafting Unforgettable Voyages
          </h2>
          <div className="grid md:grid-cols-3 gap-12 mt-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center p-8 rounded-2xl hover:shadow-2xl transition-shadow duration-300 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 group"
              >
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300 text-[#21336a] dark:text-[#a0aec0]">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-[#21336a] mb-2 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Brands Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-2xl font-bold text-[#21336a] mb-12 dark:text-white">
            Trusted By World-Class Brands
          </h2>
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll loop">
              {[...trustedBrands, ...trustedBrands].map((brand, index) => (
                <div 
                  key={`${brand.name}-${index}`}
                  className="flex-shrink-0 mx-12 grayscale hover:grayscale-0 transition-all duration-300 dark:grayscale-0"
                >
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={140}
                    height={90}
                    className="object-contain justify-center items-center"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Yachts Carousel */}
      <section className="py-24 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-[#21336a] mb-16 text-center dark:text-white">
            Featured Yachts
          </h2>
          <div 
            className="relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeYacht}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-2 gap-12 items-center"
              >
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-[#21336a] dark:text-white">
                    {featuredYachts[activeYacht].name}
                  </h3>
                  <div className="flex space-x-8 text-gray-600 dark:text-gray-300">
                    <div>
                      <p className="text-sm font-semibold">Length</p>
                      <p className="text-lg">{featuredYachts[activeYacht].length}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Guests</p>
                      <p className="text-lg">{featuredYachts[activeYacht].guests}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Price</p>
                      <p className="text-lg">{featuredYachts[activeYacht].price}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {featuredYachts[activeYacht].features.map((feature) => (
                      <span 
                        key={feature}
                        className="px-5 py-2 bg-gray-100 rounded-full text-sm text-[#21336a] shadow-sm dark:bg-gray-700 dark:text-gray-200"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/boats/${featuredYachts[activeYacht].id}`}
                    className="inline-block bg-[#21336a] text-white px-10 py-4 rounded-lg hover:bg-[#2a4086] transition-colors shadow-md hover:shadow-lg dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    View Details
                  </Link>
                </div>
                <div className="relative h-[600px] rounded-2xl overflow-hidden group">
                  <Image
                    src={featuredYachts[activeYacht].image}
                    alt={featuredYachts[activeYacht].name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent dark:from-gray-800/30"></div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {featuredYachts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveYacht(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    activeYacht === index ? 'bg-[#21336a] w-6 dark:bg-gray-300' : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Arrow Controls */}
            <button
              onClick={() => setActiveYacht((prev) => (prev - 1 + featuredYachts.length) % featuredYachts.length)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-3 rounded-full hover:bg-white transition-all duration-300 shadow-md hover:shadow-lg dark:bg-gray-700 dark:hover:bg-gray-600 z-10"
              aria-label="Previous yacht"
            >
              <svg className="w-6 h-6 text-[#21336a] dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setActiveYacht((prev) => (prev + 1) % featuredYachts.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-3 rounded-full hover:bg-white transition-all duration-300 shadow-md hover:shadow-lg dark:bg-gray-700 dark:hover:bg-gray-600 z-10"
              aria-label="Next yacht"
            >
              <svg className="w-6 h-6 text-[#21336a] dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="relative py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative h-[600px]">
              <Image
                src="/images/boats/beach.jpg"
                alt="Luxury Experience"
                fill
                className="object-cover rounded-2xl shadow-2xl transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#21336a]/30 rounded-2xl dark:bg-gradient-to-t dark:from-gray-800/30"></div>
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-[#21336a] dark:text-white">
                Discover the KOS Difference
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed dark:text-gray-300">
                From personalized itineraries to world-class service, every aspect
                of your journey is crafted to exceed expectations. Experience the
                freedom of luxury yachting with KOS.
              </p>
              <ul className="space-y-6">
                {[
                  'Customized itineraries tailored to your preferences',
                  'Professional crew with extensive maritime experience',
                  'Premium amenities and five-star service onboard',
                  'Access to exclusive ports and destinations'
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-center space-x-3 text-gray-700 dark:text-gray-300"
                  >
                    <svg className="h-6 w-6 text-[#21336a] flex-shrink-0 dark:text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-[#21336a] text-white p-3 rounded-full shadow-md hover:bg-[#2a4086] transition-colors duration-300 z-50 dark:bg-gray-700 dark:hover:bg-gray-600"
          aria-label="Back to Top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  );
} 