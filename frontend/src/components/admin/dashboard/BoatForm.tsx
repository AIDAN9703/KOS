'use client';

import { useState } from 'react';
import { adminApi } from '@/services/api';
import FeatureSelector from './FeatureSelector';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface Price {
  startDate: string;
  endDate: string;
  price: number;
  hours: number;
}

export default function BoatForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    make: '',
    model: '',
    year: '',
    length: '',
    capacity: '',
    location: '',
    description: '',
    images: [] as string[]
  });

  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);
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
        effectiveDate: new Date(price.startDate).toISOString(),
        expiryDate: new Date(price.endDate).toISOString(),
        hours: Number(price.hours),
        price: Number(price.price),
        isActive: true
      }));

      await adminApi.addBoat({
        ...formData,
        capacity: Number(formData.capacity),
        year: Number(formData.year),
        features: selectedFeatures,
        prices: mappedPrices
      });
      toast.success('Boat added successfully');
      onSuccess();
      // Reset form
      setFormData({
        name: '',
        type: '',
        make: '',
        model: '',
        year: '',
        length: '',
        capacity: '',
        location: '',
        description: '',
        images: []
      });
      setSelectedFeatures([]);
      setPrices([]);
    } catch (error) {
      console.error('Error adding boat:', error);
      toast.error('Failed to add boat');
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
      {/* Basic Info */}
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
          <label className="block text-sm font-medium text-gray-700">Make *</label>
          <input
            type="text"
            required
            value={formData.make}
            onChange={(e) => setFormData({ ...formData, make: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#21336a] focus:ring-[#21336a]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Model *</label>
          <input
            type="text"
            required
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#21336a] focus:ring-[#21336a]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Year *</label>
          <input
            type="number"
            required
            min="1900"
            max={new Date().getFullYear() + 1}
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
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

      {/* Features */}
      <div className="mt-6">
        <FeatureSelector
          selectedFeatures={selectedFeatures}
          onChange={setSelectedFeatures}
        />
      </div>

      {/* Custom Pricing */}
      <div className="mt-6">
        <h3 className="text-lg font-medium">Custom Pricing (Optional)</h3>
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

        {/* Display added prices */}
        {prices.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium">Added Prices:</h4>
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

      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          className="w-full px-4 py-2 bg-[#21336a] text-white rounded hover:bg-[#2a4086]"
        >
          Add Boat
        </button>
      </div>
    </form>
  );
} 