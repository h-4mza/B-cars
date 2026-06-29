'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from '@/i18n/routing';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isAuthRoute = pathname.startsWith('/auth');
    const isAdminRoute = pathname.startsWith('/admin');

    if (!isAuthenticated && isAdminRoute) {
      router.push('/auth/login');
    }

    if (isAuthenticated && isAuthRoute) {
      router.push('/admin');
    }
  }, [isAuthenticated, pathname, router]);

  return <>{children}</>;
}
