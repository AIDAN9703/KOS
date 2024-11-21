'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import Image from 'next/image';
import { User } from '@/types/auth';
import axios from 'axios';

type ProfileFormData = {
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  bio?: string;
  preferences: {
    notifications: boolean;
    newsletter: boolean;
    twoFactorAuth: boolean;
  };
  profileImage?: File;
};

export default function ProfileContent() {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch profile data when component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        setProfileData(data);
        setImagePreview(data.profileImage);
        
        // Format the date to YYYY-MM-DD
        const formattedDate = data.dateOfBirth ? 
          new Date(data.dateOfBirth).toISOString().split('T')[0] : 
          '';
        
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          address: data.address || '',
          dateOfBirth: formattedDate,
          bio: data.bio || '',
          preferences: data.preferences || {
            notifications: true,
            newsletter: false,
            twoFactorAuth: false
          }
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Update form data when profile data is loaded
  useEffect(() => {
    if (profileData) {
      // Format the date to YYYY-MM-DD
      const formattedDate = profileData.dateOfBirth ? 
        new Date(profileData.dateOfBirth).toISOString().split('T')[0] : 
        '';

      setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        phoneNumber: profileData.phoneNumber || '',
        address: profileData.address || '',
        dateOfBirth: formattedDate,  // Use the formatted date here
        bio: profileData.bio || '',
        preferences: profileData.preferences || {
          notifications: true,
          newsletter: false,
          twoFactorAuth: false
        }
      });
    }
  }, [profileData]);

  const [formData, setFormData] = useState<ProfileFormData>({
    name: profileData?.name || '',
    email: profileData?.email || '',
    phoneNumber: profileData?.phoneNumber || '',
    address: profileData?.address || '',
    dateOfBirth: profileData?.dateOfBirth || '',
    bio: profileData?.bio || '',
    preferences: profileData?.preferences || {
      notifications: true,
      newsletter: false,
      twoFactorAuth: false
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profileImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create regular JSON object instead of FormData
      const updateData = {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        bio: formData.bio,
        preferences: formData.preferences
      };

      console.log('Sending update data:', updateData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setProfileData(updatedUser);
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Profile Settings
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Placeholder */}
            <div className="flex items-center space-x-6">
              <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                <span className="text-gray-400 text-4xl">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Profile image upload coming soon
                </p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {/* Preferences */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.preferences.notifications}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        notifications: e.target.checked
                      }
                    }))}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Enable notifications
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.preferences.newsletter}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        newsletter: e.target.checked
                      }
                    }))}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Subscribe to newsletter
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.preferences.twoFactorAuth}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        twoFactorAuth: e.target.checked
                      }
                    }))}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Enable two-factor authentication
                  </span>
                </label>
              </div>
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-600 text-sm">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 