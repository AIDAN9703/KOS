'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { useState, useEffect } from 'react';
import { MdNotifications, MdPerson, MdCircle } from 'react-icons/md';
import Image from 'next/image';

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [siteStatus, setSiteStatus] = useState<{
    status: 'running' | 'down';
    message?: string;
  }>({ status: 'running' });

  // Check site status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/health-check');
        if (response.ok) {
          setSiteStatus({ status: 'running' });
        } else {
          setSiteStatus({ 
            status: 'down', 
            message: 'API is not responding' 
          });
        }
      } catch (error) {
        setSiteStatus({ 
          status: 'down', 
          message: 'Connection error' 
        });
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[#1a2234] shadow-sm">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="Kos Logo"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-white">
                Kos Admin
              </h1>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Status:</span>
                <div className="flex items-center">
                  <MdCircle 
                    className={`h-3 w-3 ${
                      siteStatus.status === 'running' 
                        ? 'text-green-500' 
                        : 'text-red-500'
                    }`}
                  />
                  <span className={`ml-1 text-sm ${
                    siteStatus.status === 'running'
                      ? 'text-green-700'
                      : 'text-red-700'
                  }`}>
                    {siteStatus.status === 'running' ? 'Running' : 'Down'}
                  </span>
                  {siteStatus.message && (
                    <span className="ml-2 text-xs text-gray-500">
                      ({siteStatus.message})
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right side icons/menu */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-white hover:text-gray-500 relative">
              <MdNotifications className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {user?.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-[#21336a] text-white flex items-center justify-center text-sm">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                )}
                <div className="text-right">
                  <div className="font-medium text-white">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs text-gray-500">
                    Administrator
                  </div>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 