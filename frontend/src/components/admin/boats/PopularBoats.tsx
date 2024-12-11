import { Boat } from '@/types/types';

interface PopularBoatsProps {
  boats: Boat[];
}

export default function PopularBoats({ boats }: PopularBoatsProps) {
  const formatRating = (rating: number | null | undefined) => {
    if (typeof rating === 'number') {
      return rating.toFixed(1);
    }
    return 'N/A';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Boats</h3>
      <div className="space-y-4">
        {boats.map((boat) => (
          <div key={boat.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">{boat.name}</p>
              <p className="text-sm text-gray-500">{boat.type} • {boat.location}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">{boat.totalBookings} bookings</p>
              <p className="text-sm text-gray-500">★ {formatRating(boat.averageRating)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 