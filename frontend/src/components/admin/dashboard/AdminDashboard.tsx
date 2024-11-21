'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/components/auth/AuthProvider';
import BoatForm from './BoatForm';
import BookingManagement from './BookingManagement';
import FeatureManagement from './FeatureManagement';
import toast from 'react-hot-toast';
import { Boat } from '@/types/boat';
import { Booking } from '@/types/booking';
import { User } from '@/types/auth';
import { adminApi } from '@/services/api';
import EditBoatForm from './EditBoatForm';

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-medium rounded-t-lg ${
      isActive 
        ? 'bg-white text-[#21336a] border-t border-x border-gray-200' 
        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
    }`}
  >
    {label}
  </button>
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('boats');
  const [boats, setBoats] = useState<Boat[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [selectedBoat, setSelectedBoat] = useState<Boat | null>(null);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        { data: boats }, 
        { data: bookings }, 
        { data: users }
      ] = await Promise.all([
        adminApi.getAllBoats(),
        adminApi.getAllBookings(),
        adminApi.getAllUsers()
      ]);

      setBoats(boats);
      setBookings(bookings);
      setUsers(users);
    } catch (error) {
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBoat = async (boatData: any) => {
    try {
      await adminApi.addBoat(boatData);
      toast.success('Boat added successfully');
      fetchData();
    } catch (error) {
      console.error('Error adding boat:', error);
      toast.error('Failed to add boat');
    }
  };

  const handleUpdateBoat = async (boatId: number, boatData: any) => {
    try {
      await adminApi.updateBoat(boatId, boatData);
      toast.success('Boat updated successfully');
      fetchData();
    } catch (error) {
      console.error('Error updating boat:', error);
      toast.error('Failed to update boat');
    }
  };

  const handleDeleteBoat = async (boatId: number) => {
    if (!window.confirm('Are you sure you want to delete this boat?')) return;

    try {
      await adminApi.deleteBoat(boatId);
      toast.success('Boat deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting boat:', error);
      toast.error('Failed to delete boat');
    }
  };

  const handleUpdateUserRole = async (userId: number, newRole: string) => {
    try {
      await adminApi.updateUserRole(userId, newRole);
      toast.success('User role updated successfully');
      fetchData();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleSuspendUser = async (userId: number) => {
    try {
      await adminApi.updateUserRole(userId, 'suspended');
      toast.success('User suspended successfully');
      fetchData();
    } catch (error) {
      console.error('Error suspending user:', error);
      toast.error('Failed to suspend user');
    }
  };

  const handleUpdateBookingStatus = async (bookingId: number, newStatus: string) => {
    try {
      await adminApi.updateBookingStatus(bookingId, newStatus);
      toast.success('Booking status updated successfully');
      fetchData();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const handleEditBoat = (boat: Boat) => {
    setSelectedBoat(boat);
    setActiveTab('editBoat');
  };

  const handleUpdateSuccess = async () => {
    await fetchData();
    setSelectedBoat(null);
    setActiveTab('boats');
    toast.success('Boat updated successfully');
  };


  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="flex gap-2 mb-4">
          <Tab
            label="Boats"
            isActive={activeTab === 'boats'}
            onClick={() => setActiveTab('boats')}
          />
          <Tab
            label="Bookings"
            isActive={activeTab === 'bookings'}
            onClick={() => setActiveTab('bookings')}
          />
          <Tab
            label="Features"
            isActive={activeTab === 'features'}
            onClick={() => setActiveTab('features')}
          />
          <Tab
            label="Users"
            isActive={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'boats' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Add New Boat</h2>
              <BoatForm onSuccess={fetchData} />
              
              <h2 className="text-xl font-semibold mb-4">Manage Boats</h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {boats.map((boat) => (
                      <tr key={boat.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{boat.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{boat.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{boat.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{boat.status}</td>
                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                          <button
                            onClick={() => handleEditBoat(boat)}
                            className="text-indigo-600 hover:text-indigo-900 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBoat(boat.id)}
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <BookingManagement
              bookings={bookings}
              onUpdateStatus={handleUpdateBookingStatus}
            />
          )}

          {activeTab === 'features' && (
            <FeatureManagement onUpdate={fetchData} />
          )}

          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-3 border-b">Name</th>
                    <th className="px-6 py-3 border-b">Email</th>
                    <th className="px-6 py-3 border-b">Phone</th>
                    <th className="px-6 py-3 border-b">Role</th>
                    <th className="px-6 py-3 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 border-b">{user.name}</td>
                      <td className="px-6 py-4 border-b">{user.email}</td>
                      <td className="px-6 py-4 border-b">{user.phoneNumber}</td>
                      <td className="px-6 py-4 border-b">{user.role}</td>
                      <td className="px-6 py-4 border-b">
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="user">User</option>
                          <option value="owner">Owner</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'editBoat' && selectedBoat && (
            <EditBoatForm
              boat={selectedBoat}
              onSuccess={handleUpdateSuccess}
              onCancel={() => {
                setSelectedBoat(null);
                setActiveTab('boats');
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
