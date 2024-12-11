import { Boat } from '@/types/types';
import Image from 'next/image';
import { useState } from 'react';
import { 
  FiUsers, FiCalendar, FiAnchor, FiMapPin, 
  FiClock, FiInfo, FiShield, FiAward,
  FiNavigation, FiDroplet, FiTool, FiWind 
} from 'react-icons/fi';

interface BoatDetailsProps {
  boat: Boat;
}

export default function BoatDetails({ boat }: BoatDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-8">
      {/* Image Gallery */}
      <div className="space-y-4">
        <div className="relative h-[500px] rounded-xl overflow-hidden">
          <Image
            src={boat.images[selectedImage] || '/images/placeholder.jpg'}
            alt={boat.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {boat.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative h-24 rounded-lg overflow-hidden transition-all ${
                selectedImage === index ? 'ring-2 ring-[#21336a]' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={image}
                alt={`${boat.name} view ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Basic Info */}
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{boat.name}</h1>
            <p className="text-lg text-gray-600">{boat.make} {boat.model} {boat.year}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#21336a]">${boat.basePrice}/hour</p>
            <p className="text-sm text-gray-500">Plus applicable fees</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <FiMapPin className="text-[#21336a] text-xl" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{boat.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FiUsers className="text-[#21336a] text-xl" />
            <div>
              <p className="text-sm text-gray-500">Capacity</p>
              <p className="font-medium">{boat.capacity} guests</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FiAnchor className="text-[#21336a] text-xl" />
            <div>
              <p className="text-sm text-gray-500">Length</p>
              <p className="font-medium">{boat.length}ft</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FiClock className="text-[#21336a] text-xl" />
            <div>
              <p className="text-sm text-gray-500">Min. Duration</p>
              <p className="font-medium">{boat.minimumNotice || 4} hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="prose max-w-none">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <FiInfo className="text-[#21336a]" />
          About this boat
        </h2>
        <p className="text-gray-600 leading-relaxed">{boat.description}</p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Specifications */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FiTool className="text-[#21336a]" />
            Specifications
          </h2>
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            {boat.engineCount && (
              <div>
                <dt className="text-gray-500">Engines</dt>
                <dd className="font-medium">{boat.engineCount}x {boat.enginePower}</dd>
              </div>
            )}
            {boat.fuelType && (
              <div>
                <dt className="text-gray-500">Fuel Type</dt>
                <dd className="font-medium">{boat.fuelType}</dd>
              </div>
            )}
            {boat.cruisingSpeed && (
              <div>
                <dt className="text-gray-500">Cruising Speed</dt>
                <dd className="font-medium">{boat.cruisingSpeed} knots</dd>
              </div>
            )}
            {boat.maxSpeed && (
              <div>
                <dt className="text-gray-500">Max Speed</dt>
                <dd className="font-medium">{boat.maxSpeed} knots</dd>
              </div>
            )}
            {boat.sleeps && (
              <div>
                <dt className="text-gray-500">Sleeps</dt>
                <dd className="font-medium">{boat.sleeps} guests</dd>
              </div>
            )}
            {boat.bathrooms && (
              <div>
                <dt className="text-gray-500">Bathrooms</dt>
                <dd className="font-medium">{boat.bathrooms}</dd>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FiAward className="text-[#21336a]" />
            Features
          </h2>
          <div className="grid grid-cols-2 gap-y-3 bg-gray-50 p-4 rounded-lg">
            {boat.features.map((feature) => (
              <div key={feature.id} className="flex items-center gap-2">
                {feature.icon && <span className="text-[#21336a]">{feature.icon}</span>}
                <span className="font-medium">{feature.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rules and Policies */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <FiShield className="text-[#21336a]" />
          Rules and Policies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Cancellation Policy</h3>
            <p className="text-gray-600">{boat.cancellationPolicy}</p>
          </div>
          {boat.rules.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Boat Rules</h3>
              <ul className="space-y-2">
                {boat.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[#21336a] mt-1">•</span>
                    <span className="text-gray-600">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Allowed Activities */}
      {boat.allowedActivities.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FiNavigation className="text-[#21336a]" />
            Allowed Activities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {boat.allowedActivities.map((activity, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
                <span className="text-[#21336a]">•</span>
                <span>{activity}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 