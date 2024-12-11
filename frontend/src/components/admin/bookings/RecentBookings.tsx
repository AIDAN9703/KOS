import { Booking } from '@/types/types';

interface RecentBookingsProps {
  bookings: Booking[];
}

export default function RecentBookings({ bookings }: RecentBookingsProps) {
  return (
    <div className="bg-[#1e2738] rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-white mb-4">Recent Bookings</h3>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="flex justify-between items-center p-4 bg-[#2a3441] rounded-lg">
            <div>
              <p className="font-medium text-white">{booking.boat.name}</p>
              <p className="text-sm text-gray-400">
                {new Date(booking.startDate).toLocaleDateString()} - 
                {new Date(booking.endDate).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium
              ${booking.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'}`}
            >
              {booking.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 