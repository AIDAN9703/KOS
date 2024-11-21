'use client';

import React from 'react';

interface Feature {
  id: number;
  name: string;
  category: string;
  icon: string;
}

interface FeatureListProps {
  features: Feature[];
  amenities?: string[];
}

export default function FeatureList({ features = [], amenities = [] }: FeatureListProps) {
  // Group features by category
  const groupedFeatures = features.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, Feature[]>);

  return (
    <div className="mt-4 space-y-6">
      {/* Display Features */}
      {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize">
            {category}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categoryFeatures.map((feature) => (
              <div
                key={feature.id}
                className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
              >
                {feature.icon && (
                  <span className="text-[#21336a]">
                    <i className={feature.icon} />
                  </span>
                )}
                <span className="text-sm text-gray-700">{feature.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Display Amenities */}
      {amenities && amenities.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Amenities
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {amenities.map((amenity, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
              >
                <span className="text-[#21336a]">
                  <i className="fas fa-check" />
                </span>
                <span className="text-sm text-gray-700">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 