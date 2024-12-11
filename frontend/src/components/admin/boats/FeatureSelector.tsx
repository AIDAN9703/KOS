'use client';

import { useFeatures } from '@/hooks/useFeature';
import { BoatFeature } from '@/types/types';

interface FeatureSelectorProps {
  selectedFeatures: number[];
  onChange: (features: number[]) => void;
}

export default function FeatureSelector({ selectedFeatures, onChange }: FeatureSelectorProps) {
  const { features, isLoading, error } = useFeatures();

  const featuresByCategory = features.reduce((acc: { [key: string]: BoatFeature[] }, feature: BoatFeature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {});

  const handleToggleFeature = (featureId: number) => {
    if (selectedFeatures.includes(featureId)) {
      onChange(selectedFeatures.filter(id => id !== featureId));
    } else {
      onChange([...selectedFeatures, featureId]);
    }
  };

  if (isLoading) {
    return <div>Loading features...</div>;
  }

  if (error) {
    return <div>Error loading features. Please try again.</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Features</h3>
      <div className="space-y-6">
        {Object.entries(featuresByCategory).map(([category, categoryFeatures]) => (
          <div key={category} className="space-y-2">
            <h4 className="font-medium text-gray-700">{category}</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categoryFeatures.map((feature) => (
                <label key={feature.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(feature.id)}
                    onChange={() => handleToggleFeature(feature.id)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">
                    {feature.icon && <span className="mr-2">{feature.icon}</span>}
                    {feature.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 