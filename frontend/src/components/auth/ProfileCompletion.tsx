'use client'

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { CompleteProfileData } from '@/types/types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface ProfileCompletionProps {
  tempToken: string;
  phoneNumber: string;
}

export default function ProfileCompletion({ tempToken, phoneNumber }: ProfileCompletionProps) {
  const router = useRouter();
  const { completeRegistration } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CompleteProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    address: '',
    phoneNumber: phoneNumber, // Use the phone number from registration
    role: 'USER',
    status: 'ACTIVE'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await completeRegistration(formData, tempToken);
      toast.success('Profile completed successfully!');
      router.push('/');
    } catch (error) {
      console.error('Profile completion error:', error);
      toast.error('Failed to complete profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#21336a] focus:ring-[#21336a]"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#21336a] focus:ring-[#21336a]"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#21336a] focus:ring-[#21336a]"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password *
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#21336a] focus:ring-[#21336a]"
          />
        </div>

        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
            Date of Birth *
          </label>
          <input
            type="date"
            name="dateOfBirth"
            id="dateOfBirth"
            required
            value={formData.dateOfBirth}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]} // Prevent future dates
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#21336a] focus:ring-[#21336a]"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#21336a] focus:ring-[#21336a]"
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full flex justify-center py-3 px-4 border border-transparent rounded-lg
            text-sm font-medium text-white bg-[#21336a] hover:bg-[#2a4086]
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#21336a]
            transition-all duration-200
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Completing Registration...
            </div>
          ) : (
            'Complete Registration'
          )}
        </button>
      </div>
    </form>
  );
} 