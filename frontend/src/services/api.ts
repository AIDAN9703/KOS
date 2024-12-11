import axios from 'axios';
import { 
  User, 
  Boat, 
  BoatStatus, 
  Booking,
  ApiResponse,
  PaginatedApiResponse,
  BoatFeature,
  BookingStatus,
  BoatPrice,
} from '@/types/types';
import { Review, ReviewStats } from '@/types/review';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const queryKeys = {
  profile: ['profile'],
  users: ['users'],
  boats: ['boats'],
  bookings: ['bookings'],
  features: ['features']
};

export const userApi = {
  profile: {
    get: async (): Promise<ApiResponse<User>> => {
      const { data } = await api.get('/api/users/profile');
      return {
        data,
        message: 'Profile fetched successfully'
      };
    },
    update: async (profileData: Partial<User>): Promise<ApiResponse<User>> => {
      const { data } = await api.put('/api/users/profile', profileData);
      return {
        data,
        message: 'Profile updated successfully'
      };
    }
  },
  security: {
    changePassword: async (data: { 
      currentPassword: string; 
      newPassword: string; 
    }): Promise<ApiResponse<void>> => {
      const response = await api.put('/api/users/change-password', data);
      return {
        data: undefined,
        message: 'Password changed successfully'
      };
    },
    updateTwoFactor: async (enabled: boolean): Promise<ApiResponse<User>> => {
      const response = await api.put('/api/users/two-factor', { enabled });
      return {
        data: response.data,
        message: 'Two-factor authentication settings updated'
      };
    }
  },
  getPublicProfile: async (userId: number): Promise<ApiResponse<User>> => {
    const { data } = await api.get(`/api/users/${userId}/public`);
    return {
      data,
      message: 'Public profile fetched successfully'
    };
  }
};

