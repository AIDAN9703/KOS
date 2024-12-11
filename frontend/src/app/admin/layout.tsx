import { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/layout/AdminSidebar';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import AdminRoute from '@/components/auth/AdminRoute';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-[#1a2234]">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminRoute>
  );
} 