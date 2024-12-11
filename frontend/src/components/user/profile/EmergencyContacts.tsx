'use client';

import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { MdEdit, MdPerson } from 'react-icons/md';
import toast from 'react-hot-toast';

interface EmergencyContactData {
  name: string;
  relationship: string;
  phone: string;
}

export default function EmergencyContacts() {
  const { user, updateProfile, isLoading } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<EmergencyContactData>({
    name: '',
    relationship: '',
    phone: ''
  });

  useEffect(() => {
    if (user?.emergencyContact) {
      const contact = typeof user.emergencyContact === 'string' 
        ? JSON.parse(user.emergencyContact) 
        : user.emergencyContact;
      
      setFormData({
        name: contact.name || '',
        relationship: contact.relationship || '',
        phone: contact.phone || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.relationship || !formData.phone) {
      toast.error('All fields are required');
      return;
    }

    updateProfile({
      emergencyContact: formData
    }, {
      onSuccess: () => {
        setIsEditing(false); // Close the form on successful update
      },
      onError: () => {
        // Keep the form open if there's an error
        toast.error('Failed to update emergency contact');
      }
    });
  };

  const handleCancel = () => {
    // Reset form data to current user data when canceling
    if (user?.emergencyContact) {
      const contact = typeof user.emergencyContact === 'string' 
        ? JSON.parse(user.emergencyContact) 
        : user.emergencyContact;
      
      setFormData({
        name: contact.name || '',
        relationship: contact.relationship || '',
        phone: contact.phone || ''
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#21336a]" />
      </div>
    );
  }

  const displayContact = user?.emergencyContact 
    ? (typeof user.emergencyContact === 'string' 
      ? JSON.parse(user.emergencyContact) 
      : user.emergencyContact)
    : null;

  return (
    <div className="space-y-6">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <MdPerson className="h-6 w-6 text-gray-400" />
              <h3 className="ml-3 text-lg font-medium text-gray-900">
                Emergency Contact
              </h3>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-[#21336a] hover:text-[#2a4086]"
              >
                <MdEdit className="h-5 w-5" />
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#21336a] focus:outline-none focus:ring-1 focus:ring-[#21336a]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Relationship
                </label>
                <input
                  type="text"
                  value={formData.relationship}
                  onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#21336a] focus:outline-none focus:ring-1 focus:ring-[#21336a]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#21336a] focus:outline-none focus:ring-1 focus:ring-[#21336a]"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#21336a] hover:bg-[#2a4086]"
                >
                  Save Contact
                </button>
              </div>
            </form>
          ) : (
            displayContact ? (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{displayContact.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Relationship</label>
                  <p className="mt-1 text-sm text-gray-900">{displayContact.relationship}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone Number</label>
                  <p className="mt-1 text-sm text-gray-900">{displayContact.phone}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No emergency contact added yet.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
} 