import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '@/services/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Booking, createOptimisticBooking } from '@/types/types';

interface CreateBookingData {
  boatId: number;
  boatPriceId: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalPrice: number;
  specialRequests?: string;
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateBookingData) => bookingApi.createBooking(data),
    
    onMutate: async (newBooking) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['bookings'] });

      // Get current bookings
      const previousBookings = queryClient.getQueryData<Booking[]>(['bookings']);

      // Optimistically update bookings list
      queryClient.setQueryData<Booking[]>(['bookings'], (old: Booking[] | undefined) => {
        if (!old) return [createOptimisticBooking(newBooking)];
        return [...old, createOptimisticBooking(newBooking)];
      });

      return { previousBookings };
    },

    onError: (err, newBooking, context) => {
      // Rollback to previous state
      queryClient.setQueryData(['bookings'], context?.previousBookings);
      toast.error('Failed to create booking. Please try again.');
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      // Store success flag
      sessionStorage.setItem('lastBookingSuccess', 'true');
      toast.success('Booking created successfully!');
      router.push('/bookings/success');
    }
  });
} 