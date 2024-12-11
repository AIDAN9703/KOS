import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Booking {
  id: number;
  startDate: string;
  endDate: string;
  status: string;
  totalPrice: number;
  Boat: {
    name: string;
    type: string;
  };
}

const UserBookingHistory: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/user/bookings', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Your Booking History</h2>
      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li key={booking.id} className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-semibold">{booking.Boat.name} ({booking.Boat.type})</h3>
              <p>Dates: {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</p>
              <p>Status: {booking.status}</p>
              <p>Total Price: ${booking.totalPrice}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserBookingHistory;