export const adminApi = {
  users: {
    getAll: async (params?: { 
      page?: number; 
      search?: string; 
      role?: string; 
    }): Promise<PaginatedApiResponse<User>> => {
      const { data } = await api.get('/api/admin/users', { params });
      return {
        data: data.data,
        pagination: data.pagination,
        message: 'Users fetched successfully'
      };
    },
    update: async ({ userId, data }: { 
      userId: number; 
      data: Partial<User> 
    }): Promise<ApiResponse<User>> => {
      const response = await api.put(`/api/admin/users/${userId}`, data);
      return {
        data: response.data,
        message: 'User updated successfully'
      };
    },
    delete: async (userId: number): Promise<ApiResponse<void>> => {
      await api.delete(`/api/admin/users/${userId}`);
      return {
        data: undefined,
        message: 'User deleted successfully'
      };
    },
    suspend: async (userId: number): Promise<ApiResponse<User>> => {
      const { data } = await api.put(`/api/admin/users/${userId}/suspend`);
      return {
        data,
        message: 'User suspended successfully'
      };
    }
  },
  boats: {
    getAll: async (params?: { 
      page?: number;
      limit?: number;
      status?: BoatStatus;
      search?: string;
    }): Promise<PaginatedApiResponse<Boat>> => {
      const { data } = await api.get('/api/admin/boats', { params });
      return {
        data: data.boats,
        pagination: data.pagination,
        message: 'Boats fetched successfully'
      };
    },
    create: async (boatData: FormData): Promise<ApiResponse<Boat>> => {
      const { data } = await api.post('/api/admin/boats', boatData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return {
        data,
        message: 'Boat created successfully'
      };
    },
    update: async (boatId: number, boatData: FormData): Promise<ApiResponse<Boat>> => {
      const { data } = await api.put(`/api/admin/boats/${boatId}`, boatData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return {
        data,
        message: 'Boat updated successfully'
      };
    },
    delete: async (boatId: number): Promise<ApiResponse<void>> => {
      await api.delete(`/api/admin/boats/${boatId}`);
      return {
        data: undefined,
        message: 'Boat deleted successfully'
      };
    },
    updateStatus: async (boatId: number, status: BoatStatus): Promise<ApiResponse<Boat>> => {
      const { data } = await api.put(`/api/admin/boats/${boatId}/status`, { status });
      return {
        data,
        message: 'Boat status updated successfully'
      };
    }
  },
  bookings: {
    getAll: async (params?: { 
      page?: number; 
      search?: string; 
      status?: BookingStatus;
      startDate?: string;
      endDate?: string;
    }): Promise<PaginatedApiResponse<Booking[]>> => {
      const { data } = await api.get('/api/admin/bookings', { params });
      return {
        data: data.bookings,
        pagination: data.pagination,
        message: 'Bookings fetched successfully'
      };
    },

    getById: async (id: number): Promise<ApiResponse<Booking>> => {
      const { data } = await api.get(`/api/admin/bookings/${id}`);
      return {
        data,
        message: 'Booking fetched successfully'
      };
    },

    getUserBookings: async (userId: number): Promise<ApiResponse<Booking[]>> => {
      const { data } = await api.get(`/api/admin/bookings/user/${userId}`);
      return {
        data,
        message: 'User bookings fetched successfully'
      };
    },

    updateStatus: async (id: number, status: BookingStatus, note?: string): Promise<ApiResponse<Booking>> => {
      const { data } = await api.put(`/api/admin/bookings/${id}/status`, { status, note });
      return {
        data,
        message: 'Booking status updated successfully'
      };
    },

    bulkUpdate: async (bookingIds: number[], updateData: Partial<Booking>): Promise<ApiResponse<Booking[]>> => {
      const { data } = await api.post('/api/admin/bookings/bulk-update', {
        bookingIds,
        data: updateData
      });
      return {
        data,
        message: 'Bookings updated successfully'
      };
    },

    getHistory: async (id: number): Promise<ApiResponse<Booking>> => {
      const { data } = await api.get(`/api/admin/bookings/${id}/history`);
      return {
        data,
        message: 'Booking history fetched successfully'
      };
    },

    addNote: async (id: number, note: string): Promise<ApiResponse<Booking>> => {
      const { data } = await api.post(`/api/admin/bookings/${id}/notes`, { note });
      return {
        data,
        message: 'Note added successfully'
      };
    },

    getUpcoming: async (days?: number): Promise<ApiResponse<Booking[]>> => {
      const { data } = await api.get('/api/admin/bookings/upcoming', {
        params: { days }
      });
      return {
        data,
        message: 'Upcoming bookings fetched successfully'
      };
    },

    getCanceled: async (startDate?: string, endDate?: string): Promise<ApiResponse<Booking[]>> => {
      const { data } = await api.get('/api/admin/bookings/canceled', {
        params: { startDate, endDate }
      });
      return {
        data,
        message: 'Canceled bookings fetched successfully'
      };
    },

    reassign: async (id: number, newBoatId: number): Promise<ApiResponse<Booking>> => {
      const { data } = await api.put(`/api/admin/bookings/${id}/reassign`, { newBoatId });
      return {
        data,
        message: 'Booking reassigned successfully'
      };
    },

    getAnalytics: async (): Promise<ApiResponse<{
      totalBookings: number;
      recentBookings: number;
      canceledBookings: number;
      totalRevenue: number;
      cancellationRate: number;
    }>> => {
      const { data } = await api.get('/api/admin/bookings/analytics');
      return {
        data,
        message: 'Booking analytics fetched successfully'
      };
    },

    generateReport: async (
      startDate: string, 
      endDate: string, 
      format: 'json' | 'csv' | 'pdf' = 'json'
    ): Promise<ApiResponse<any>> => {
      const { data } = await api.get('/api/admin/bookings/reports', {
        params: { startDate, endDate, format },
        responseType: format === 'json' ? 'json' : 'blob'
      });
      return {
        data,
        message: 'Report generated successfully'
      };
    },

    update: async (id: number, data: Partial<Booking>): Promise<ApiResponse<Booking>> => {
      const { data: responseData } = await api.put(`/api/admin/bookings/${id}`, data);
      return {
        data: responseData,
        message: 'Booking updated successfully'
      };
    }
  },
  statistics: {
    getDashboard: async (): Promise<ApiResponse<{
      totalBoats: number;
      totalBookings: number;
      totalUsers: number;
      recentBookings: Booking[];
      recentUsers: User[];
      popularBoats: Boat[];
    }>> => {
      const { data } = await api.get('/api/admin/statistics/dashboard');
      return {
        data,
        message: 'Dashboard statistics fetched successfully'
      };
    }
  },
  features: {
    getAll: async () => {
      const { data } = await api.get('/api/admin/features');
      return data;
    },
    create: async (feature: Omit<BoatFeature, 'id'>) => {
      const { data } = await api.post('/api/admin/features', feature);
      return data;
    },
    update: async (id: number, feature: Partial<BoatFeature>) => {
      const { data } = await api.put(`/api/admin/features/${id}`, feature);
      return data;
    },
    delete: async (id: number) => {
      const { data } = await api.delete(`/api/admin/features/${id}`);
      return data;
    }
  }
};

export const bookingApi = {
  createBooking: async (data: {
    boatId: number;
    boatPriceId: number;
    startDate: string;
    endDate: string;
    duration: number;
    totalPrice: number;
    specialRequests?: string;
  }): Promise<ApiResponse<Booking>> => {
    const response = await api.post('/api/bookings', data);
    return {
      data: response.data,
      message: 'Booking created successfully'
    };
  },

  getUserBookings: async (): Promise<ApiResponse<Booking[]>> => {
    const { data } = await api.get('/api/bookings/user');
    return {
      data,
      message: 'User bookings fetched successfully'
    };
  },

  cancelBooking: async (bookingId: number): Promise<ApiResponse<void>> => {
    const { data } = await api.put(`/api/bookings/${bookingId}/cancel`);
    return {
      data,
      message: 'Booking cancelled successfully'
    };
  },

  getBookingDetails: async (bookingId: number): Promise<ApiResponse<Booking>> => {
    const { data } = await api.get(`/api/bookings/${bookingId}`);
    return {
      data,
      message: 'Booking details fetched successfully'
    };
  },

  getPricing: async (boatId: number, startDate: string, endDate: string): Promise<ApiResponse<{
    basePrice: number;
    totalPrice: number;
    fees: { [key: string]: number };
  }>> => {
    const { data } = await api.get(`/api/bookings/pricing/${boatId}`, {
      params: { startDate, endDate }
    });
    return {
      data,
      message: 'Pricing calculated successfully'
    };
  },

  getBoatReviews: async (boatId: number): Promise<ApiResponse<Review[]>> => {
    const { data } = await api.get(`/api/boats/${boatId}/reviews`);
    return {
      data,
      message: 'Reviews fetched successfully'
    };
  },

  getBoatReviewStats: async (boatId: number): Promise<ApiResponse<ReviewStats>> => {
    const { data } = await api.get(`/api/boats/${boatId}/review-stats`);
    return {
      data,
      message: 'Review stats fetched successfully'
    };
  }
};

export const boatsApi = {
  getById: async (id: number): Promise<ApiResponse<BoatWithUser>> => {
    const { data } = await api.get(`/api/boats/${id}`);
    return {
      data,
      message: 'Boat fetched successfully'
    };
  },
  
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: BoatStatus;
  }): Promise<PaginatedApiResponse<Boat>> => {
    const { data } = await api.get('/api/boats', { params });
    return {
      data: data.boats,
      pagination: data.pagination,
      message: 'Boats fetched successfully'
    };
  },

  getAvailability: async (boatId: number, startDate: string, endDate: string): Promise<ApiResponse<{
    available: boolean;
    conflictingBookings: any[];
  }>> => {
    const { data } = await api.get(`/api/boats/${boatId}/availability`, {
      params: { startDate, endDate }
    });
    return {
      data,
      message: 'Availability fetched successfully'
    };
  },

  getPricing: async (boatId: number, date: string): Promise<ApiResponse<{
    prices: BoatPrice[];
  }>> => {
    const { data } = await api.get(`/api/boats/${boatId}/prices`, {
      params: { date }
    });
    return {
      data,
      message: 'Pricing fetched successfully'
    };
  },

  getReviewStats: async (boatId: number): Promise<ApiResponse<ReviewStats>> => {
    const { data } = await api.get(`/api/boats/${boatId}/review-stats`);
    return {
      data,
      message: 'Review stats fetched successfully'
    };
  }
}; 