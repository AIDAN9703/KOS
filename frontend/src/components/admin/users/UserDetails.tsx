'use client';

import { User } from '@/types/types';
import { useState } from 'react';
import { MdArrowBack, MdEdit, MdDelete } from 'react-icons/md';

interface UserDetailsProps {
  user: User;
  onUpdate: (userId: number, data: Partial<User>) => Promise<void>;
  onDelete: (userId: number) => Promise<void>;
  onBack: () => void;
}

export default function UserDetails({ user, onUpdate, onDelete, onBack }: UserDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber,
    role: user.role
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(user.id, formData);
    setIsEditing(false);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <MdArrowBack className="w-5 h-5 mr-2" />
          Back to Users
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <MdEdit className="w-5 h-5 mr-2" />
            Edit
          </button>
          <button
            onClick={() => onDelete(user.id)}
            className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <MdDelete className="w-5 h-5 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="h-20 w-20 rounded-full bg-[#21336a] text-white flex items-center justify-center text-2xl">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-500">{user.role}</p>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#21336a] focus:ring-[#21336a]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#21336a] focus:ring-[#21336a]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#21336a] focus:ring-[#21336a]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#21336a] focus:ring-[#21336a]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#21336a] focus:ring-[#21336a]"
                  >
                    <option value="USER">User</option>
                    <option value="OWNER">Owner</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#21336a] text-white rounded-md shadow-sm text-sm font-medium hover:bg-[#2a4086]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                <div className="mt-3 space-y-2">
                  <p className="text-gray-900">Email: {user.email}</p>
                  <p className="text-gray-900">Phone: {user.phoneNumber}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Account Details</h3>
                <div className="mt-3 space-y-2">
                  <p className="text-gray-900">Role: {user.role}</p>
                  <p className="text-gray-900">Member since: {new Date(user.createdAt || '').toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 