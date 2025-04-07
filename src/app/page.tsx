'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { ROUTES } from '@/lib/constants';

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if authenticated, otherwise to login
    if (isAuthenticated) {
      router.push(ROUTES.DASHBOARD);
    } else {
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, router]);

  // Show loading indicator while redirecting
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}