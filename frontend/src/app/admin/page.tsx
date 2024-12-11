'use client';

import { useEffect, useState } from 'react';
import { useBookings } from '@/hooks/useBookings';
import { useBoats } from '@/hooks/useBoats';
import { useUsers } from '@/hooks/useUsers';
import { Boat, Booking, User } from '@/types/types';
import toast from 'react-hot-toast';
import { MdTrendingUp, MdPeople, MdAttachMoney, MdDirectionsBoat } from 'react-icons/md';
import Image from 'next/image';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboardPage() {
  const { bookings, analytics } = useBookings();
  const { boats } = useBoats();
  const { users } = useUsers();

  const [stats, setStats] = useState({
    totalBoats: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentBookings: [] as Booking[],
    recentUsers: [] as User[],
    popularBoats: [] as Boat[]
  });

  useEffect(() => {
    if (bookings && boats && users && analytics) {
      const bookingsArray = Array.isArray(bookings) ? bookings : [];
      
      setStats({
        totalBoats: boats.length,
        totalBookings: analytics.totalBookings || bookingsArray.length,
        totalUsers: users.length,
        totalRevenue: analytics.totalRevenue || 0,
        recentBookings: bookingsArray
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 7),
        recentUsers: users.slice(0, 4),
        popularBoats: boats.slice(0, 5)
      });
    }
  }, [bookings, boats, users, analytics]);

  // Chart configurations
  const bookingDistributionData = {
    labels: ['Direct Bookings', 'Partner Bookings'],
    datasets: [{
      data: [70, 30],
      backgroundColor: ['#4169E1', '#FF69B4'],
      borderWidth: 0,
    }]
  };

  const bookingStatsData = {
    labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
    datasets: [{
      data: [45, 35, 40, 50, 45, 60],
      backgroundColor: '#4169E1',
    }]
  };

  const revenueData = {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Yacht Revenue',
        data: [65, 59, 80, 81, 90],
        borderColor: '#00FF00',
        tension: 0.4,
      },
      {
        label: 'Charter Revenue',
        data: [28, 48, 40, 59, 86],
        borderColor: '#0000FF',
        tension: 0.4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: '#2A3441'
        },
        ticks: {
          color: '#94A3B8'
        }
      },
      y: {
        grid: {
          color: '#2A3441'
        },
        ticks: {
          color: '#94A3B8'
        }
      },
    },
  };

  return (
    <div className="space-y-6 bg-[#1a2234] p-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue.toLocaleString()}
          trend="+14%"
          icon={<MdAttachMoney className="w-6 h-6" />}
          color="bg-red-500"
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          trend={"+1.5%"}
          icon={<MdTrendingUp className="w-6 h-6" />}
          color="bg-green-500"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          trend={"+2.1%"}
          icon={<MdPeople className="w-6 h-6" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Total Boats"
          value={stats.totalBoats}
          trend={"+4.8%"}
          icon={<MdDirectionsBoat className="w-6 h-6" />}
          color="bg-pink-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1e2738] rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4 text-white">Booking Distribution</h3>
          <div className="h-[500px] flex items-center justify-center">
            <div className="w-full max-w-[500px] items-center">
              <Doughnut 
                data={bookingDistributionData} 
                options={{
                  ...chartOptions,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom' as const,
                      labels: {
                        color: 'white',
                        padding: 10,
                        font: {
                          size: 14
                        }
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-[#1e2738] rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4 text-white">Booking Statistics</h3>
            <div className="h-[200px]">
              <Bar data={bookingStatsData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-[#1e2738] rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4 text-white">Revenue Trends</h3>
            <div className="h-[200px]">
              <Line data={revenueData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.recentUsers.map((user) => (
          <div key={user.id} className="bg-[#1e2738] rounded-lg shadow p-4">
            <div className="flex items-center space-x-3">
              {user.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt={user.firstName || 'User'}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
              )}
              <div>
                <p className="font-medium text-white">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Latest Bookings Table */}
      <div className="bg-[#1e2738] rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4 text-white">Latest Bookings</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-sm text-gray-400">
                <th className="pb-3">#</th>
                <th className="pb-3">Booking ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Boat</th>
                <th className="pb-3">Dates</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Total</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {stats.recentBookings.map((booking, index) => (
                <tr key={booking.id} className="border-t border-gray-700">
                  <td className="py-3 text-gray-300">{index + 1}</td>
                  <td className="text-gray-300">KOS-{booking.id}</td>
                  <td className="text-gray-300">
                    {booking.user?.firstName} {booking.user?.lastName}
                  </td>
                  <td className="text-gray-300">
                    {booking.boat?.name || `Boat #${booking.boatId}`}
                  </td>
                  <td className="text-gray-300">
                    {booking.startDate ? (
                      <>
                        {new Date(booking.startDate).toLocaleDateString()} - 
                        {booking.endDate ? new Date(booking.endDate).toLocaleDateString() : 'N/A'}
                      </>
                    ) : 'N/A'}
                  </td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      booking.status === 'CONFIRMED' 
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : booking.status === 'CANCELLED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="text-gray-300">
                    ${booking.totalPrice?.toLocaleString() || '0'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// StatCard component
function StatCard({ title, value, trend, icon, color }: { 
  title: string; 
  value: number; 
  trend: string;
  icon: React.ReactNode; 
  color: string; 
}) {
  return (
    <div className="bg-[#1e2738] rounded-lg shadow p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <h3 className="text-2xl font-semibold mt-1 text-white">
            {title === "Total Revenue" ? `$${value.toLocaleString()}` : value.toLocaleString()}
          </h3>
          <p className="text-xs text-green-500 mt-2">{trend} from last week</p>
        </div>
        <div className={`${color} p-2 rounded-full text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
