'use client'

import { useState } from 'react';
import Image from 'next/image';
import { 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  BellIcon, 
  UserIcon,
  XMarkIcon,
  CogIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/solid';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import Navigation from '../components/Navigation';

// Mock data (replace with real data fetching in production)
const ownerData = {
  name: "John Doe",
  totalBoats: 3,
  totalImpressions: 15000,
  totalSales: 25000,
  pendingWithdrawals: 5000,
  pendingRequests: 4,
};

const requestsData = [
  { id: 1, user: "Alice Smith", memberSince: "2021-05-15", rating: 4.8, boat: "Sunset Chaser", dates: "Aug 10 - Aug 15, 2023", additionalInfo: "First-time renter, celebrating anniversary" },
  { id: 2, user: "Bob Johnson", memberSince: "2020-11-22", rating: 4.5, boat: "Ocean Breeze", dates: "Aug 18 - Aug 22, 2023", additionalInfo: "Experienced sailor, bringing family of 4" },
  { id: 3, user: "Carol Williams", memberSince: "2022-01-30", rating: 4.9, boat: "Sea Spirit", dates: "Sep 1 - Sep 5, 2023", additionalInfo: "Corporate retreat for 10 people" },
  { id: 4, user: "David Brown", memberSince: "2021-09-10", rating: 4.7, boat: "Sunset Chaser", dates: "Sep 10 - Sep 15, 2023", additionalInfo: "Honeymoon trip, requesting special arrangements" },
];

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}

export default function OwnerPortal() {
  const [showRequests, setShowRequests] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [expandedRequest, setExpandedRequest] = useState<number | null>(null);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-8 relative">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {ownerData.name}!</h1>
          <button 
            onClick={() => setShowSettings(true)}
            className="bg-white p-2 rounded shadow hover:bg-gray-50 transition-colors"
          >
            <CogIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard icon={<BanknotesIcon className="w-6 h-6 text-blue-500" />} title="Total Boats" value={ownerData.totalBoats} />
          <DashboardCard icon={<ChartBarIcon className="w-6 h-6 text-green-500" />} title="Total Impressions" value={ownerData.totalImpressions.toLocaleString()} />
          <DashboardCard icon={<CurrencyDollarIcon className="w-6 h-6 text-yellow-500" />} title="Total Sales" value={`$${ownerData.totalSales.toLocaleString()}`} />
          <DashboardCard icon={<CurrencyDollarIcon className="w-6 h-6 text-purple-500" />} title="Pending Withdrawals" value={`$${ownerData.pendingWithdrawals.toLocaleString()}`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="h-64 bg-gray-200"></div> {/* Placeholder for a chart */}
          </div>
          <div className="bg-white shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
            <ul className="space-y-4">
              <li className="flex items-center">
                <CalendarIcon className="w-5 h-5 text-blue-500 mr-2" />
                <span>Aug 15 - Sunset Chaser</span>
              </li>
              <li className="flex items-center">
                <CalendarIcon className="w-5 h-5 text-blue-500 mr-2" />
                <span>Aug 22 - Ocean Breeze</span>
              </li>
              <li className="flex items-center">
                <CalendarIcon className="w-5 h-5 text-blue-500 mr-2" />
                <span>Sep 1 - Sea Spirit</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Pending Requests</h2>
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600 transition-colors"
              onClick={() => setShowRequests(true)}
            >
              <BellIcon className="w-5 h-5 mr-2" />
              {ownerData.pendingRequests} New
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-2 text-left">Boat</th>
                  <th className="p-2 text-left">Dates</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {requestsData.slice(0, 3).map((request) => (
                  <tr key={request.id} className="border-b">
                    <td className="p-2">{request.boat}</td>
                    <td className="p-2">{request.dates}</td>
                    <td className="p-2"><span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-sm">Pending</span></td>
                    <td className="p-2">
                      <button className="text-blue-500 hover:text-blue-700">
                        <ChatBubbleLeftIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showRequests && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Pending Requests</h2>
                <button onClick={() => setShowRequests(false)} className="text-gray-500 hover:text-gray-700">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              {requestsData.map((request) => (
                <div key={request.id} className="border-b py-4">
                  <div className="flex items-center mb-2">
                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 flex items-center justify-center">
                      <UserIcon className="w-8 h-8 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{request.user}</h3>
                      <p className="text-sm text-gray-600">Member since: {request.memberSince}</p>
                    </div>
                  </div>
                  <div className="ml-16">
                    <p><strong>Boat:</strong> {request.boat}</p>
                    <p><strong>Dates:</strong> {request.dates}</p>
                    <p><strong>User Rating:</strong> {request.rating}/5</p>
                    {expandedRequest === request.id && (
                      <div className="mt-2 bg-gray-50 p-3 rounded">
                        <p><strong>Additional Info:</strong> {request.additionalInfo}</p>
                      </div>
                    )}
                    <div className="mt-2 flex items-center">
                      <button className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600 transition-colors">Accept</button>
                      <button className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600 transition-colors">Decline</button>
                      <button 
                        onClick={() => setExpandedRequest(expandedRequest === request.id ? null : request.id)}
                        className="text-blue-500 flex items-center hover:text-blue-700"
                      >
                        {expandedRequest === request.id ? (
                          <>
                            <ChevronUpIcon className="w-5 h-5 mr-1" />
                            Less Details
                          </>
                        ) : (
                          <>
                            <ChevronDownIcon className="w-5 h-5 mr-1" />
                            More Details
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Settings</h2>
                <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-gray-700">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" id="name" name="name" className="mt-1 block w-full border-gray-300 rounded shadow-sm" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" id="email" name="email" className="mt-1 block w-full border-gray-300 rounded shadow-sm" />
                </div>
                <div>
                  <label htmlFor="notifications" className="block text-sm font-medium text-gray-700">Notification Preferences</label>
                  <select id="notifications" name="notifications" className="mt-1 block w-full border-gray-300 rounded shadow-sm">
                    <option>All notifications</option>
                    <option>Important only</option>
                    <option>None</option>
                  </select>
                </div>
                <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardCard({ icon, title, value }: DashboardCardProps) {
  return (
    <div className="bg-white shadow p-6 flex items-center">
      <div className="mr-4">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}