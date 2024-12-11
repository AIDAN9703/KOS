'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiCheckCircle, FiCalendar, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

export default function BookingSuccessPage() {
  const router = useRouter();

  // Redirect if accessed directly without a booking
  useEffect(() => {
    const hasBooking = sessionStorage.getItem('lastBookingSuccess');
    if (!hasBooking) {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <FiCheckCircle className="w-16 h-16 text-green-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900">
            Booking Confirmed!
          </h1>
          
          <p className="text-gray-600">
            Your booking has been successfully created. You will receive a 
            confirmation email shortly.
          </p>
        </div>

        <div className="space-y-4 pt-6">
          <Link 
            href="/bookings"
            className="flex items-center justify-center gap-2 w-full bg-[#21336a] 
                     text-white py-3 px-4 rounded-md hover:bg-[#21336a]/90 
                     transition-colors"
          >
            <FiCalendar />
            View My Bookings
          </Link>

          <Link 
            href="/"
            className="flex items-center justify-center gap-2 w-full border 
                     border-gray-300 py-3 px-4 rounded-md hover:bg-gray-50 
                     transition-colors"
          >
            <FiArrowRight />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 