import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, queryKeys } from '@/services/api';
import { User, ApiResponse } from '@/types/types';
import toast from 'react-hot-toast';

export function useSecurity() {
  const queryClient = useQueryClient();

  const { mutate: changePassword, isPending: isChangingPassword } = useMutation<
    ApiResponse<void>,
    Error,
    { currentPassword: string; newPassword: string }
  >({
    mutationFn: userApi.security.changePassword,
    onSuccess: (response) => {
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to change password');
    }
  });

  const { mutate: updateTwoFactor, isPending: isUpdatingTwoFactor } = useMutation<
    ApiResponse<User>,
    Error,
    boolean
  >({
    mutationFn: userApi.security.updateTwoFactor,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      toast.success(response.message);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update two-factor authentication');
    }
  });

  return {
    changePassword,
    updateTwoFactor,
    isChangingPassword,
    isUpdatingTwoFactor
  };
} 