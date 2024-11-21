'use client';

import React from 'react';
import {
  BarChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface AnalyticsProps {
  bookings: any[];
  boats: any[];
}

export default function Analytics({ bookings, boats }: AnalyticsProps) {
  // Calculate analytics data
  const revenueByMonth = bookings.reduce((acc, booking) => {
    const month = new Date(booking.startDate).toLocaleString('default', { month: 'long' });
    acc[month] = (acc[month] || 0) + booking.totalPrice;
    return acc;
  }, {});

  const bookingsByBoat = bookings.reduce((acc, booking) => {
    acc[booking.Boat.name] = (acc[booking.Boat.name] || 0) + 1;
    return acc;
  }, {});

  const revenueData = Object.entries(revenueByMonth).map(([month, revenue]) => ({
    month,
    revenue
  }));

  const bookingsData = Object.entries(bookingsByBoat).map(([boat, count]) => ({
    boat,
    bookings: count
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
        <LineChart width={500} height={300} data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#21336a" />
        </LineChart>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Bookings by Boat</h3>
        <BarChart width={500} height={300} data={bookingsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="boat" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="bookings" fill="#21336a" />
        </BarChart>
      </div>

      <div className="bg-white p-6 rounded-lg shadow col-span-2">
        <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-[#21336a]">
              ${bookings.reduce((sum, b) => sum + b.totalPrice, 0).toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Bookings</p>
            <p className="text-2xl font-bold text-green-600">{bookings.length}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600">Active Boats</p>
            <p className="text-2xl font-bold text-yellow-600">{boats.length}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Avg. Booking Value</p>
            <p className="text-2xl font-bold text-purple-600">
              ${(bookings.reduce((sum, b) => sum + b.totalPrice, 0) / bookings.length || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 