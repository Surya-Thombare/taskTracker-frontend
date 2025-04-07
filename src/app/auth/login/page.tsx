'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LoginForm from '@/components/auth/login-form';
import { useAuthStore } from '@/store/auth-store';
import { ROUTES } from '@/lib/constants';

export default function LoginPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side - form */}
      <div className="flex flex-col items-center justify-center w-full px-4 py-12 sm:px-6 lg:px-8 lg:w-1/2">
        <div className="flex items-center mb-8">
          <Image src="/logo.svg" alt="TaskTrack" width={40} height={40} />
          <span className="ml-2 text-2xl font-bold">TaskTrack</span>
        </div>

        <LoginForm />
      </div>

      {/* Right side - image/illustrations (hidden on small screens) */}
      <div className="hidden lg:block lg:w-1/2">
        <div className="flex items-center justify-center h-full bg-blue-600">
          <div className="max-w-md p-8 text-white">
            <h2 className="text-3xl font-bold mb-6">Track. Manage. Succeed.</h2>
            <p className="mb-8 text-lg text-blue-100">
              TaskTrack helps you manage your tasks efficiently, track time, and collaborate with your team to achieve more.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-500 rounded-lg">
                <div className="mb-2">⏱️</div>
                <h3 className="text-lg font-semibold mb-1">Time Tracking</h3>
                <p className="text-sm text-blue-100">Track time spent on tasks to improve productivity</p>
              </div>
              <div className="p-4 bg-blue-500 rounded-lg">
                <div className="mb-2">👥</div>
                <h3 className="text-lg font-semibold mb-1">Team Collaboration</h3>
                <p className="text-sm text-blue-100">Work together with your team effortlessly</p>
              </div>
              <div className="p-4 bg-blue-500 rounded-lg">
                <div className="mb-2">📊</div>
                <h3 className="text-lg font-semibold mb-1">Progress Analytics</h3>
                <p className="text-sm text-blue-100">View insights on your productivity and progress</p>
              </div>
              <div className="p-4 bg-blue-500 rounded-lg">
                <div className="mb-2">🏆</div>
                <h3 className="text-lg font-semibold mb-1">Goal Achievement</h3>
                <p className="text-sm text-blue-100">Set milestones and celebrate achievements</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}