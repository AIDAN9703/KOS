'use client';

import { useState } from 'react';
import { User } from '@/types/types';
import { MdNotifications, MdEmail, MdPhone, MdSave } from 'react-icons/md';
import toast from 'react-hot-toast';

interface NotificationPreferencesProps {
  user: User | null;
}

interface NotificationSettings {
  email: {
    marketing: boolean;
    bookingUpdates: boolean;
    securityAlerts: boolean;
    newsletter: boolean;
  };
  sms: {
    bookingReminders: boolean;
    statusUpdates: boolean;
    emergencyAlerts: boolean;
  };
  push: {
    instant: boolean;
    dailyDigest: boolean;
    promotions: boolean;
  };
}

export default function NotificationPreferences({ user }: NotificationPreferencesProps) {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      marketing: user?.preferences?.notifications ?? false,
      bookingUpdates: true,
      securityAlerts: true,
      newsletter: user?.preferences?.newsletter ?? false
    },
    sms: {
      bookingReminders: true,
      statusUpdates: true,
      emergencyAlerts: true
    },
    push: {
      instant: true,
      dailyDigest: false,
      promotions: false
    }
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users/notification-preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) throw new Error('Failed to update preferences');
      
      toast.success('Notification preferences updated');
    } catch (error) {
      toast.error('Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const NotificationSection = ({ 
    title, 
    icon: Icon, 
    settings: sectionSettings,
    section
  }: { 
    title: string;
    icon: typeof MdNotifications;
    settings: Record<string, boolean>;
    section: keyof NotificationSettings;
  }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center mb-4">
          <Icon className="h-6 w-6 text-gray-400" />
          <h3 className="ml-3 text-lg font-medium text-gray-900">{title}</h3>
        </div>
        <div className="space-y-4">
          {Object.entries(sectionSettings).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                {key.split(/(?=[A-Z])/).join(' ')}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={value}
                  onChange={(e) => {
                    setSettings(prev => ({
                      ...prev,
                      [section]: {
                        ...prev[section],
                        [key]: e.target.checked
                      }
                    }));
                  }}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#21336a]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#21336a]"></div>
              </label>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <NotificationSection
        title="Email Notifications"
        icon={MdEmail}
        settings={settings.email}
        section="email"
      />

      <NotificationSection
        title="SMS Notifications"
        icon={MdPhone}
        settings={settings.sms}
        section="sms"
      />

      <NotificationSection
        title="Push Notifications"
        icon={MdNotifications}
        settings={settings.push}
        section="push"
      />

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#21336a] hover:bg-[#2a4086] focus:outline-none disabled:opacity-50"
        >
          <MdSave className="h-5 w-5 mr-2" />
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
} 