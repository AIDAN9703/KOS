import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, queryKeys } from '@/services/api';
import { User, ApiResponse, PaginatedApiResponse } from '@/types/types';
import toast from 'react-hot-toast';

export function useUsers(params?: { 
  page?: number; 
  search?: string; 
  role?: string;
}) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<PaginatedApiResponse<User>, Error>({
    queryKey: [...queryKeys.users, params],
    queryFn: () => adminApi.users.getAll(params),
    gcTime: 0,
    retry: false,
  });

  if (isError) {
    toast.error(error.message || 'Failed to fetch users');
  }

  const { mutate: updateUser } = useMutation<
    ApiResponse<User>,
    Error,
    { userId: number; data: Partial<User> }
  >({
    mutationFn: adminApi.users.update,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update user');
    }
  });

  const { mutate: deleteUser } = useMutation<
    ApiResponse<void>,
    Error,
    number
  >({
    mutationFn: adminApi.users.delete,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete user');
    }
  });

  const { mutate: suspendUser } = useMutation<
    ApiResponse<User>,
    Error,
    number
  >({
    mutationFn: adminApi.users.suspend,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to suspend user');
    }
  });

  return {
    users: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    isError,
    error,
    updateUser,
    deleteUser,
    suspendUser
  };
} 