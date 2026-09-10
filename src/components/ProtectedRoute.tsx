'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const t = useT();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/${locale}/login`);
      return;
    }
    if (roles && profile && !roles.includes(profile.role)) {
      router.replace(`/${locale}`);
    }
  }, [user, profile, loading, roles, router, locale]);

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
