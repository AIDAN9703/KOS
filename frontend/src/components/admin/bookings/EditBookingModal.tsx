import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Booking, BookingStatus, PaymentStatus } from '@/types/types';
import { format } from 'date-fns';

interface EditBookingModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookingId: number, data: Partial<Booking>) => void;
}

export function EditBookingModal({ booking, isOpen, onClose, onSave }: EditBookingModalProps) {
  if (!booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const updatedData: Partial<Booking> = {
      startDate: new Date(formData.get('startDate') as string),
      endDate: formData.get('endDate') ? new Date(formData.get('endDate') as string) : undefined,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      duration: Number(formData.get('duration')),
      totalPrice: Number(formData.get('totalPrice')),
      status: formData.get('status') as BookingStatus,
      paymentStatus: formData.get('paymentStatus') as PaymentStatus,
      guestCount: Number(formData.get('guestCount')),
      specialRequests: formData.get('specialRequests') as string,
      checkinTime: formData.get('checkinTime') ? new Date(formData.get('checkinTime') as string) : undefined,
      checkoutTime: formData.get('checkoutTime') ? new Date(formData.get('checkoutTime') as string) : undefined,
      cancellationReason: formData.get('cancellationReason') as string,
      refundAmount: formData.get('refundAmount') ? Number(formData.get('refundAmount')) : undefined,
      checklistCompleted: formData.get('checklistCompleted') === 'true',
      weatherAlert: formData.get('weatherAlert') === 'true',
      contractSigned: formData.get('contractSigned') === 'true',
      securityDepositPaid: formData.get('securityDepositPaid') === 'true',
      insuranceVerified: formData.get('insuranceVerified') === 'true',
      updatedAt: new Date()
    };

    onSave(booking.id, updatedData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Edit Booking</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                defaultValue={format(new Date(booking.startDate), 'yyyy-MM-dd')}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                defaultValue={booking.endDate ? format(new Date(booking.endDate), 'yyyy-MM-dd') : ''}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <input
                type="time"
                name="startTime"
                defaultValue={booking.startTime}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <input
                type="time"
                name="endTime"
                defaultValue={booking.endTime}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duration (hours)</label>
              <input
                type="number"
                name="duration"
                defaultValue={booking.duration}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Price</label>
              <input
                type="number"
                step="0.01"
                name="totalPrice"
                defaultValue={booking.totalPrice}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payment Status</label>
              <select
                name="paymentStatus"
                defaultValue={booking.paymentStatus}
                className="w-full p-2 border rounded"
              >
                {Object.values(PaymentStatus).map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Refund Amount</label>
              <input
                type="number"
                step="0.01"
                name="refundAmount"
                defaultValue={booking.refundAmount || ''}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="checklistCompleted"
                  defaultChecked={booking.checklistCompleted}
                  className="rounded"
                />
                <span>Checklist Completed</span>
              </label>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="weatherAlert"
                  defaultChecked={booking.weatherAlert || false}
                  className="rounded"
                />
                <span>Weather Alert</span>
              </label>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="contractSigned"
                  defaultChecked={booking.contractSigned}
                  className="rounded"
                />
                <span>Contract Signed</span>
              </label>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="securityDepositPaid"
                  defaultChecked={booking.securityDepositPaid}
                  className="rounded"
                />
                <span>Security Deposit Paid</span>
              </label>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="insuranceVerified"
                  defaultChecked={booking.insuranceVerified}
                  className="rounded"
                />
                <span>Insurance Verified</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cancellation Reason</label>
            <textarea
              name="cancellationReason"
              defaultValue={booking.cancellationReason || ''}
              className="w-full p-2 border rounded"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 