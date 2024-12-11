'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/');  // Redirect non-admin users
    }
  }, [user, loading, isAdmin, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAdmin ? <>{children}</> : null;
} 