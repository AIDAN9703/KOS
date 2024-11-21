import { useState } from 'react';
import { useAuth } from './AuthProvider';

interface CodeVerificationProps {
  phoneNumber: string;
  onSuccess: () => void;
  mode: 'register' | 'login';
}

export default function CodeVerification({ 
  phoneNumber, 
  onSuccess,
  mode = 'register'
}: CodeVerificationProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const endpoint = mode === 'register'
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-code`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-login`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          code
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Invalid code');
      }

      const data = await response.json();
      
      if (mode === 'login') {
        await login(data.token, data.refreshToken, data.user);
      }
      
      onSuccess();
    } catch (error: any) {
      setError(error.message || 'Failed to verify code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
          Verification Code
        </label>
        <div className="mt-4 flex justify-between gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-2 border rounded focus:ring-[#21336a] focus:border-[#21336a]"
            placeholder="Enter verification code"
            required
          />
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
      <button
        type="submit"
        disabled={isLoading || !code}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          (isLoading || !code) ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Verifying...' : 'Verify Code'}
      </button>
    </form>
  );
} 