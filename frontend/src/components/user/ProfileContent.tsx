'use client'

import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import PersonalInfo from './profile/PersonalInfo';
import VerificationStatus from './profile/VerificationStatus';
import MembershipInfo from './profile/MembershipInfo';
import BoatingCredentials from './profile/BoatingCredentials';
import EmergencyContacts from './profile/EmergencyContacts';
import SecuritySettings from './profile/SecuritySettings';
import NotificationPreferences from './profile/NotificationPreferences';

const TABS = [
  { id: 'personal', label: 'Personal Information' },
  { id: 'verification', label: 'Verification Status' },
  { id: 'membership', label: 'Membership & Loyalty' },
  { id: 'boating', label: 'Boating Credentials' },
  { id: 'emergency', label: 'Emergency Contacts' },
  { id: 'security', label: 'Security' },
  { id: 'notifications', label: 'Notifications' }
] as const;

type TabId = typeof TABS[number]['id'];

export default function ProfileContent() {
  const { user, isLoading } = useProfile();
  const [activeTab, setActiveTab] = useState<TabId>('personal');

  const renderTabContent = () => {
    if (!user) return null;

    switch (activeTab) {
      case 'personal':
        return <PersonalInfo />;
      case 'verification':
        return <VerificationStatus user={user} />;
      case 'membership':
        return <MembershipInfo user={user} />;
      case 'boating':
        return <BoatingCredentials user={user} />;
      case 'emergency':
        return <EmergencyContacts />;
      case 'security':
        return <SecuritySettings />;
      case 'notifications':
        return <NotificationPreferences user={user} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#21336a]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load profile data</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center space-x-5">
            <div className="flex-shrink-0">
              {user.profileImage ? (
                <img
                  className="h-20 w-20 rounded-full object-cover"
                  src={user.profileImage}
                  alt={`${user.firstName || ''} ${user.lastName || ''}`}
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-[#21336a] flex items-center justify-center text-white text-2xl">
                  {user.firstName?.[0] || ''}{user.lastName?.[0] || ''}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-sm text-gray-500">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
              <div className="mt-1 flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.membershipTier === 'ELITE' ? 'bg-purple-100 text-purple-800' :
                  user.membershipTier === 'VIP' ? 'bg-gold-100 text-gold-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {user.membershipTier} Member
                </span>
                <span className="text-sm text-gray-500">
                  {user.loyaltyPoints} Points
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm
                  ${activeTab === id
                    ? 'border-[#21336a] text-[#21336a]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
} 