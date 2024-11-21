'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { bookingApi } from '@/services/api';
import { CheckoutData } from '@/types/payment';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface AddOns {
  captain?: boolean;
  fuel?: boolean;
  insurance: 'basic' | 'premium';
}

interface BookingFormProps {
  boatId: number;
  selectedDate: Date | null;
  selectedDuration: number | null;
  totalPrice: number;
  selectedPriceId: number;
}

export default function BookingForm({ boatId, selectedDate, selectedDuration, totalPrice, selectedPriceId }: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [addOns, setAddOns] = useState<AddOns>({
    captain: false,
    fuel: true,
    insurance: 'basic'
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const calculateTotalPrice = () => {
    let total = totalPrice;
    if (addOns.captain) total += 150;
    if (addOns.insurance === 'premium') total += 50;
    return total;
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please log in to continue');
      return;
    }

    if (!selectedDate || !selectedDuration) {
      toast.error('Please select a date and duration');
      return;
    }

    if (!acceptedTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);
    try {
      const checkoutData: CheckoutData = {
        boatId,
        userId: user.id,
        selectedDate,
        duration: selectedDuration,
        totalPrice: calculateTotalPrice(),
        boatPriceId: selectedPriceId,
        addOns,
        guestInfo: {
          name: user.name,
          email: user.email || '',
          phone: user.phoneNumber,
        },
      };

      const { data } = await bookingApi.createCheckoutSession(checkoutData);

      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Additional Services</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Professional Captain</h4>
                  <p className="text-sm text-gray-600">Licensed captain for your journey</p>
                </div>
                <div className="flex items-center">
                  <span className="mr-4 font-medium">$150</span>
                  <input
                    type="checkbox"
                    checked={addOns.captain}
                    onChange={(e) => setAddOns({...addOns, captain: e.target.checked})}
                    className="h-4 w-4 text-[#21336a]"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Insurance Options</h3>
            <div className="space-y-4">
              {(['basic', 'premium'] as const).map((type) => (
                <div
                  key={type}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    addOns.insurance === type ? 'border-[#21336a] bg-blue-50' : ''
                  }`}
                  onClick={() => setAddOns({...addOns, insurance: type})}
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium capitalize">{type} Coverage</h4>
                    <span className="font-medium">
                      {type === 'premium' ? '+$50' : 'Included'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {type === 'premium' 
                      ? 'Full coverage with additional protection'
                      : 'Standard liability coverage'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Review & Payment</h3>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Price</span>
                  <span>${totalPrice}</span>
                </div>
                {addOns.captain && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Captain Service</span>
                    <span>$150</span>
                  </div>
                )}
                {addOns.insurance === 'premium' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Premium Insurance</span>
                    <span>$50</span>
                  </div>
                )}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${calculateTotalPrice()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1"
              />
              <label className="text-sm text-gray-600">
                I agree to the <a href="#" className="text-[#21336a]">Terms & Conditions</a> and 
                <a href="#" className="text-[#21336a]"> Cancellation Policy</a>
              </label>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isLoading || !acceptedTerms}
              className="w-full bg-[#21336a] text-white py-4 px-6 rounded-xl hover:bg-[#2a4086] 
                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                font-semibold text-lg"
            >
              {isLoading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        );
    }
  };

  return (
    <div className="mt-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between">
          {['Add-ons', 'Insurance', 'Payment'].map((step, index) => (
            <div
              key={step}
              className={`flex items-center ${index < currentStep ? 'text-[#21336a]' : 'text-gray-400'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                ${index < currentStep ? 'border-[#21336a] bg-[#21336a] text-white' : 'border-gray-300'}`}
              >
                {index + 1}
              </div>
              <span className="ml-2 text-sm hidden sm:block">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {renderStep()}

      <div className="mt-8 flex justify-between">
        {currentStep > 1 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
        )}
        {currentStep < 3 && (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="px-6 py-2 bg-[#21336a] text-white rounded-lg hover:bg-[#2a4086]"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
} 