import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiDollarSign, FiUsers, FiAnchor } from 'react-icons/fi';
import { BoatFeature, BoatStatus, CancellationPolicy } from '@/types/types';

interface FilterSidebarProps {
  features: BoatFeature[];
  priceRange: [number, number];
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  priceRange: [number, number];
  features: Set<number>;
  boatTypes: Set<string>;
  rating: number | null;
  hasCaptain: boolean;
  capacity: [number, number];
  amenities: Set<string>;
  length: [number, number];
  status: BoatStatus;
  cancellationPolicy: CancellationPolicy | null;
}

export default function FilterSidebar({ features, priceRange, onFilterChange }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<FilterState>({
    priceRange: priceRange,
    features: new Set<number>(),
    boatTypes: new Set<string>(['YACHT', 'SAILBOAT', 'CATAMARAN', 'PONTOON']),
    rating: null,
    hasCaptain: false,
    capacity: [0, 50],
    amenities: new Set<string>(),
    length: [0, 200],
    status: BoatStatus.ACTIVE,
    cancellationPolicy: null
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value instanceof Set) {
        params.delete(key);
        Array.from(value).forEach(v => params.append(key, v.toString()));
      } else if (Array.isArray(value)) {
        params.set(key, value.join(','));
      } else if (value !== null) {
        params.set(key, value.toString());
      }
    });

    router.push(`?${params.toString()}`, { scroll: false });
    onFilterChange(filters);
  }, [filters]);

  const handleFeatureToggle = (featureId: number) => {
    const newFeatures = new Set(filters.features);
    if (newFeatures.has(featureId)) {
      newFeatures.delete(featureId);
    } else {
      newFeatures.add(featureId);
    }
    setFilters(prev => ({ ...prev, features: newFeatures }));
  };

  return (
    <div className="w-64 bg-white p-4 rounded-lg shadow-lg space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center">
          <FiDollarSign className="mr-2" />
          Price Range
        </h3>
        <div className="space-y-2">
          <input
            type="range"
            min={priceRange[0]}
            max={priceRange[1]}
            value={filters.priceRange[1]}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              priceRange: [prev.priceRange[0], parseInt(e.target.value)]
            }))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Boat Types */}
      <div>
        <h3 className="font-semibold mb-3">Boat Types</h3>
        {Array.from(filters.boatTypes).map(type => (
          <label key={type} className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={filters.boatTypes.has(type)}
              onChange={() => {
                const newTypes = new Set(filters.boatTypes);
                if (newTypes.has(type)) {
                  newTypes.delete(type);
                } else {
                  newTypes.add(type);
                }
                setFilters(prev => ({ ...prev, boatTypes: newTypes }));
              }}
              className="rounded text-[#21336a]"
            />
            <span>{type}</span>
          </label>
        ))}
      </div>

      {/* Features */}
      <div>
        <h3 className="font-semibold mb-3">Features</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {features.map(feature => (
            <label key={feature.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.features.has(feature.id)}
                onChange={() => handleFeatureToggle(feature.id)}
                className="rounded text-[#21336a]"
              />
              <span>{feature.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Capacity */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center">
          <FiUsers className="mr-2" />
          Capacity
        </h3>
        <input
          type="number"
          min="0"
          max="50"
          value={filters.capacity[1]}
          onChange={(e) => setFilters(prev => ({
            ...prev,
            capacity: [0, parseInt(e.target.value)]
          }))}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Reset Filters */}
      <button
        onClick={() => setFilters({
          priceRange,
          features: new Set(),
          boatTypes: new Set(['YACHT', 'SAILBOAT', 'CATAMARAN', 'PONTOON']),
          rating: null,
          hasCaptain: false,
          capacity: [0, 50],
          amenities: new Set(),
          length: [0, 200],
          status: BoatStatus.ACTIVE,
          cancellationPolicy: null
        })}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
} 