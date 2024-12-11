import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, queryKeys } from '@/services/api';
import { User, ApiResponse } from '@/types/types';
import toast from 'react-hot-toast';

export function useProfile() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<ApiResponse<User>, Error>({
    queryKey: queryKeys.profile,
    queryFn: async () => {
      const response = await userApi.profile.get();
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const { mutate: updateProfile } = useMutation<
    ApiResponse<User>,
    Error,
    Partial<User>
  >({
    mutationFn: async (updateData) => {
      const response = await userApi.profile.update(updateData);
      return response;
    },
    onSuccess: (response) => {
      queryClient.setQueryData<ApiResponse<User>>(queryKeys.profile, response);
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });

  return {
    user: data?.data,
    isLoading,
    error,
    updateProfile,
  };
} 