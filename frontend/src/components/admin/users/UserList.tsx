'use client';

import { User } from '@/types/types';
import { formatDate } from '@/utils/dateUtils';

interface UserListProps {
  users: User[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSelectUser: (user: User) => void;
  onSuspendUser: (userId: number) => void;
  onDeleteUser: (userId: number) => void;
}

export default function UserList({
  users,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  onSelectUser,
  onSuspendUser,
  onDeleteUser
}: UserListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!users?.length) {
    return (
      <div className="p-6 text-center text-gray-500">
        No users found. Try adjusting your filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-[#1a2234]">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {users?.map((user) => (
            <tr key={user.id} className="hover:bg-[#2a3441]">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {user.profileImage ? (
                      <img className="h-10 w-10 rounded-full" src={user.profileImage} alt="" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-[#21336a] flex items-center justify-center text-white">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-white">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-gray-400">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-300">{user.role}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  user.status === 'SUSPENDED' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                <div className="flex space-x-3">
                  <button
                    onClick={() => onSelectUser(user)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onSuspendUser(user.id)}
                    className="text-yellow-400 hover:text-yellow-300"
                  >
                    Suspend
                  </button>
                  <button
                    onClick={() => onDeleteUser(user.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-700">
        <div className="text-sm text-gray-400">
          Page {currentPage} of {totalPages}
        </div>
        <div className="space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-700 rounded disabled:opacity-50 text-white bg-[#1e2738] hover:bg-[#2a3441]"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-700 rounded disabled:opacity-50 text-white bg-[#1e2738] hover:bg-[#2a3441]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 