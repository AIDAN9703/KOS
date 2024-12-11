'use client'

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { formatPhoneNumber, validatePhoneNumber } from '@/utils/phoneUtils';
import ProfileCompletion from '@/components/auth/ProfileCompletion';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { User } from "@/types/types'";

const steps = [
  { id: 1, name: 'Phone Number', description: 'Enter your phone number' },
  { id: 2, name: 'Verification', description: 'Enter the code sent to your phone' },
  { id: 3, name: 'Profile', description: 'Complete your profile' }
];

export default function Register() {
  const router = useRouter();
  const { sendRegistrationVerificationCode, verifyRegistrationCode } = useAuth();
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    try {
      await sendRegistrationVerificationCode(phoneNumber.replace(/\D/g, ''));
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid verification code');
      return;
    }

    setIsLoading(true);
    try {
      const { tempToken: newTempToken } = await verifyRegistrationCode(
        phoneNumber.replace(/\D/g, ''),
        verificationCode
      );
      setTempToken(newTempToken);
      setShowSuccess(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowSuccess(false);
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <Image
            src="/images/logo.png"
            alt="KOS Yachts Logo"
            width={80}
            height={80}
            className="mx-auto"
          />
          <h2 className="mt-6 text-3xl font-bold text-[#21336a]">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join the KOS Yachts community
          </p>
        </div>

        <nav aria-label="Progress">
          <ol className="space-y-4 md:flex md:space-y-0 md:space-x-8">
            {steps.map((stepItem) => (
              <li key={stepItem.name} className="md:flex-1">
                <div className={`
                  group pl-4 py-2 flex flex-col border-l-4 
                  ${step > stepItem.id ? 'border-[#21336a]' : step === stepItem.id ? 'border-[#21336a]' : 'border-gray-200'}
                  md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4
                `}>
                  <span className={`
                    text-xs font-semibold tracking-wide uppercase
                    ${step > stepItem.id ? 'text-[#21336a]' : step === stepItem.id ? 'text-[#21336a]' : 'text-gray-500'}
                  `}>
                    {stepItem.name}
                  </span>
                  <span className="text-sm font-medium">
                    {step > stepItem.id ? (
                      <span className="text-[#21336a] flex items-center gap-2">
                        <CheckCircleIcon className="h-5 w-5" />
                        Complete
                      </span>
                    ) : (
                      stepItem.description
                    )}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        {step === 1 && (
          <div className="mt-8 space-y-6">
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700">
                We'll send you a verification code to confirm your phone number.
              </p>
            </div>

            <form onSubmit={handlePhoneSubmit}>
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
                    required
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="(555) 555-5555"
                    className="block w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-[#21336a] focus:border-[#21336a]"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !phoneNumber}
                className={`
                  mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-lg
                  text-sm font-medium text-white bg-[#21336a] hover:bg-[#2a4086]
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#21336a]
                  transition-all duration-200
                  ${(isLoading || !phoneNumber) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Code...
                  </div>
                ) : (
                  'Continue'
                )}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/login"
                  className="w-full flex justify-center py-3 px-4 border border-[#21336a] rounded-lg text-sm font-medium text-[#21336a] hover:bg-gray-50"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-8 space-y-6">
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700">
                Enter the 6-digit code sent to {phoneNumber}
              </p>
            </div>

            <form onSubmit={handleCodeSubmit}>
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <div className="mt-4 flex justify-between gap-2">
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={verificationCode[index] || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value) {
                          const newCode = verificationCode.split('');
                          newCode[index] = value;
                          setVerificationCode(newCode.join(''));
                          // Auto-focus next input
                          if (index < 5 && value) {
                            const nextInput = document.querySelector(
                              `input[name="code-${index + 1}"]`
                            ) as HTMLInputElement;
                            if (nextInput) nextInput.focus();
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        // Handle backspace
                        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
                          const prevInput = document.querySelector(
                            `input[name="code-${index - 1}"]`
                          ) as HTMLInputElement;
                          if (prevInput) prevInput.focus();
                        }
                      }}
                      name={`code-${index}`}
                      className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg shadow-sm focus:border-[#21336a] focus:ring-[#21336a]"
                      required
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || verificationCode.length !== 6}
                className={`
                  mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-lg
                  text-sm font-medium text-white bg-[#21336a] hover:bg-[#2a4086]
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#21336a]
                  transition-all duration-200
                  ${(isLoading || verificationCode.length !== 6) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </div>
                ) : (
                  'Verify Code'
                )}
              </button>

              <div className="mt-6 flex flex-col items-center space-y-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-[#21336a] hover:text-[#2a4086]"
                >
                  Change phone number
                </button>

                <ResendCodeButton onResend={handlePhoneSubmit} />
              </div>
            </form>
          </div>
        )}

        {step === 3 && tempToken && (
          <ProfileCompletion 
            tempToken={tempToken} 
            phoneNumber={phoneNumber.replace(/\D/g, '')} 
          />
        )}
      </div>
    </div>
  );
}

function ResendCodeButton({ onResend }: { onResend: (e: React.FormEvent) => Promise<void> }) {
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleResend = async () => {
    const event = {
      preventDefault: () => {},
    } as React.FormEvent;
    
    await onResend(event);
    setTimeLeft(30);
    setCanResend(false);
  };

  return (
    <button
      type="button"
      onClick={handleResend}
      disabled={!canResend}
      className={`text-sm ${canResend ? 'text-[#21336a] hover:text-[#2a4086]' : 'text-gray-400'}`}
    >
      {canResend ? 'Resend code' : `Resend code in ${timeLeft}s`}
    </button>
  );
}
