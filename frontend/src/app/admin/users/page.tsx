'use client';

import { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import UserList from '@/components/admin/users/UserList';
import UserDetails from '@/components/admin/users/UserDetails';
import { User } from '@/types/types';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [page, setPage] = useState(1);

  const { 
    users, 
    pagination, 
    isLoading, 
    deleteUser, 
    suspendUser,
    updateUser 
  } = useUsers({
    page,
    search,
    role: roleFilter || undefined
  });

  const handleUpdateUser = async (userId: number, data: Partial<User>) => {
    try {
      await updateUser({ userId, data });
      toast.success('User updated successfully');
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleSuspendUser = async (userId: number) => {
    try {
      await suspendUser(userId);
      toast.success('User suspended successfully');
    } catch (error) {
      console.error('Error suspending user:', error);
      toast.error('Failed to suspend user');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await deleteUser(userId);
      toast.success('User deleted successfully');
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-[#1e2738] border-gray-700 text-white placeholder-gray-400"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-[#1e2738] border-gray-700 text-white"
          >
            <option value="">All Roles</option>
            <option value="USER">User</option>
            <option value="OWNER">Owner</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      <div className="bg-[#1e2738] rounded-lg shadow">
        {selectedUser ? (
          <UserDetails
            user={selectedUser}
            onUpdate={handleUpdateUser}
            onDelete={handleDeleteUser}
            onBack={() => setSelectedUser(null)}
          />
        ) : (
          <UserList
            users={users}
            loading={isLoading}
            currentPage={page}
            totalPages={pagination?.totalPages || 1}
            onPageChange={setPage}
            onSelectUser={setSelectedUser}
            onSuspendUser={handleSuspendUser}
            onDeleteUser={handleDeleteUser}
          />
        )}
      </div>
    </div>
  );
} 