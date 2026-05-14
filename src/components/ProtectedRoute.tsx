'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useT } from '@/hooks/useT';

export default function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: string[];
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const t = useT();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/giris');
      return;
    }
    if (roles && profile && !roles.includes(profile.role)) {
      router.replace('/');
    }
  }, [user, profile, loading, roles, router]);

  if (loading) {
    return (
      <div className={`${t.pageFull} flex items-center justify-center`}>
        <div className={`w-8 h-8 border-2 ${t.spinner} rounded-full animate-spin`} />
      </div>
    );
  }

  if (!user) return null;
  if (roles && profile && !roles.includes(profile.role)) return null;

  return <>{children}</>;
}
