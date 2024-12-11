import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/services/api';
import { Boat, BoatStatus, BoatFormData } from '@/types/types';
import toast from 'react-hot-toast';

interface UseBoatsParams {
  page?: number;
  search?: string;
  status?: BoatStatus;
}

export function useBoats({ page = 1, search, status }: UseBoatsParams = {}) {
  const queryClient = useQueryClient();
  
  const { data, isLoading } = useQuery({
    queryKey: ['boats', { page, search, status }],
    queryFn: () => adminApi.boats.getAll({ page, search, status }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createBoatMutation = useMutation({
    mutationFn: (formData: FormData) => adminApi.boats.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boats'] });
      toast.success('Boat created successfully');
    },
    onError: (error) => {
      console.error('Error creating boat:', error);
      toast.error('Failed to create boat');
    }
  });

  const updateBoatMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) => 
      adminApi.boats.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boats'] });
      toast.success('Boat updated successfully');
    },
    onError: (error) => {
      console.error('Error updating boat:', error);
      toast.error('Failed to update boat');
    }
  });

  const deleteBoatMutation = useMutation({
    mutationFn: (id: number) => adminApi.boats.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boats'] });
      toast.success('Boat deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting boat:', error);
      toast.error('Failed to delete boat');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ boatId, status }: { boatId: number; status: BoatStatus }) => 
      adminApi.boats.updateStatus(boatId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boats'] });
      toast.success('Boat status updated successfully');
    },
    onError: (error) => {
      console.error('Error updating boat status:', error);
      toast.error('Failed to update boat status');
    }
  });

  return {
    boats: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    createBoat: createBoatMutation.mutate,
    updateBoat: updateBoatMutation.mutate,
    deleteBoat: deleteBoatMutation.mutate,
    updateStatus: updateStatusMutation.mutate,
    isCreating: createBoatMutation.isLoading,
    isUpdating: updateBoatMutation.isLoading,
    isDeleting: deleteBoatMutation.isLoading
  };
} 