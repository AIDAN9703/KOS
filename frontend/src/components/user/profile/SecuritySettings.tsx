'use client';

import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useSecurity } from '@/hooks/useSecurity';
import { MdLock, MdSecurity } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function SecuritySettings() {
  const { user } = useProfile();
  const { 
    changePassword, 
    updateTwoFactor,
    isChangingPassword,
    isUpdatingTwoFactor 
  } = useSecurity();
  
  const [isPasswordFormVisible, setIsPasswordFormVisible] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    }, {
      onSuccess: () => {
        setIsPasswordFormVisible(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Password Change Section */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MdLock className="h-6 w-6 text-gray-400" />
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Password
                </h3>
                <p className="text-sm text-gray-500">
                  Change your account password
                </p>
              </div>
            </div>
            {!isPasswordFormVisible && (
              <button
                onClick={() => setIsPasswordFormVisible(true)}
                className="text-[#21336a] hover:text-[#2a4086]"
              >
                Change Password
              </button>
            )}
          </div>

          {isPasswordFormVisible && (
            <form onSubmit={handlePasswordChange} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    currentPassword: e.target.value
                  }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#21336a] focus:outline-none focus:ring-1 focus:ring-[#21336a]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    newPassword: e.target.value
                  }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#21336a] focus:outline-none focus:ring-1 focus:ring-[#21336a]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({
                    ...prev,
                    confirmPassword: e.target.value
                  }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#21336a] focus:outline-none focus:ring-1 focus:ring-[#21336a]"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordFormVisible(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                  disabled={isChangingPassword}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#21336a] hover:bg-[#2a4086] focus:outline-none disabled:opacity-50"
                >
                  {isChangingPassword ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MdSecurity className="h-6 w-6 text-gray-400" />
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={user?.preferences?.twoFactorAuth}
                  disabled={isUpdatingTwoFactor}
                  onChange={(e) => updateTwoFactor(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#21336a]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#21336a]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 