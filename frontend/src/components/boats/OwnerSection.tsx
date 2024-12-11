import { FiUser, FiCalendar, FiAward, FiMessageCircle } from 'react-icons/fi';
import Image from 'next/image';
import { UserRole } from '@/types/types';

interface OwnerSectionProps {
  ownerId: number;
  ownerRole: UserRole;
  owner: {
    firstName?: string;
    lastName?: string;
    profileImage?: string;
    bio?: string;
    createdAt?: string;
    membershipTier?: string;
  };
}

export default function OwnerSection({ ownerId, ownerRole, owner }: OwnerSectionProps) {
  if (ownerRole === UserRole.ADMIN) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">About This Boat</h3>
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 rounded-full overflow-hidden">
            <Image
              src="/images/kos-logo.png"
              alt="KOS Yachts"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">KOS Official Boat</h4>
            <p className="text-sm text-gray-500">Professionally Managed by KOS Yachts</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiAward className="text-[#21336a]" />
          <span>Verified and Maintained to KOS Standards</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Meet Your Host</h3>
      
      <div className="flex items-start gap-4">
        <div className="relative h-20 w-20 rounded-full overflow-hidden">
          <Image
            src={owner.profileImage || '/images/default-avatar.png'}
            alt={`${owner.firstName} ${owner.lastName}`}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">
            {owner.firstName} {owner.lastName}
          </h4>
          <div className="space-y-2 mt-2">
            {owner.createdAt && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiCalendar className="text-[#21336a]" />
                <span>Member since {new Date(owner.createdAt).getFullYear()}</span>
              </div>
            )}
            {owner.membershipTier && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiAward className="text-[#21336a]" />
                <span>{owner.membershipTier} Member</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {owner.bio && (
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-600">{owner.bio}</p>
        </div>
      )}

      <div className="pt-4 border-t">
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-[#21336a] text-[#21336a] rounded-lg hover:bg-[#21336a]/5 transition-colors"
        >
          <FiMessageCircle />
          <span>Contact Host</span>
        </button>
      </div>
    </div>
  );
} 