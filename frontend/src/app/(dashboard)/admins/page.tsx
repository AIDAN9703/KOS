'use client'

import AdminRoute from '@/components/auth/AdminRoute';
import AdminDashboard from '@/components/admin/dashboard/AdminDashboard';

export default function AdminPage() {
  return (
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  );
} 