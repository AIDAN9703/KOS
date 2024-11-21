'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!token || !refreshToken) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Try to refresh the token if the current one is invalid
        try {
          const newToken = await refreshAccessToken(refreshToken);
          const newResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${newToken}`
            }
          });
          
          if (newResponse.ok) {
            const userData = await newResponse.json();
            setUser(userData);
          } else {
            throw new Error('Failed to refresh authentication');
          }
        } catch (refreshError) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (token: string, refreshToken: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(userData);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    toast.success('Successfully logged out');
    router.push('/login');
  };

  const refreshAccessToken = async (refreshToken: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) throw new Error('Failed to refresh token');

      const { token } = await response.json();
      localStorage.setItem('token', token);
      return token;
    } catch (error) {
      logout(); // If refresh fails, log the user out
      throw error;
    }
  };

  // Handle inactivity logout
  useEffect(() => {
    if (user) {
      let inactivityTimer: NodeJS.Timeout;

      const resetTimer = () => {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(logout, 10 * 60 * 1000); // 10 minutes
      };

      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keydown', resetTimer);
      window.addEventListener('click', resetTimer);

      resetTimer();

      return () => {
        clearTimeout(inactivityTimer);
        window.removeEventListener('mousemove', resetTimer);
        window.removeEventListener('keydown', resetTimer);
        window.removeEventListener('click', resetTimer);
      };
    }
  }, [user]);

  // Registration specific functions
  const sendRegistrationVerificationCode = async (phoneNumber: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-phone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      toast.success('Verification code sent!');
      return response.json();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send verification code');
      throw error;
    }
  };

  const verifyRegistrationCode = async (phoneNumber: string, code: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, code })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const { tempToken } = await response.json();
      toast.success('Phone number verified!');
      return { tempToken };
    } catch (error: any) {
      toast.error(error.message || 'Invalid verification code');
      throw error;
    }
  };

  const completeRegistration = async (profileData: any, tempToken: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/complete-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tempToken}`
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const { token, user: userData } = await response.json();
      await login(token, userData.refreshToken, userData);
      toast.success('Registration completed successfully!');
      return userData;
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete registration');
      throw error;
    }
  };

  // Login specific functions
  const sendLoginVerificationCode = async (phoneNumber: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send login code');
    }

    return response.json();
  };

  const verifyLoginCode = async (phoneNumber: string, code: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, code })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      toast.success('Welcome back!');
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Invalid verification code');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    checkAuth,
    // Registration functions
    sendRegistrationVerificationCode,
    verifyRegistrationCode,
    completeRegistration,
    // Login functions
    sendLoginVerificationCode,
    verifyLoginCode,
    refreshAccessToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
