'use client';

import { User } from '@/types/types';
import { MdStar, MdStarBorder, MdTrendingUp } from 'react-icons/md';

interface MembershipInfoProps {
  user: User | null;
}

const TIER_BENEFITS = {
  GOLD: ['Basic Support', 'Standard Bookings', '5% Discount'],
  PLATINUM: ['Priority Support', 'Priority Bookings', '10% Discount', 'Free Cancellation'],
  DIAMOND: ['24/7 Support', 'VIP Bookings', '15% Discount', 'Free Cancellation', 'Special Events'],
  ELITE: ['Concierge Service', 'Instant Bookings', '20% Discount', 'Free Upgrades', 'Exclusive Events'],
  VIP: ['Personal Assistant', 'Unlimited Bookings', '25% Discount', 'Premium Upgrades', 'Private Events']
};

const TIER_POINTS = {
  GOLD: 0,
  PLATINUM: 1000,
  DIAMOND: 5000,
  ELITE: 10000,
  VIP: 25000
};

export default function MembershipInfo({ user }: MembershipInfoProps) {
  const currentTier = user?.membershipTier || 'GOLD';
  const currentPoints = user?.loyaltyPoints || 0;

  const getNextTier = () => {
    const tiers = Object.keys(TIER_POINTS) as Array<keyof typeof TIER_POINTS>;
    const currentIndex = tiers.indexOf(currentTier);
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  };

  const nextTier = getNextTier();
  const pointsToNextTier = nextTier ? TIER_POINTS[nextTier] - currentPoints : 0;

  const calculateProgress = () => {
    if (!nextTier) return 100;
    const tierDifference = TIER_POINTS[nextTier] - TIER_POINTS[currentTier];
    const pointsProgress = currentPoints - TIER_POINTS[currentTier];
    return (pointsProgress / tierDifference) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Current Tier Status */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Current Membership Tier
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {currentTier} Member
              </p>
            </div>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, index) => (
                <MdStar
                  key={index}
                  className={`h-6 w-6 ${
                    index < Object.keys(TIER_POINTS).indexOf(currentTier) + 1
                      ? 'text-yellow-400'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Points Progress */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">
            Loyalty Points
          </h3>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">
                {currentPoints} points
              </p>
              {nextTier && (
                <p className="text-sm font-medium text-gray-500">
                  {pointsToNextTier} points to {nextTier}
                </p>
              )}
            </div>
            <div className="mt-2">
              <div className="relative">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${calculateProgress()}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#21336a]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits List */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Your Benefits
          </h3>
          <ul className="space-y-3">
            {TIER_BENEFITS[currentTier].map((benefit, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600">
                <MdStar className="h-5 w-5 text-yellow-400 mr-2" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Points History */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {/* This would be populated with actual points history */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <MdTrendingUp className="h-5 w-5 text-green-500 mr-2" />
                <span>Completed Booking #1234</span>
              </div>
              <span className="font-medium text-green-500">+100 points</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 