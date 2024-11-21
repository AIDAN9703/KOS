'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { bookingApi } from '@/services/api';
import toast from 'react-hot-toast';
import { Booking } from '@/types/booking';

interface BookingDetails {
  boatId: string;
  duration: string;
  date: Date;
  totalAmount: number;
  status: string;
  paymentStatus: string;
}

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  useEffect(() => {
    if (!sessionId) {
      router.push('/');
      return;
    }

    verifyBooking(sessionId);
  }, [sessionId, router]);

  const verifyBooking = async (sid: string) => {
    try {
      const { data } = await bookingApi.verifyCheckoutSession(sid);
      
      if (data.success) {
        setBookingDetails({
          boatId: data.metadata.boatId,
          duration: data.metadata.duration,
          date: new Date(data.metadata.selectedDate),
          totalAmount: data.amount_total / 100,
          status: 'confirmed',
          paymentStatus: 'paid'
        });
        setStatus('success');
        toast.success('Booking confirmed successfully!');
      } else {
        setStatus('error');
        toast.error('Payment verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      toast.error('Failed to verify booking');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#21336a]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {status === 'success' && bookingDetails ? (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
              <div className="mb-6 text-left bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-semibold">Date:</span>{' '}
                    {bookingDetails.date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Duration:</span>{' '}
                    {bookingDetails.duration} hours
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Total Amount:</span>{' '}
                    ${bookingDetails.totalAmount.toFixed(2)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Status:</span>{' '}
                    <span className="text-green-600 font-medium capitalize">
                      {bookingDetails.status}
                    </span>
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                We've sent a confirmation email with all the details.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
              <p className="text-gray-600 mb-6">
                Please contact support if you believe this is an error.
              </p>
            </>
          )}
          
          <div className="space-x-4">
            <Link
              href="/my-bookings"
              className="inline-block bg-[#21336a] text-white px-6 py-3 rounded-lg hover:bg-[#2a4086] transition-colors"
            >
              View My Bookings
            </Link>
            <Link
              href="/boats"
              className="inline-block border border-[#21336a] text-[#21336a] px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Browse More Boats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 