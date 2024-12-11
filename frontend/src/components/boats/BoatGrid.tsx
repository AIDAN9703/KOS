import { Boat } from '@/types/types';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiUsers, FiMapPin, FiAnchor } from 'react-icons/fi';

interface BoatGridProps {
  boats: Boat[];
  loading: boolean;
}

export default function BoatGrid({ boats, loading }: BoatGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-64 rounded-lg mb-4" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {boats.map((boat) => (
        <motion.div
          key={boat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href={`/boats/${boat.id}`}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-64">
                <Image
                  src={boat.images[0] || '/images/placeholder.jpg'}
                  alt={boat.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{boat.name}</h2>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center">
                    <FiMapPin className="mr-2" />
                    {boat.location}
                  </div>
                  <div className="flex items-center">
                    <FiUsers className="mr-2" />
                    {boat.capacity} guests
                  </div>
                  <div className="flex items-center">
                    <FiAnchor className="mr-2" />
                    {boat.length}
                  </div>
                </div>
                
                {boat.boatPrices && boat.boatPrices.length > 0 && (
                  <div className="mt-4 text-[#21336a] font-semibold">
                    From ${Math.min(...boat.boatPrices.map(p => p.price))}/hour
                  </div>
                )}
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
} 