'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/components/auth/AuthProvider';
import ProfileContent from '@/components/user/ProfileContent';
import AdminDashboard from '@/components/admin/dashboard/AdminDashboard';

export default function Profile() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      {user?.role === 'ADMIN' ? <AdminDashboard /> : <ProfileContent />}
    </ProtectedRoute>
  );
}
