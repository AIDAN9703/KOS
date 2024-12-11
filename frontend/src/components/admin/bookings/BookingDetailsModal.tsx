import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Booking } from '@/types/types';
import { format } from 'date-fns';

interface BookingDetailsModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingDetailsModal({ booking, isOpen, onClose }: BookingDetailsModalProps) {
  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Booking Details #{booking.id}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div>
            <h3 className="font-semibold mb-2">Customer Information</h3>
            <div className="space-y-1">
              <p>Name: {booking.user.firstName} {booking.user.lastName}</p>
              <p>Email: {booking.user.email}</p>
              <p>Phone: {booking.user.phoneNumber}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Boat Information</h3>
            <div className="space-y-1">
              <p>Name: {booking.boat.name}</p>
              <p>Type: {booking.boat.type}</p>
              <p>Location: {booking.boat.location}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Booking Details</h3>
            <div className="space-y-1">
              <p>Start: {format(new Date(booking.startDate), 'PPP p')}</p>
              <p>End: {booking.endDate ? format(new Date(booking.endDate), 'PPP p') : 'N/A'}</p>
              <p>Duration: {booking.duration || 'N/A'} hours</p>
              <p>Status: {booking.status}</p>
              <p>Total Price: ${booking.totalPrice}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Additional Information</h3>
            <div className="space-y-1">
              <p>Payment Status: {booking.paymentStatus}</p>
              <p>Guest Count: {booking.guestCount || 'N/A'}</p>
              <p>Special Requests: {booking.specialRequests || 'None'}</p>
            </div>
          </div>
        </div>

        {booking.specialRequests && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Special Requests</h3>
            <div className="bg-gray-50 p-4 rounded">
              {booking.specialRequests}
            </div>
          </div>
        )}

        <DialogFooter>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 