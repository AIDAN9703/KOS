'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000'; // or your backend URL

interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'owner';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API_BASE_URL}/api/user/current`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      // Fetch user data after successful login
      const userResponse = await axios.get(`${API_BASE_URL}/api/user/current`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(userResponse.data);
    } catch (error: any) {
      console.error('Login error:', error.response?.data);
      throw error.response?.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // Optionally, redirect to home page or login page after logout
    // router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}