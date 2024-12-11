'use client';

import { FeatureManagementComponent } from '@/types/components';
import FeatureSelector from './FeatureSelector';
import { useFeatures } from '@/hooks/useFeature';

const FeatureManagement: FeatureManagementComponent = ({ onUpdate }) => {
  const { features, isLoading, deleteFeature, isDeleting } = useFeatures();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Features</h2>

      {/* Feature List */}
      <div className="space-y-6">
        {features.map(feature => (
          <div
            key={feature.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center">
              {feature.icon && (
                <i className={`${feature.icon} mr-2`} />
              )}
              <span>{feature.name}</span>
            </div>
            <button
              onClick={() => deleteFeature(feature.id)}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-700 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureManagement; 