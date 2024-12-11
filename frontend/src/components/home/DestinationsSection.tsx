import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaMapMarkerAlt, FaCalendarAlt, FaCompass } from 'react-icons/fa';

const destinations = [
  {
    name: "Mediterranean",
    location: "Southern Europe",
    image: "/images/destinations/mediterranean.jpg",
    description: "Crystal clear waters and historic coastal towns",
    season: "May - October",
    highlights: ["Greek Islands", "French Riviera", "Amalfi Coast"]
  },
  {
    name: "Caribbean",
    location: "West Indies",
    image: "/images/destinations/caribbean.jpg",
    description: "Paradise islands and tropical adventures",
    season: "November - April",
    highlights: ["British Virgin Islands", "Bahamas", "St. Barts"]
  },
  {
    name: "South Pacific",
    location: "Oceania",
    image: "/images/destinations/pacific.jpg",
    description: "Exotic locations and pristine beaches",
    season: "April - November",
    highlights: ["Fiji", "Bora Bora", "Great Barrier Reef"]
  }
];

export default function DestinationsSection() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold text-[#21336a] mb-6 dark:text-white">
            Popular Destinations
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Explore our curated selection of world-class yachting destinations
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold mb-1">{destination.name}</h3>
                    <div className="flex items-center text-sm">
                      <FaMapMarkerAlt className="mr-2" />
                      {destination.location}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {destination.description}
                  </p>

                  {/* Season Info */}
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <FaCalendarAlt className="mr-2" />
                    Best Season: {destination.season}
                  </div>

                  {/* Highlights */}
                  <div className="space-y-3">
                    <div className="flex items-center text-sm font-medium text-[#21336a] dark:text-white">
                      <FaCompass className="mr-2" />
                      Highlights
                    </div>
                    <ul className="space-y-2">
                      {destination.highlights.map((highlight, i) => (
                        <motion.li
                          key={highlight}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className="flex items-center text-sm text-gray-600 dark:text-gray-300"
                        >
                          <span className="w-1.5 h-1.5 bg-[#21336a] dark:bg-white rounded-full mr-2" />
                          {highlight}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full mt-6 px-6 py-3 bg-[#21336a] text-white rounded-lg 
                             hover:bg-[#2a4086] transition-colors duration-300 
                             dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    Explore Destination
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 