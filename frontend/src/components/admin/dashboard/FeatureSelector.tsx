'use client';

import { useState, useEffect } from 'react';
import { Feature } from '@/types/boat';
import { adminApi } from '@/services/api';
import toast from 'react-hot-toast';

interface FeatureSelectorProps {
  selectedFeatures: number[];
  onChange: (features: number[]) => void;
}

const FeatureSelector: React.FC<FeatureSelectorProps> = ({ selectedFeatures, onChange }) => {
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const { data } = await adminApi.getAllFeatures();
      setFeatures(data);
    } catch (error) {
      console.error('Error fetching features:', error);
      toast.error('Failed to fetch features');
    }
  };

  const handleFeatureToggle = (featureId: number) => {
    const newSelectedFeatures = selectedFeatures.includes(featureId)
      ? selectedFeatures.filter(id => id !== featureId)
      : [...selectedFeatures, featureId];
    onChange(newSelectedFeatures);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Features</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="flex items-center space-x-2"
          >
            <input
              type="checkbox"
              id={`feature-${feature.id}`}
              checked={selectedFeatures.includes(feature.id)}
              onChange={() => handleFeatureToggle(feature.id)}
              className="rounded border-gray-300 text-[#21336a] focus:ring-[#21336a]"
            />
            <label
              htmlFor={`feature-${feature.id}`}
              className="text-sm text-gray-700"
            >
              {feature.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSelector; 