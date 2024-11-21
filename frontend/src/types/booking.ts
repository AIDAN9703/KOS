import { User } from './auth';

export interface Booking {
  id: number;
  userId: number;
  boatId: number;
  boatPriceId: number;
  startDate: string;
  endDate: string;
  duration: number;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  stripeSessionId?: string;
  paymentIntentId?: string;
  addOns?: {
    captain?: boolean;
    fuel?: boolean;
    insurance: 'basic' | 'premium';
  };
  createdAt: string;
  user?: User;
  boat?: {
    id: number;
    name: string;
    type: string;
  };
  boatPrice?: {
    id: number;
    hours: number;
    price: number;
    description?: string;
  };
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export interface BoatPrice {
  id: number;
  boatId: number;
  hours: number;
  price: number;
  effectiveDate: string;
  expiryDate?: string;
  description?: string;
  isActive: boolean;
} 