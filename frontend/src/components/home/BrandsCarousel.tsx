import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

interface Brand {
  name: string;
  logo: string;
  description: string;
  year: string;
}

const brands: Brand[] = [
  { 
    name: 'Miami Vice',
    logo: '/images/brands/miamivice.png',
    description: 'Luxury yacht partner since 2015',
    year: 'EST. 2015'
  },
  { 
    name: 'Rolex',
    logo: '/images/brands/rolex.png',
    description: 'Official timekeeper',
    year: 'EST. 1905'
  },
  { 
    name: 'Century',
    logo: '/images/brands/century.png',
    description: 'Premium vessel manufacturer',
    year: 'EST. 1926'
  },
  { 
    name: 'Beneteau',
    logo: '/images/brands/beneteau.png',
    description: 'Exclusive yacht provider',
    year: 'EST. 1884'
  },
  { 
    name: 'Sealine',
    logo: '/images/brands/sealine.png',
    description: 'Luxury marine partner',
    year: 'EST. 1972'
  },
  { 
    name: 'Freedom Boat Club',
    logo: '/images/brands/freedomboatclub.png',
    description: 'Premier boating network',
    year: 'EST. 1989'
  }
];

export default function BrandsCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="relative py-24 bg-gray-50 dark:bg-gray-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/patterns/circuit-board.svg')] opacity-5" />
      
      <motion.div
        style={{ opacity }}
        className="relative"
      >
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="text-[#21336a] dark:text-blue-400 text-sm font-semibold tracking-wider uppercase">
              Our Partners
            </span>
            <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
              Trusted By World-Class Brands
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Partnering with the finest names in luxury yachting
            </p>
          </motion.div>
        </div>

        {/* Brands Carousel - Full Width */}
        <div className="relative w-screen">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-800 z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-800 z-10" />

          {/* First Row */}
          <div className="flex space-x-24 animate-scroll mb-16">
            {[...brands, ...brands].map((brand, index) => (
              <motion.div
                key={`${brand.name}-${index}`}
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 mx-12 group"
              >
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={140}
                  height={90}
                  className="object-contain filter grayscale hover:grayscale-0 
                           transition-all duration-300"
                />
                
                {/* Tooltip */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute mt-2 bg-white dark:bg-gray-700 px-4 py-2 rounded-lg 
                           shadow-lg pointer-events-none text-center transform -translate-x-1/4"
                >
                  <p className="text-sm font-medium text-[#21336a] dark:text-white">
                    {brand.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-300">
                    {brand.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Second Row */}
          <div className="flex space-x-24 animate-scroll-reverse">
            {[...brands.reverse(), ...brands].map((brand, index) => (
              <motion.div
                key={`${brand.name}-reverse-${index}`}
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 mx-12 group"
              >
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={140}
                  height={90}
                  className="object-contain filter grayscale hover:grayscale-0 
                           transition-all duration-300"
                />
                
                {/* Tooltip */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute mt-2 bg-white dark:bg-gray-700 px-4 py-2 rounded-lg 
                           shadow-lg pointer-events-none text-center transform -translate-x-1/4"
                >
                  <p className="text-sm font-medium text-[#21336a] dark:text-white">
                    {brand.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-300">
                    {brand.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
} 