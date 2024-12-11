'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useBoatDetails } from '@/hooks/useBoatDetails';
import BoatDetails from '@/components/boats/BoatDetails';
import BookingForm from '@/components/boats/BookingForm';
import PricingCalendar from '@/components/boats/PricingCalendar';
import BoatReviews from '@/components/boats/BoatReviews';
import OwnerSection from '@/components/boats/OwnerSection';
import { UserRole } from '@/types/types';

interface SelectedBooking {
  date: Date;
  duration: number;
  price: number;
  boatPriceId: number;
}

export default function BoatPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const { boat, isLoading, error } = useBoatDetails(id);
  const [selectedBooking, setSelectedBooking] = useState<SelectedBooking | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#21336a]" />
      </div>
    );
  }

  if (error || !boat) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Boat Not Found</h1>
        <p className="text-gray-600">The boat you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  const handleTimeSlotSelect = (date: Date, hours: number, price: number, boatPriceId: number) => {
    setSelectedBooking({ date, duration: hours, price, boatPriceId });
  };

  const handleBackToCalendar = () => {
    setSelectedBooking(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <BoatDetails boat={boat} />
          <div className="mt-8">
            <OwnerSection 
              ownerId={boat.user?.id} 
              ownerRole={boat.user?.role || UserRole.USER} 
              owner={boat.user}
            />
          </div>
          <div className="mt-12">
            <BoatReviews boatId={boat.id} />
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            {selectedBooking ? (
              <BookingForm 
                boatId={boat.id}
                selectedDate={selectedBooking.date}
                duration={selectedBooking.duration}
                price={selectedBooking.price}
                boatPriceId={selectedBooking.boatPriceId}
                onBack={handleBackToCalendar}
              />
            ) : (
              <PricingCalendar 
                boatId={boat.id}
                onTimeSlotSelect={handleTimeSlotSelect}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 