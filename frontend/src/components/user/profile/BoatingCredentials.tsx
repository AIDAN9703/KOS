'use client';

import { useState } from 'react';
import { User } from '@/types/types';
import { MdUpload, MdWarning, MdCheckCircle } from 'react-icons/md';
import toast from 'react-hot-toast';

interface BoatingCredentialsProps {
  user: User;
}

export default function BoatingCredentials({ user }: BoatingCredentialsProps) {
  const [uploading, setUploading] = useState(false);

  const handleLicenseUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('license', file);

    try {
      const response = await fetch('/api/users/boating-license', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload license');
      
      toast.success('Boating license uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload boating license');
    } finally {
      setUploading(false);
    }
  };

  const isLicenseExpired = user?.licenseExpiry 
    ? new Date(user.licenseExpiry) < new Date() 
    : false;

  const daysUntilExpiry = user?.licenseExpiry
    ? Math.ceil((new Date(user.licenseExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="space-y-6">
      {/* License Status */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Boating License Status
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {user?.boatingLicense 
                  ? 'License verified'
                  : 'No license uploaded'}
              </p>
            </div>
            <div>
              {user?.boatingLicense ? (
                isLicenseExpired ? (
                  <div className="flex items-center text-red-600">
                    <MdWarning className="h-5 w-5 mr-1" />
                    <span className="text-sm">Expired</span>
                  </div>
                ) : (
                  <div className="flex items-center text-green-600">
                    <MdCheckCircle className="h-5 w-5 mr-1" />
                    <span className="text-sm">Active</span>
                  </div>
                )
              ) : null}
            </div>
          </div>

          {user?.licenseExpiry && !isLicenseExpired && (
            <div className="mt-4">
              <div className="bg-blue-50 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <MdWarning className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Your license expires in {daysUntilExpiry} days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* License Upload */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Upload Boating License
          </h3>
          <div className="mt-2">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <MdUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label
                    htmlFor="license-upload"
                    className="cursor-pointer rounded-md font-medium text-[#21336a] hover:text-[#2a4086]"
                  >
                    <span>Upload a new license</span>
                    <input
                      id="license-upload"
                      name="license-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*,.pdf"
                      onChange={handleLicenseUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  PNG, JPG, PDF up to 10MB
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* License Details */}
      {user?.boatingLicense && (
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              License Details
            </h3>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Issue Date
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Expiry Date
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.licenseExpiry ? new Date(user.licenseExpiry).toLocaleDateString() : 'N/A'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
} 