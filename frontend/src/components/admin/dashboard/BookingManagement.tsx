'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { BookingManagementComponent } from '@/types/components';
import { adminApi } from '@/services/api';
import toast from 'react-hot-toast';

const BookingManagement: BookingManagementComponent = ({ bookings, onUpdateStatus }) => {
  const [expandedBooking, setExpandedBooking] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    try {
      await adminApi.updateBookingStatus(bookingId, newStatus);
      await onUpdateStatus(bookingId, newStatus);
      toast.success(`Booking status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Booking Management
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => setExpandedBooking(
                expandedBooking === booking.id ? null : booking.id
              )}
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#21336a] truncate">
                      {booking.boat?.name || 'Unnamed Boat'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(booking.startDate), 'PPP')} - {format(new Date(booking.endDate), 'PPP')}
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <select
                      value={booking.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStatusChange(booking.id, e.target.value);
                      }}
                      className={`
                        rounded-full px-3 py-1 text-sm font-semibold
                        ${getStatusColor(booking.status)}
                      `}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                
                {expandedBooking === booking.id && (
                  <div className="mt-4 text-sm text-gray-600">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p><strong>Customer:</strong> {booking.user?.name || 'Unknown'}</p>
                        <p><strong>Email:</strong> {booking.user?.email || 'N/A'}</p>
                        <p><strong>Phone:</strong> {booking.user?.phoneNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <p><strong>Duration:</strong> {booking.duration} hours</p>
                        <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
                        <p><strong>Created:</strong> {format(new Date(booking.createdAt), 'PPP')}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BookingManagement; 