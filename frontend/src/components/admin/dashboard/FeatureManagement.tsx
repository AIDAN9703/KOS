'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FeatureManagementComponent } from '@/types/components';
import { Feature } from '@/types/boat';
import { adminApi } from '@/services/api';

const FeatureManagement: FeatureManagementComponent = ({ onUpdate }) => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const { data } = await adminApi.getAllFeatures();
      setFeatures(data || []);
    } catch (error) {
      console.error('Error fetching features:', error);
      toast.error('Failed to load features');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeature = async (featureId: number) => {
    try {
      await adminApi.deleteFeature(featureId);
      toast.success('Feature deleted successfully');
      fetchFeatures();
      onUpdate();
    } catch (error) {
      console.error('Error deleting feature:', error);
      toast.error('Failed to delete feature');
    }
  };

  if (loading) return <div>Loading...</div>;

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
              onClick={() => handleDeleteFeature(feature.id)}
              className="text-red-500 hover:text-red-700"
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