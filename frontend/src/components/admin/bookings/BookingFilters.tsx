import { BookingStatus } from '@/types/types';
import { useState } from 'react';

interface BookingFiltersProps {
  onFilterChange: (filters: BookingFilters) => void;
}

export interface BookingFilters {
  search: string;
  status: BookingStatus | '';
  startDate: string;
  endDate: string;
}

export function BookingFilters({ onFilterChange }: BookingFiltersProps) {
  const [filters, setFilters] = useState<BookingFilters>({
    search: '',
    status: '',
    startDate: '',
    endDate: ''
  });

  const handleChange = (key: keyof BookingFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-[#1e2738] p-4 rounded-lg shadow space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search bookings..."
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="border rounded px-3 py-2 bg-[#1e2738] border-gray-700 text-white placeholder-gray-400"
        />

        <select
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="border rounded px-3 py-2 bg-[#1e2738] border-gray-700 text-white"
        >
          <option value="">All Statuses</option>
          {Object.values(BookingStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
          className="border rounded px-3 py-2 bg-[#1e2738] border-gray-700 text-white"
        />

        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
          className="border rounded px-3 py-2 bg-[#1e2738] border-gray-700 text-white"
        />
      </div>
    </div>
  );
} 