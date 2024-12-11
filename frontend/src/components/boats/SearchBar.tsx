import { useState } from 'react';
import { FiSearch, FiCalendar, FiUsers, FiMapPin } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({
    location: '',
    dates: {
      start: null,
      end: null
    },
    guests: ''
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchParams.location) params.append('location', searchParams.location);
    if (searchParams.guests) params.append('guests', searchParams.guests);
    if (searchParams.dates.start) params.append('startDate', searchParams.dates.start.toISOString());
    if (searchParams.dates.end) params.append('endDate', searchParams.dates.end.toISOString());

    router.push(`/our-fleet?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      {/* Search inputs */}
    </div>
  );
} 