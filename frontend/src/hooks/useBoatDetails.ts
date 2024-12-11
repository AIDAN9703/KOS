import { useQuery } from '@tanstack/react-query';
import { boatsApi } from '@/services/api';
import { Boat, UserRole } from '@/types/types';

interface ApiBoat extends Omit<Boat, 'owner' | 'ownerId' | 'ownerRole'> {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    profileImage?: string;
    bio?: string;
    role: UserRole;
  };
}

export const useBoatDetails = (id: string | number) => {
  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['boat', id],
    queryFn: () => boatsApi.getById(Number(id)),
    select: (response) => {
      if (!response.data) return response;

      const boatData = response.data as ApiBoat;
      
      // Map the user data to owner and ownerRole
      const boat: Boat = {
        ...boatData,
        ownerId: boatData.user.id,
        owner: boatData.user,
        ownerRole: boatData.user.role,
      };

      return { ...response, data: boat };
    },
    enabled: !!id,
    retry: 2
  });

  return {
    boat: response?.data,
    isLoading,
    error,
    refetch
  };
}; 