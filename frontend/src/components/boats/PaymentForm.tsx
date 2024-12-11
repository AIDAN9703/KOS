'use client';

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';

interface PaymentFormProps {
  onPaymentComplete: () => void;
}

export default function PaymentForm({ onPaymentComplete }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    
    // Add your payment processing logic here
    // This would typically involve creating a payment intent on your server
    // and then confirming it here with the card details

    setProcessing(false);
    onPaymentComplete();
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
} 