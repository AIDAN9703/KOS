'use client';

import { useState } from 'react';
import { Boat, Feature } from '@/types/boat';
import { adminApi } from '@/services/api';
import FeatureSelector from './FeatureSelector';
import toast from 'react-hot-toast';

interface EditBoatFormProps {
  boat: Boat;
  onSuccess: () => void;
  onCancel: () => void;
}

interface Price {
  startDate: string;
  endDate: string;
  price: number;
  hours: number;
}

interface FormData {
  name: string;
  type: string;
  length: string;
  capacity: string;
  location: string;
  description: string;
  images: string[];
}

export default function EditBoatForm({ boat, onSuccess, onCancel }: EditBoatFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: boat.name,
    type: boat.type,
    length: boat.length,
    capacity: boat.capacity,
    location: boat.location,
    description: boat.description,
    images: boat.images || []
  });

  const [selectedFeatures, setSelectedFeatures] = useState<number[]>(
    boat.features?.map(f => f.id) || []
  );

  const [prices, setPrices] = useState<Price[]>(
    boat.prices?.map(p => ({
      startDate: p.effectiveDate,
      endDate: p.expiryDate || '',
      price: p.price,
      hours: p.hours
    })) || []
  );

  const [newPrice, setNewPrice] = useState<Price>({
    startDate: '',
    endDate: '',
    price: 0,
    hours: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const mappedPrices = prices.map(price => ({
        effectiveDate: price.startDate,
        expiryDate: price.endDate,
        hours: price.hours,
        price: price.price,
        isActive: true
      }));

      await adminApi.updateBoat(boat.id, {
        ...formData,
        features: selectedFeatures,
        prices: mappedPrices
      });

      toast.success('Boat updated successfully');
      onSuccess();
    } catch (error) {
      console.error('Error updating boat:', error);
      toast.error('Failed to update boat');
    }
  };

  const handleAddPrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPrice.startDate && newPrice.endDate && newPrice.price && newPrice.hours) {
      setPrices([...prices, newPrice]);
      setNewPrice({
        startDate: '',
        endDate: '',
        price: 0,
        hours: 0
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#21336a] focus:ring-[#21336a]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Type *</label>
          <input
            type="text"
            required
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#21336a] focus:ring-[#21336a]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Length *</label>
          <input
            type="text"
            required
            value={formData.length}
            onChange={(e) => setFormData({ ...formData, length: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#21336a] focus:ring-[#21336a]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Capacity *</label>
          <input
            type="number"
            required
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#21336a] focus:ring-[#21336a]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location *</label>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#21336a] focus:ring-[#21336a]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description *</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#21336a] focus:ring-[#21336a]"
            rows={3}
          />
        </div>
      </div>

      <div className="mt-6">
        <FeatureSelector
          selectedFeatures={selectedFeatures}
          onChange={setSelectedFeatures}
        />
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium">Custom Pricing</h3>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="date"
            value={newPrice.startDate}
            onChange={(e) => setNewPrice({ ...newPrice, startDate: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-[#21336a] focus:ring-[#21336a]"
          />
          <input
            type="date"
            value={newPrice.endDate}
            onChange={(e) => setNewPrice({ ...newPrice, endDate: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-[#21336a] focus:ring-[#21336a]"
          />
          <input
            type="number"
            placeholder="Hours"
            value={newPrice.hours || ''}
            onChange={(e) => setNewPrice({ ...newPrice, hours: Number(e.target.value) })}
            className="rounded-md border-gray-300 shadow-sm focus:border-[#21336a] focus:ring-[#21336a]"
          />
          <input
            type="number"
            placeholder="Price"
            value={newPrice.price || ''}
            onChange={(e) => setNewPrice({ ...newPrice, price: Number(e.target.value) })}
            className="rounded-md border-gray-300 shadow-sm focus:border-[#21336a] focus:ring-[#21336a]"
          />
        </div>
        <button
          type="button"
          onClick={handleAddPrice}
          className="mt-2 px-4 py-2 bg-[#21336a] text-white rounded hover:bg-[#2a4086]"
        >
          Add Price
        </button>

        {prices.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium">Current Prices:</h4>
            <ul className="mt-2 space-y-2">
              {prices.map((price, index) => (
                <li key={index} className="text-sm">
                  {price.startDate} to {price.endDate}: ${price.price} for {price.hours} hours
                  <button
                    type="button"
                    onClick={() => setPrices(prices.filter((_, i) => i !== index))}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#21336a] text-white rounded-md shadow-sm text-sm font-medium hover:bg-[#2a4086]"
        >
          Update Boat
        </button>
      </div>
    </form>
  );
} 