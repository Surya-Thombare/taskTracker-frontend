"use client"

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { ROUTES } from '@/lib/constants';
import Header from './header';
import Sidebar from './sidebar';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { isAuthenticated, user, fetchUserProfile, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Check if the current route is a public route (login, register, etc.)
  const isPublicRoute =
    pathname.startsWith('/auth/') ||
    pathname === '/' ||
    pathname === '/auth';

  useEffect(() => {
    if (!isAuthenticated && !isLoading && !isPublicRoute) {
      // User is not authenticated and trying to access a protected route
      router.push(ROUTES.LOGIN);
    } else if (isAuthenticated && !user && !isLoading) {
      // User is authenticated but profile is not loaded
      fetchUserProfile();
    }
  }, [isAuthenticated, user, fetchUserProfile, isLoading, isPublicRoute, router]);

  // If on a public route, just render children without the app shell
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // If loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // For authenticated routes, show the full app shell
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}