// User & Auth Types
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  OWNER = 'OWNER'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber: string;
  role: UserRole;
  status: UserStatus;
  dateOfBirth?: string;
  address?: string;
  profileImage?: string;
  bio?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  verificationStatus?: {
    email: boolean;
    phone: boolean;
    identity: boolean;
    address: boolean;
  };
  preferences?: {
    notifications: boolean;
    newsletter: boolean;
    twoFactorAuth: boolean;
  };
  membershipTier: 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'ELITE' | 'VIP';
  loyaltyPoints: number;
  createdAt: string;
  updatedAt: string;
  idDocuments: string[];
  boatingLicense?: string;
  licenseExpiry?: string;
}

// Boat Types
export enum BoatStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE'
}

export enum CancellationPolicy {
  FLEXIBLE = 'FLEXIBLE',
  MODERATE = 'MODERATE',
  STRICT = 'STRICT'
}

export enum FuelType {
  DIESEL = 'DIESEL',
  PETROL = 'PETROL',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID'
}

export interface BoatFeature {
  id: number;
  name: string;
  category: string;
  icon?: string;
}

export interface BoatPrice {
  id: number;
  hours: number;
  price: number;
  effectiveDate: string;
  expiryDate?: string;
  description?: string;
  isActive: boolean;
}

export interface Boat {
  id: number;
  name: string;
  type: string;
  make?: string;
  model?: string;
  year?: number;
  length: number;
  capacity: number;
  location: string;
  description: string;
  images: string[];
  status: BoatStatus;
  basePrice: number;
  cancellationPolicy: CancellationPolicy;
  features: BoatFeature[];
  boatPrices: BoatPrice[];
  amenities: string[];
  rules: string[];
  allowedActivities: string[];
  lastServiced?: Date;
  createdAt: Date;
  updatedAt: Date;
  sleeps?: number;
  staterooms?: number;
  bathrooms?: number;
  engineCount?: number;
  enginePower?: string;
  fuelType?: FuelType;
  cruisingSpeed?: number;
  maxSpeed?: number;
  minimumNotice?: number;
  maximumDuration?: number;
  securityDeposit?: number;
  ownerId: number;
  owner: User;
  ownerRole: UserRole;
}

export interface BoatFormData extends Omit<Boat, 'id' | 'createdAt' | 'updatedAt' | 'features'> {
  features: number[];
}

// Booking Types
export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED'
}

export interface Booking {
  id: number;
  userId: number;
  boatId: number;
  boatPriceId: number;
  startDate: Date;
  endDate?: Date;
  startTime?: string;
  endTime?: string;
  duration?: number;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  paymentIntentId?: string;
  stripeSessionId?: string;
  addOns?: any;
  guestCount?: number;
  checkinTime?: Date;
  checkoutTime?: Date;
  cancellationReason?: string;
  refundAmount?: number;
  weatherConditions?: any;
  crewMembers?: any[];
  itinerary?: any;
  insuranceDetails?: any;
  checklistCompleted: boolean;
  weatherAlert?: boolean;
  contractSigned: boolean;
  securityDepositPaid: boolean;
  insuranceVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  boat: Boat;
  boatPrice: BoatPrice;
  user: User;
  payment?: Payment;
  review?: Review;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

// Form Types
export interface BoatFormProps {
  onSuccess: () => Promise<void>;
}

export interface EditBoatFormProps {
  boat: Boat;
  onSuccess: () => Promise<void>;
  onCancel: () => void;
}

export interface BookingFormProps {
  boatId: number;
}

export interface PricingCalendarProps {
  boatId: number;
}

export enum ReviewStatus {
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  FLAGGED = 'FLAGGED',
  REMOVED = 'REMOVED'
}

export interface Payment {
  id: number;
  bookingId: number;
  stripePaymentIntentId?: string;
  stripeCustomerId?: string;
  amount: number;
  currency?: string;
  status: PaymentStatus;
  paymentMethod?: string;
  refundAmount?: number;
  refundReason?: string;
  stripeRefundId?: string;
  metadata?: any;
  receiptUrl?: string;
  paymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: number;
  bookingId: number;
  reviewerId: number;
  targetId: number;
  rating: number;
  comment?: string;
  response?: string;
  responseDate?: Date;
  status: ReviewStatus;
  helpful?: number;
  photos: string[];
  verified?: boolean;
  cleanliness?: number;
  communication?: number;
  accuracy?: number;
  value?: number;
  location?: number;
  experience?: number;
  recommended: boolean;
  tripDetails?: any;
  moderationNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  reviewer: User;
  boat: Boat;
  booking: Booking;
}

// Update the optimistic update in useCreateBooking
export const createOptimisticBooking = (data: any): Booking => ({
  id: Math.random(),
  userId: 0, // Will be set by server
  boatId: data.boatId,
  boatPriceId: data.boatPriceId,
  startDate: new Date(data.startDate),
  endDate: new Date(data.endDate),
  startTime: data.startTime,
  endTime: data.endTime,
  duration: data.duration,
  totalPrice: data.totalPrice,
  status: BookingStatus.PENDING,
  paymentStatus: PaymentStatus.PENDING,
  specialRequests: data.specialRequests,
  checklistCompleted: false,
  contractSigned: false,
  securityDepositPaid: false,
  insuranceVerified: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  boat: data.boat,
  boatPrice: data.boatPrice,
  user: data.user
});

// Add type guards for better type safety
export const isBookingStatus = (status: string): status is BookingStatus => {
  return Object.values(BookingStatus).includes(status as BookingStatus);
};

export const isPaymentStatus = (status: string): status is PaymentStatus => {
  return Object.values(PaymentStatus).includes(status as PaymentStatus);
};

export interface BoatWithUser extends Boat {
  user: User;
} 