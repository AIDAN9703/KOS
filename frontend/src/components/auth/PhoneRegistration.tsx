import React, { useState } from 'react';

interface PhoneRegistrationProps {
  onSuccess: (phone: string) => void;
  buttonText?: string;
  mode: 'register' | 'login';
}

export default function PhoneRegistration({ 
  onSuccess, 
  buttonText = 'Continue',
  mode = 'register' 
}: PhoneRegistrationProps): JSX.Element {
  const [formattedPhone, setFormattedPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');


  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Format the phone number for display
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    let formatted = '';
    
    if (match) {
      formatted = match[1];
      if (match[1]) {
        formatted = `(${match[1]}`;
        if (match[2]) {
          formatted += `) ${match[2]}`;
          if (match[3]) {
            formatted += `-${match[3]}`;
          }
        }
      }
    }
    
    setFormattedPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const cleanedNumber = formattedPhone.replace(/\D/g, '');
      
      const endpoint = mode === 'register' 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-phone` 
        : `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: cleanedNumber }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send code');
      }
      
      onSuccess(cleanedNumber);
    } catch (error: any) {
      setError(error.message || 'Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">+1</span>
          </div>
          <input
            id="phone"
            type="tel"
            value={formattedPhone}
            onChange={handlePhoneChange}
            className="block w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-[#21336a] focus:border-[#21336a]"
            placeholder="(555) 555-5555"
            required
          />
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#21336a] hover:bg-[#2a4086] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#21336a]"
      >
        {isLoading ? 'Sending...' : buttonText}
      </button>
    </form>
  );
} 