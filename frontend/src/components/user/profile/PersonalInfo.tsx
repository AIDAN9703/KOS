'use client';

import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';

export default function PersonalInfo() {
  const { user, isLoading, updateProfile } = useProfile();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      const formattedDate = user.dateOfBirth 
        ? new Date(user.dateOfBirth).toISOString().split('T')[0]
        : '';

      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: formattedDate,
        address: user.address || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      dateOfBirth: formData.dateOfBirth 
        ? new Date(formData.dateOfBirth).toISOString()
        : undefined
    };

    updateProfile(submitData);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#21336a] focus:outline-none focus:ring-1 focus:ring-[#21336a]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#21336a] focus:outline-none focus:ring-1 focus:ring-[#21336a]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#21336a] focus:outline-none focus:ring-1 focus:ring-[#21336a]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#21336a] focus:outline-none focus:ring-1 focus:ring-[#21336a]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              dateOfBirth: e.target.value 
            }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#21336a] focus:outline-none focus:ring-1 focus:ring-[#21336a]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#21336a] focus:outline-none focus:ring-1 focus:ring-[#21336a]"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            rows={4}
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#21336a] focus:outline-none focus:ring-1 focus:ring-[#21336a]"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-[#21336a] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#2a4086] focus:outline-none focus:ring-2 focus:ring-[#21336a] focus:ring-offset-2 disabled:opacity-50"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
} 