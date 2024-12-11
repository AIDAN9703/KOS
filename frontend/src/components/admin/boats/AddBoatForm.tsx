'use client';

import { useState } from 'react';
import { useBoats } from '@/hooks/useBoats';
import FeatureSelector from './FeatureSelector';
import { BoatFormData, BoatStatus, CancellationPolicy, FuelType } from '@/types/types';
import PricingSection from './PricingSection';
import AdvancedFeaturesSection from './AdvancedFeaturesSection';

interface AddBoatFormProps {
  onSuccess: () => void;
}

export default function AddBoatForm({ onSuccess }: AddBoatFormProps) {
  const { createBoat, isCreating } = useBoats();
  const [formData, setFormData] = useState<BoatFormData>({
    name: '',
    type: '',
    make: '',
    model: '',
    year: undefined,
    length: 0,
    capacity: 0,
    location: '',
    description: '',
    images: [],
    status: BoatStatus.INACTIVE,
    basePrice: 0,
    cancellationPolicy: CancellationPolicy.MODERATE,
    features: [],
    boatPrices: [],
    amenities: [],
    rules: [],
    allowedActivities: [],
    sleeps: undefined,
    staterooms: undefined,
    bathrooms: undefined,
    engineCount: undefined,
    enginePower: '',
    fuelType: undefined,
    cruisingSpeed: undefined,
    maxSpeed: undefined,
    minimumNotice: undefined,
    maximumDuration: undefined,
    securityDeposit: undefined,
    lastServiced: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'images') {
        Array.from(value as FileList).forEach((file) => {
          formDataToSend.append('images', file);
        });
      } else if (Array.isArray(value)) {
        formDataToSend.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== '') {
        formDataToSend.append(key, value.toString());
      }
    });

    createBoat(formDataToSend);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name*</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type*</label>
            <input
              type="text"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Make</label>
            <input
              type="text"
              value={formData.make}
              onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Model</label>
            <input
              type="text"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Year</label>
            <input
              type="number"
              value={formData.year || ''}
              onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) || undefined })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Length (ft)*</label>
            <input
              type="number"
              value={formData.length}
              onChange={(e) => setFormData({ ...formData, length: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Capacity*</label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Base Price*</label>
            <input
              type="number"
              value={formData.basePrice}
              onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location*</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as BoatStatus })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value={BoatStatus.ACTIVE}>Active</option>
              <option value={BoatStatus.INACTIVE}>Inactive</option>
              <option value={BoatStatus.MAINTENANCE}>Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cancellation Policy</label>
            <select
              value={formData.cancellationPolicy}
              onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value as CancellationPolicy })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value={CancellationPolicy.FLEXIBLE}>Flexible</option>
              <option value={CancellationPolicy.MODERATE}>Moderate</option>
              <option value={CancellationPolicy.STRICT}>Strict</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description*</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Additional Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Images</label>
            <input
              type="file"
              multiple
              onChange={(e) => setFormData({ ...formData, images: e.target.files || [] })}
              className="mt-1 block w-full"
              accept="image/*"
            />
          </div>

          {/* Add FeatureSelector component */}
          <div className="col-span-2">
            <FeatureSelector
              selectedFeatures={formData.features}
              onChange={(features) => setFormData({ ...formData, features })}
            />
          </div>
        </div>
      </div>

      {/* Advanced Features Section */}
      <AdvancedFeaturesSection 
        formData={formData}
        onChange={setFormData}
      />

      {/* Pricing Section */}
      <PricingSection
        prices={formData.boatPrices}
        onChange={(prices) => setFormData({ ...formData, boatPrices: prices })}
      />

      {/* Rules and Policies Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Rules and Policies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Minimum Notice (hours)</label>
            <input
              type="number"
              value={formData.minimumNotice || ''}
              onChange={(e) => setFormData({ ...formData, minimumNotice: Number(e.target.value) || undefined })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Maximum Duration (hours)</label>
            <input
              type="number"
              value={formData.maximumDuration || ''}
              onChange={(e) => setFormData({ ...formData, maximumDuration: Number(e.target.value) || undefined })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Rules</label>
            <textarea
              value={formData.rules.join('\n')}
              onChange={(e) => setFormData({ ...formData, rules: e.target.value.split('\n').filter(rule => rule.trim()) })}
              rows={4}
              placeholder="Enter each rule on a new line"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Allowed Activities</label>
            <textarea
              value={formData.allowedActivities.join('\n')}
              onChange={(e) => setFormData({ 
                ...formData, 
                allowedActivities: e.target.value.split('\n').filter(activity => activity.trim()) 
              })}
              rows={4}
              placeholder="Enter each activity on a new line"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Amenities</label>
            <textarea
              value={formData.amenities.join('\n')}
              onChange={(e) => setFormData({ 
                ...formData, 
                amenities: e.target.value.split('\n').filter(amenity => amenity.trim()) 
              })}
              rows={4}
              placeholder="Enter each amenity on a new line"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => onSuccess()}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isCreating}
          className="px-4 py-2 bg-[#21336a] text-white rounded-md hover:bg-[#2a4086] disabled:opacity-50"
        >
          {isCreating ? 'Adding...' : 'Add Boat'}
        </button>
      </div>
    </form>
  );
} 