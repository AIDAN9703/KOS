'use client'

import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';
import { CompleteProfileData } from '@/types/auth';

interface ProfileCompletionProps {
  tempToken: string;
}

const getPasswordStrength = (password: string) => {
  let strength = 0;
  let requirements = [];

  if (password.length >= 8) {
    strength++;
    requirements.push('8+ characters');
  }
  if (/[A-Z]/.test(password)) {
    strength++;
    requirements.push('uppercase');
  }
  if (/[0-9]/.test(password)) {
    strength++;
    requirements.push('number');
  }
  if (/[^A-Za-z0-9]/.test(password)) {
    strength++;
    requirements.push('special character');
  }

  const colors = {
    0: 'bg-red-500',
    1: 'bg-orange-500',
    2: 'bg-yellow-500',
    3: 'bg-green-500',
    4: 'bg-emerald-500'
  };

  return {
    score: strength,
    requirements,
    color: colors[strength as keyof typeof colors],
    label: ['Too Weak', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  };
};

export default function ProfileCompletion({ tempToken }: ProfileCompletionProps) {
  const router = useRouter();
  const { completeRegistration } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    address: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Submitting with token:', tempToken);
      const profileData: CompleteProfileData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address
      };

      await completeRegistration(profileData, tempToken);
      router.push('/profile');
    } catch (error: any) {
      console.error('Profile completion error:', error);
      setError(error.message || 'Failed to complete profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#21336a] focus:border-[#21336a]"
          />
        </div>

        <div className="group relative">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#21336a] focus:border-[#21336a]"
          />
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-0 -bottom-8 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 w-48">
            We'll use this email for important notifications and account recovery
          </div>
        </div>

        <div className="group relative">
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            id="dateOfBirth"
            type="date"
            required
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#21336a] focus:border-[#21336a]"
          />
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-0 -bottom-8 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
            Must be at least 18 years old
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            id="address"
            type="text"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#21336a] focus:border-[#21336a]"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1 space-y-2">
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#21336a] focus:border-[#21336a]"
            />
            {formData.password && (
              <>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${getPasswordStrength(formData.password).color}`}
                      style={{ width: `${(getPasswordStrength(formData.password).score / 4) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {getPasswordStrength(formData.password).label}
                  </span>
                </div>
                <div className="text-xs text-gray-500 flex flex-wrap gap-2">
                  {getPasswordStrength(formData.password).requirements.map(req => (
                    <span key={req} className="bg-gray-100 px-2 py-1 rounded-full">
                      ✓ {req}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="mt-1 appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#21336a] focus:border-[#21336a]"
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#21336a] hover:bg-[#2a4086] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#21336a] transition-colors duration-200 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Completing Registration...' : 'Complete Registration'}
      </button>
    </form>
  );
} 