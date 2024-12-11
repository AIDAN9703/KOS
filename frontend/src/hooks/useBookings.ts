import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, queryKeys } from '@/services/api';
import { Booking, BookingStatus, ApiResponse, PaginatedApiResponse } from '@/types/types';
import toast from 'react-hot-toast';

interface UseBookingsParams {
  page?: number;
  search?: string;
  status?: BookingStatus;
  startDate?: string;
  endDate?: string;
}

interface BookingAnalytics {
  totalBookings: number;
  recentBookings: number;
  canceledBookings: number;
  totalRevenue: number;
  cancellationRate: number;
}

export function useBookings(params?: UseBookingsParams) {
  const queryClient = useQueryClient();

  const { 
    data: bookingsData,
    isLoading,
    error 
  } = useQuery<PaginatedApiResponse<Booking[]>, Error>({
    queryKey: [...queryKeys.bookings, params],
    queryFn: () => adminApi.bookings.getAll(params),
    gcTime: 0,
    retry: false,
  });

  if (error) {
    toast.error(error.message || 'Failed to fetch bookings');
  }

  // Get upcoming bookings
  const { data: upcomingData } = useQuery<ApiResponse<Booking[]>>({
    queryKey: ['upcoming-bookings'],
    queryFn: () => adminApi.bookings.getUpcoming(),
    enabled: false
  });

  // Get analytics
  const { data: analyticsData } = useQuery<ApiResponse<BookingAnalytics>>({
    queryKey: ['booking-analytics'],
    queryFn: () => adminApi.bookings.getAnalytics()
  });

  // Update booking status
  const updateStatus = useMutation<
    ApiResponse<Booking>,
    Error,
    { id: number; status: BookingStatus; note?: string }
  >({
    mutationFn: ({ id, status, note }) =>
      adminApi.bookings.updateStatus(id, status, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success('Booking status updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update booking status');
      console.error('Error updating booking status:', error);
    }
  });

  // Add note to booking
  const addNote = useMutation<
    ApiResponse<Booking>,
    Error,
    { id: number; note: string }
  >({
    mutationFn: ({ id, note }) =>
      adminApi.bookings.addNote(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success('Note added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add note');
      console.error('Error adding note:', error);
    }
  });

  // Reassign booking
  const reassignBooking = useMutation<
    ApiResponse<Booking>,
    Error,
    { id: number; newBoatId: number }
  >({
    mutationFn: ({ id, newBoatId }) =>
      adminApi.bookings.reassign(id, newBoatId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success('Booking reassigned successfully');
    },
    onError: (error) => {
      toast.error('Failed to reassign booking');
      console.error('Error reassigning booking:', error);
    }
  });

  // Bulk update bookings
  const bulkUpdate = useMutation<
    ApiResponse<Booking[]>,
    Error,
    { bookingIds: number[]; data: Partial<Booking> }
  >({
    mutationFn: ({ bookingIds, data }) =>
      adminApi.bookings.bulkUpdate(bookingIds, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success('Bookings updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update bookings');
      console.error('Error updating bookings:', error);
    }
  });

  // Generate report
  const generateReport = useMutation<
    ApiResponse<Blob | any>,
    Error,
    { startDate: string; endDate: string; format: 'json' | 'csv' | 'pdf' }
  >({
    mutationFn: ({ startDate, endDate, format }) => 
      adminApi.bookings.generateReport(startDate, endDate, format),
    onSuccess: (response, variables) => {
      if (variables.format === 'json') {
        toast.success('Report generated successfully');
      } else {
        const blob = new Blob([response.data], { 
          type: `application/${variables.format}` 
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `booking-report.${variables.format}`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    },
    onError: (error) => {
      toast.error('Failed to generate report');
      console.error('Error generating report:', error);
    }
  });

  const updateBooking = useMutation<
    ApiResponse<Booking>,
    Error,
    { id: number; data: Partial<Booking> }
  >({
    mutationFn: ({ id, data }) => adminApi.bookings.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings });
      toast.success('Booking updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update booking');
      console.error('Error updating booking:', error);
    }
  });

  return {
    bookings: bookingsData?.data ? Array.isArray(bookingsData.data) ? bookingsData.data : [bookingsData.data] : [],
    pagination: bookingsData?.pagination,
    upcomingBookings: upcomingData?.data || [],
    analytics: analyticsData?.data,
    isLoading,
    error,
    updateStatus,
    addNote,
    reassignBooking,
    bulkUpdate,
    generateReport,
    updateBooking
  };
} 