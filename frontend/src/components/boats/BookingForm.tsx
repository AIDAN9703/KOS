import { useState } from 'react';
import { useCreateBooking } from '@/hooks/useCreateBooking';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface BookingFormProps {
  boatId: number;
  selectedDate: Date;
  duration: number;
  price: number;
  boatPriceId: number;
  onBack: () => void;
}

export default function BookingForm({ 
  boatId, 
  selectedDate, 
  duration, 
  price,
  boatPriceId,
  onBack 
}: BookingFormProps) {
  const [notes, setNotes] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const createBookingMutation = useCreateBooking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookingDate = new Date(selectedDate);
    const [hours, minutes] = startTime.split(':').map(Number);
    
    const startDateTime = new Date(bookingDate);
    startDateTime.setHours(hours, minutes, 0);
    
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(startDateTime.getHours() + duration);

    try {
      await createBookingMutation.mutateAsync({
        boatId,
        boatPriceId,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        startTime,
        endTime: format(endDateTime, 'HH:mm'),
        duration,
        totalPrice: price,
        specialRequests: notes || undefined
      });
    } catch (error) {
      toast.error('Failed to create booking');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Booking Summary</h3>
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-[#21336a]"
        >
          ← Back to calendar
        </button>
      </div>

      <div className="space-y-4 border-t border-b py-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Date</span>
          <span className="font-medium">{format(selectedDate, 'MMMM d, yyyy')}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Start Time</span>
          <select
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border rounded-md px-2 py-1"
          >
            {Array.from({ length: 12 }).map((_, i) => {
              const hour = i + 9; // Start from 9 AM
              const time = `${hour.toString().padStart(2, '0')}:00`;
              return (
                <option key={time} value={time}>
                  {format(new Date().setHours(hour, 0), 'h:mm a')}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Duration</span>
          <span className="font-medium">{duration} hours</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">End Time</span>
          <span className="font-medium">
            {format(
              new Date(selectedDate).setHours(
                parseInt(startTime.split(':')[0]) + duration,
                0
              ),
              'h:mm a'
            )}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Total Price</span>
          <span className="font-semibold text-[#21336a]">${price.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Special requests or notes..."
            className="w-full min-h-[80px] rounded-md border border-gray-300"
          />
        </div>

        <button
          type="submit"
          disabled={createBookingMutation.isPending}
          className="w-full bg-[#21336a] text-white py-2 px-4 rounded-md 
                   hover:bg-[#21336a]/90 disabled:opacity-50"
        >
          {createBookingMutation.isPending ? 'Processing...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
}