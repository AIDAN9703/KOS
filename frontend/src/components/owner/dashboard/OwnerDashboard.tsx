'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { useApi } from '../../auth/AuthProvider';
import { Boat, BookingRequest } from '@/types/types';
import AddBoatForm from './AddBoatForm';
import UpdateBoatForm from '../UpdateBoatForm';
import BoatAvailabilityManager from '../../boats/BoatAvailabilityManager';
import OwnerEarningsReport from '../OwnerEarningsReport';
import { toast } from 'react-hot-toast';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const api = useApi();
  const [boats, setBoats] = useState<Boat[]>([]);
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [selectedBoat, setSelectedBoat] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddBoatForm, setShowAddBoatForm] = useState(false);
  const [showUpdateBoatForm, setShowUpdateBoatForm] = useState(false);
  const [boatToUpdate, setBoatToUpdate] = useState<Boat | null>(null);

  useEffect(() => {
    if (user?.role === 'owner') {
      fetchOwnerData();
      setupWebSocket();
    }
  }, [user]);

  const setupWebSocket = () => {
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/owner`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'NEW_BOOKING_REQUEST') {
        setBookingRequests(prev => [data.booking, ...prev]);
        toast.success('New booking request received!');
      }
    };

    return () => ws.close();
  };

  const fetchOwnerData = async () => {
    try {
      setIsLoading(true);
      const [boatsRes, requestsRes] = await Promise.all([
        api.get<Boat[]>('/api/owner/boats'),
        api.get<BookingRequest[]>('/api/owner/booking-requests')
      ]);

      setBoats(boatsRes.data);
      setBookingRequests(requestsRes.data);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to load owner data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBoat = async (newBoat: Omit<Boat, 'id'>) => {
    try {
      const formData = new FormData();
      Object.entries(newBoat).forEach(([key, value]) => {
        if (key === 'images') {
          value.forEach((image: File) => formData.append('images', image));
        } else {
          formData.append(key, value.toString());
        }
      });

      const response = await api.post<Boat>('/api/owner/boats', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setBoats(prev => [...prev, response.data]);
      setShowAddBoatForm(false);
      toast.success('Boat added successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to add boat');
    }
  };

  const handleUpdateBoat = async (updatedBoat: Boat) => {
    try {
      const response = await api.put<Boat>(`/api/owner/boats/${updatedBoat.id}`, updatedBoat);
      setBoats(prev => prev.map(boat => 
        boat.id === response.data.id ? response.data : boat
      ));
      setShowUpdateBoatForm(false);
      toast.success('Boat updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update boat');
    }
  };

  const handleBookingResponse = async (bookingId: number, status: 'confirmed' | 'cancelled') => {
    try {
      await api.put(`/api/owner/booking-requests/${bookingId}`, { status });
      setBookingRequests(prev => prev.filter(req => req.id !== bookingId));
      toast.success(`Booking ${status} successfully`);
    } catch (err: any) {
      toast.error(err.message || `Failed to ${status} booking`);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Boats Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Your Boats</h2>
        {boats.length > 0 ? (
          <div className="space-y-4">
            {boats.map(boat => (
              <div key={boat.id} className="border p-4 rounded">
                <h3 className="font-medium">{boat.name}</h3>
                <p className="text-sm text-gray-600">{boat.type}</p>
                <div className="mt-2 space-x-2">
                  <button 
                    onClick={() => {
                      setBoatToUpdate(boat);
                      setShowUpdateBoatForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setSelectedBoat(boat.id)}
                    className="text-green-600 hover:text-green-800"
                  >
                    Manage Availability
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No boats listed yet. Add your first boat to get started!</p>
        )}
        <button 
          onClick={() => setShowAddBoatForm(true)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Boat
        </button>
      </div>

      {/* Booking Requests Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Pending Booking Requests</h2>
        {bookingRequests.length > 0 ? (
          <div className="space-y-4">
            {bookingRequests.map(request => (
              <div key={request.id} className="border p-4 rounded">
                <h3 className="font-medium">{request.boatName}</h3>
                <p className="text-sm">Renter: {request.renterName}</p>
                <p className="text-sm">Date: {new Date(request.date).toLocaleDateString()}</p>
                <p className="text-sm">Duration: {request.duration} hours</p>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleBookingResponse(request.id, 'confirmed')}
                    className="text-green-600 hover:text-green-800"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleBookingResponse(request.id, 'cancelled')}
                    className="text-red-600 hover:text-red-800"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No pending booking requests.</p>
        )}
      </div>

      {/* Modals */}
      {showAddBoatForm && (
        <AddBoatForm 
          onSubmit={handleAddBoat} 
          onCancel={() => setShowAddBoatForm(false)} 
        />
      )}
      
      {showUpdateBoatForm && boatToUpdate && (
        <UpdateBoatForm 
          boat={boatToUpdate} 
          onSubmit={handleUpdateBoat} 
          onCancel={() => setShowUpdateBoatForm(false)} 
        />
      )}

      {/* Availability Manager */}
      {selectedBoat && (
        <div className="col-span-full">
          <BoatAvailabilityManager 
            boatId={selectedBoat} 
            onClose={() => setSelectedBoat(null)}
          />
        </div>
      )}
    </div>
  );
}
