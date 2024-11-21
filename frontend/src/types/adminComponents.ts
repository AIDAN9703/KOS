import { Booking } from './booking';
import { Feature } from './boat';

export interface BookingManagementProps {
  bookings: Booking[];
  onUpdateStatus: (bookingId: number, newStatus: string) => Promise<void>;
}

export interface BoatFormProps {
  onSuccess: () => Promise<void>;
}

export interface FeatureManagementProps {
  onUpdate: () => Promise<void>;
}

declare module 'react' {
  interface FunctionComponent<P = {}> {
    (props: P, context?: any): ReactElement<any, any> | null;
  }
}

export type BookingManagementComponent = React.FC<BookingManagementProps>;
export type BoatFormComponent = React.FC<BoatFormProps>;
export type FeatureManagementComponent = React.FC<FeatureManagementProps>; 