import { FuelType } from '@/types/types';

interface AdvancedFeaturesSectionProps {
  formData: any;
  onChange: (data: any) => void;
}

export default function AdvancedFeaturesSection({ formData, onChange }: AdvancedFeaturesSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Advanced Features</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Sleeps</label>
          <input
            type="number"
            value={formData.sleeps || ''}
            onChange={(e) => onChange({ ...formData, sleeps: Number(e.target.value) || undefined })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Staterooms</label>
          <input
            type="number"
            value={formData.staterooms || ''}
            onChange={(e) => onChange({ ...formData, staterooms: Number(e.target.value) || undefined })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
          <input
            type="number"
            value={formData.bathrooms || ''}
            onChange={(e) => onChange({ ...formData, bathrooms: Number(e.target.value) || undefined })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Engine Count</label>
          <input
            type="number"
            value={formData.engineCount || ''}
            onChange={(e) => onChange({ ...formData, engineCount: Number(e.target.value) || undefined })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Engine Power</label>
          <input
            type="text"
            value={formData.enginePower || ''}
            onChange={(e) => onChange({ ...formData, enginePower: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
          <select
            value={formData.fuelType || ''}
            onChange={(e) => onChange({ ...formData, fuelType: e.target.value as FuelType })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select Fuel Type</option>
            {Object.values(FuelType).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cruising Speed (knots)</label>
          <input
            type="number"
            value={formData.cruisingSpeed || ''}
            onChange={(e) => onChange({ ...formData, cruisingSpeed: Number(e.target.value) || undefined })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Max Speed (knots)</label>
          <input
            type="number"
            value={formData.maxSpeed || ''}
            onChange={(e) => onChange({ ...formData, maxSpeed: Number(e.target.value) || undefined })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Security Deposit ($)</label>
          <input
            type="number"
            value={formData.securityDeposit || ''}
            onChange={(e) => onChange({ ...formData, securityDeposit: Number(e.target.value) || undefined })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}