import { Booking } from './booking';
import { Feature } from './boat';

export interface BookingManagementProps {
  bookings: Booking[];
  onUpdateStatus: (bookingId: number, newStatus: string) => Promise<void>;
}

export interface FeatureManagementProps {
  onUpdate: () => Promise<void>;
}

export type BookingManagementComponent = React.FC<BookingManagementProps>;
export type FeatureManagementComponent = React.FC<FeatureManagementProps>; 