import { useState, useEffect } from 'react';
import { useApi } from '@/components/auth/AuthProvider';
import { Boat } from '@/types/boat';

interface UseBoatDetailsReturn {
  boat: Boat | null;
  isLoading: boolean;
  error: string | null;
  bookedDates: string[];
  refreshAvailability: () => Promise<void>;
}

export function useBoatDetails(boatId: string): UseBoatDetailsReturn {
  const [boat, setBoat] = useState<Boat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const api = useApi();

  const fetchBoatData = async () => {
    try {
      setIsLoading(true);
      const [boatResponse, availabilityResponse] = await Promise.all([
        api.get<Boat>(`/api/boats/${boatId}`),
        api.get<string[]>(`/api/boats/${boatId}/availability`)
      ]);

      setBoat(boatResponse.data);
      setBookedDates(availabilityResponse.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch boat details');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAvailability = async () => {
    try {
      const response = await api.get<string[]>(`/api/boats/${boatId}/availability`);
      setBookedDates(response.data);
    } catch (err: any) {
      console.error('Failed to refresh availability:', err);
    }
  };

  useEffect(() => {
    if (boatId) {
      fetchBoatData();
    }
  }, [boatId]);

  return {
    boat,
    isLoading,
    error,
    bookedDates,
    refreshAvailability
  };
} 