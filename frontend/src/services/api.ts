import axios from 'axios';
import { Boat } from '@/types/boat';
import { Booking } from '@/types/booking';
import { User } from '@/types/auth';
import { CheckoutData, StripeCheckoutResponse, StripeVerificationResponse } from '@/types/payment';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Configure axios with default settings
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Booking API methods
export const bookingApi = {
  createCheckoutSession: (data: CheckoutData) => 
    api.post<StripeCheckoutResponse>('/api/stripe/create-checkout-session', data),

  verifyCheckoutSession: (sessionId: string) =>
    api.get<StripeVerificationResponse>('/api/stripe/verify-session', {
      params: { session_id: sessionId }
    }),

  getBoatAvailability: (boatId: number, startDate: string, endDate: string) =>
    api.get<Array<{ startDate: Date; endDate: Date }>>(`/api/boats/${boatId}/availability`, {
      params: { startDate, endDate }
    }),

  getBoatPricing: (boatId: number, date: Date) =>
    api.get<Array<{
      id: number;
      hours: number;
      price: number;
      description?: string;
    }>>(`/api/boats/${boatId}/prices`, {
      params: { date: date.toISOString() }
    }),

  getBoatDetails: (boatId: number) =>
    api.get<Boat>(`/api/boats/${boatId}`),
};

// Admin API methods
export const adminApi = {
  // Boat operations
  getAllBoats: () => api.get<Boat[]>('/api/admin/boats'),
  addBoat: (data: {
    name: string;
    type: string;
    make: string;
    model: string;
    year: number;
    length: string;
    capacity: number;
    location: string;
    description: string;
    images: string[];
    features?: number[];
    prices?: Array<{
      effectiveDate: string;
      expiryDate: string;
      hours: number;
      price: number;
      isActive: boolean;
    }>;
  }) => api.post<Boat>('/api/admin/boats', data),
  updateBoat: (id: number, data: Partial<Boat>) => api.put<Boat>(`/api/admin/boats/${id}`, data),
  deleteBoat: (id: number) => api.delete(`/api/admin/boats/${id}`),

  // Booking operations
  getAllBookings: () => api.get<Booking[]>('/api/admin/bookings'),
  updateBookingStatus: (id: number, status: string) => 
    api.put<Booking>(`/api/admin/bookings/${id}`, { status }),
  deleteBooking: (id: number) => api.delete(`/api/admin/bookings/${id}`),

  // Feature operations
  getAllFeatures: () => api.get<Boat[]>('/api/admin/features'),
  addFeature: (data: { name: string; category: string; icon?: string }) => 
    api.post<Boat>('/api/admin/features', data),
  deleteFeature: (id: number) => api.delete(`/api/admin/features/${id}`),

  // User operations
  getAllUsers: () => api.get<User[]>('/api/admin/users'),
  updateUserRole: (id: number, role: string) => 
    api.put<User>(`/api/admin/users/${id}`, { role }),
  suspendUser: (id: number) => api.put<User>(`/api/admin/users/${id}/suspend`),

  // Statistics and Reports
  getBoatStatistics: () => api.get('/api/admin/statistics/boats'),
  getBookingRevenue: (startDate: string, endDate: string) => 
    api.get('/api/admin/statistics/revenue', { params: { startDate, endDate } }),
  getBoatBookingHistory: (id: number) => api.get(`/api/admin/boats/${id}/history`)
};

// Owner API methods
export const ownerApi = {
  getMyBoats: () => api.get<Boat[]>('/api/owner/boats'),
  updateMyBoat: (id: number, data: Partial<Boat>) => api.put<Boat>(`/api/owner/boats/${id}`, data),
  getMyBoatBookings: (id: number) => api.get<Booking[]>(`/api/owner/boats/${id}/bookings`),
  getMyBoatRevenue: (id: number, startDate: string, endDate: string) => 
    api.get(`/api/owner/boats/${id}/revenue`, { params: { startDate, endDate } }),
  getMyBoatAvailability: (id: number, startDate: string, endDate: string) => 
    api.get(`/api/owner/boats/${id}/availability`, { params: { startDate, endDate } })
}; 