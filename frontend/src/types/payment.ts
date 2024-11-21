export interface CheckoutData {
  boatId: number;
  userId: number;
  selectedDate: Date;
  duration: number;
  totalPrice: number;
  boatPriceId: number;
  addOns: {
    captain?: boolean;
    fuel?: boolean;
    insurance: 'basic' | 'premium';
  };
  guestInfo?: {
    name: string;
    email?: string;
    phone?: string;
  };
}

export interface StripeCheckoutResponse {
  sessionId: string;
}

export interface StripeVerificationResponse {
  success: boolean;
  metadata: {
    boatId: string;
    userId: string;
    duration: string;
    selectedDate: string;
    bookingId: string;
  };
  amount_total: number;
} 