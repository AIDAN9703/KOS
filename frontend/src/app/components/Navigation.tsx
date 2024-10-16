'use client'

import Image from "next/image";
import Link from "next/link";
import { useAuth } from './AuthProvider';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const { user, logout } = useAuth();
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutMessage(true);
    setTimeout(() => setShowLogoutMessage(false), 3000); // Hide message after 3 seconds
  };

  useEffect(() => {
    if (showLogoutMessage) {
      const timer = setTimeout(() => setShowLogoutMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showLogoutMessage]);

  return (
    <header className="bg-white shadow relative">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-12 h-12 relative">
            <Image 
              src="/logo.png" 
              alt="KOS Yachts Logo" 
              fill
              sizes="48px"
              style={{ objectFit: 'contain' }}
            />
          </div>
          <span className="text-gold ml-3 text-xl font-semibold">KOS Yachts</span>
        </div>
        <div>
          <Link href="/" className="text-gold hover:text-gold-dark mr-4">Home</Link>
          <Link href="/our-fleet" className="text-gold hover:text-gold-dark mr-4">Our Fleet</Link>
          {user?.role === 'owner' && (
            <Link href="/owners-portal" className="text-gold hover:text-gold-dark mr-4">
              Owners Portal
            </Link>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-gold text-white px-4 py-2 rounded hover:bg-gold-dark"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="text-gold hover:text-gold-dark mr-4">
                Login
              </Link>
              <Link href="/register" className="bg-gold text-white px-4 py-2 rounded hover:bg-gold-dark">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
      {showLogoutMessage && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-gold text-white px-4 py-2 rounded shadow-lg mt-2">
          Successfully logged out
        </div>
      )}
    </header>
  );
}
