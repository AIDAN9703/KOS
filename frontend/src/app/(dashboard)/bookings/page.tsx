'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Booking {
  id: number;
  startDate: string;
  endDate: string;
  duration: number;
  totalPrice: number;
  status: string;
  boat: {
    id: number;
    name: string;
    type: string;
  };
}

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/my-bookings`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {bookings.map((booking) => (
            <li key={booking.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {booking.boat.name}
                  </h2>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Date: {format(new Date(booking.startDate), 'PPP')}</p>
                    <p>Duration: {booking.duration} hours</p>
                    <p>Total Price: ${booking.totalPrice}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`
                    px-3 py-1 rounded-full text-sm font-semibold
                    ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}
                  `}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                  {booking.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 