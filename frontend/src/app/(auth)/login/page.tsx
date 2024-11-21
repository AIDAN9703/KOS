'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PhoneRegistration from '@/components/auth/PhoneRegistration';
import CodeVerification from '@/components/auth/CodeVerification';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const steps = [
  { id: 1, name: 'Phone Number', description: 'Enter your phone number' },
  { id: 2, name: 'Verification', description: 'Enter the code sent to your phone' }
];

export default function LoginPage() {
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <Image
            src="/images/logo.png"
            alt="KOS Logo"
            width={80}
            height={80}
            className="mx-auto"
          />
          <h2 className="mt-6 text-3xl font-bold text-[#21336a]">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 'phone' 
              ? 'Enter your phone number to continue' 
              : `Enter the verification code sent to ${phoneNumber}`
            }
          </p>
        </div>

        <nav aria-label="Progress">
          <ol className="space-y-4 md:flex md:space-y-0 md:space-x-8">
            {steps.map((stepItem) => (
              <li key={stepItem.name} className="md:flex-1">
                <div className={`
                  group pl-4 py-2 flex flex-col border-l-4 
                  ${(step === 'verify' && stepItem.id === 1) || (step === 'verify' && stepItem.id === 2) ? 'border-[#21336a]' : 
                    (step === 'phone' && stepItem.id === 1) ? 'border-[#21336a]' : 'border-gray-200'}
                  md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4
                `}>
                  <span className={`
                    text-xs font-semibold tracking-wide uppercase
                    ${(step === 'verify' && stepItem.id === 1) || (step === 'verify' && stepItem.id === 2) ? 'text-[#21336a]' : 
                      (step === 'phone' && stepItem.id === 1) ? 'text-[#21336a]' : 'text-gray-500'}
                  `}>
                    {stepItem.name}
                  </span>
                  <span className="text-sm font-medium">
                    {(step === 'verify' && stepItem.id === 1) ? (
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

        <div className="mt-8">
          {step === 'phone' ? (
            <>
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-700">
                  We'll send you a verification code to confirm your identity.
                </p>
              </div>
              <PhoneRegistration 
                onSuccess={(phone) => {
                  setPhoneNumber(phone);
                  setStep('verify');
                }}
                buttonText="Continue"
                mode="login"
              />
            </>
          ) : (
            <>
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-700">
                  Please check your messages for a 6-digit verification code.
                </p>
              </div>
              <CodeVerification
                phoneNumber={phoneNumber}
                onSuccess={handleLoginSuccess}
                mode="login"
              />
            </>
          )}
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                New to KOS?
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/register"
              className="w-full flex justify-center py-3 px-4 border border-[#21336a] rounded-lg text-sm font-medium text-[#21336a] hover:bg-gray-50 transition-colors duration-200"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}