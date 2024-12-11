import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/services/api';
import { BoatFeature } from '@/types/types';
import toast from 'react-hot-toast';

export function useFeatures() {
  const queryClient = useQueryClient();

  // Fetch all features
  const {
    data: features = [],
    isLoading,
    error,
  } = useQuery<BoatFeature[], Error>({
    queryKey: ['features'],
    queryFn: () => adminApi.features.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Delete feature mutation
  const {
    mutate: deleteFeature,
    isPending: isDeleting,
  } = useMutation<void, Error, number>({
    mutationFn: (id: number) => adminApi.features.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      toast.success('Feature deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting feature:', error);
      toast.error('Failed to delete feature');
    },
  });

  return {
    features,
    isLoading,
    error,
    deleteFeature,
    isDeleting,
  };
}
