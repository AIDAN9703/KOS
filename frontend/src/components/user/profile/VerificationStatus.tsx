'use client';

import { useState } from 'react';
import { User } from '@/types/types';
import { MdCheckCircle, MdError, MdUpload } from 'react-icons/md';
import toast from 'react-hot-toast';

interface VerificationStatusProps {
  user: User;
}

export default function VerificationStatus({ user }: VerificationStatusProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'license') => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await fetch('/api/users/documents', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload document');
      
      toast.success(`${type === 'id' ? 'ID' : 'License'} uploaded successfully`);
    } catch (error) {
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const verificationItems = [
    {
      title: 'Email Verification',
      status: user?.verificationStatus?.email,
      message: user?.verificationStatus?.email 
        ? 'Email verified'
        : 'Please verify your email'
    },
    {
      title: 'Phone Verification',
      status: user?.verificationStatus?.phone,
      message: user?.verificationStatus?.phone
        ? 'Phone verified'
        : 'Please verify your phone number'
    },
    {
      title: 'Identity Verification',
      status: user?.verificationStatus?.identity,
      message: user?.verificationStatus?.identity
        ? 'Identity verified'
        : 'Please upload a valid ID'
    },
    {
      title: 'Address Verification',
      status: user?.verificationStatus?.address,
      message: user?.verificationStatus?.address
        ? 'Address verified'
        : 'Please verify your address'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Verification Status Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {verificationItems.map((item) => (
          <div
            key={item.title}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                {item.status ? (
                  <MdCheckCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <MdError className="h-8 w-8 text-yellow-500" />
                )}
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {item.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document Upload Section */}
      <div className="mt-10">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Document Upload
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* ID Document Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <MdUpload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label
                  htmlFor="id-upload"
                  className="cursor-pointer rounded-md font-medium text-[#21336a] hover:text-[#2a4086]"
                >
                  <span>Upload ID Document</span>
                  <input
                    id="id-upload"
                    name="id-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload(e, 'id')}
                    disabled={uploading}
                  />
                </label>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                PNG, JPG, PDF up to 10MB
              </p>
            </div>
          </div>

          {/* Boating License Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <MdUpload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label
                  htmlFor="license-upload"
                  className="cursor-pointer rounded-md font-medium text-[#21336a] hover:text-[#2a4086]"
                >
                  <span>Upload Boating License</span>
                  <input
                    id="license-upload"
                    name="license-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload(e, 'license')}
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

      {/* Uploaded Documents List */}
      {user?.idDocuments && user.idDocuments.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900">Uploaded Documents</h4>
          <ul className="mt-2 divide-y divide-gray-200 border-t border-b border-gray-200">
            {user.idDocuments.map((doc, index) => (
              <li key={index} className="flex items-center justify-between py-3">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">Document {index + 1}</span>
                </div>
                <span className="text-sm text-green-500">Uploaded</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 