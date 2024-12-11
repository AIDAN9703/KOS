import { useState } from 'react';
import { BoatPrice } from '@/types/types';

interface PricingSectionProps {
  prices: BoatPrice[];
  onChange: (prices: BoatPrice[]) => void;
}

export default function PricingSection({ prices, onChange }: PricingSectionProps) {
  const [newPrice, setNewPrice] = useState<Partial<BoatPrice>>({
    price: 0,
    hours: 0,
    effectiveDate: new Date().toISOString().split('T')[0],
    isActive: true
  });

  const handleAddPrice = () => {
    if (newPrice.price && newPrice.hours && newPrice.effectiveDate) {
      onChange([...prices, { ...newPrice as BoatPrice }]);
      setNewPrice({
        price: 0,
        hours: 0,
        effectiveDate: new Date().toISOString().split('T')[0],
        isActive: true
      });
    }
  };

  const handleRemovePrice = (index: number) => {
    const updatedPrices = prices.filter((_, i) => i !== index);
    onChange(updatedPrices);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Custom Pricing</h3>
      
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Price ($)</label>
          <input
            type="number"
            value={newPrice.price}
            onChange={(e) => setNewPrice({ ...newPrice, price: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Hours</label>
          <input
            type="number"
            value={newPrice.hours}
            onChange={(e) => setNewPrice({ ...newPrice, hours: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Effective Date</label>
          <input
            type="date"
            value={newPrice.effectiveDate}
            onChange={(e) => setNewPrice({ ...newPrice, effectiveDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={handleAddPrice}
            className="w-full px-4 py-2 bg-[#21336a] text-white rounded-md hover:bg-[#2a4086]"
          >
            Add Price
          </button>
        </div>
      </div>

      {/* Existing Prices */}
      <div className="mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Hours</th>
              <th className="px-4 py-2">Effective Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((price, index) => (
              <tr key={index}>
                <td className="px-4 py-2">${price.price}</td>
                <td className="px-4 py-2">{price.hours}h</td>
                <td className="px-4 py-2">{new Date(price.effectiveDate).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() => handleRemovePrice(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 