'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import RegisterForm from '@/components/auth/register-form';
import { useAuthStore } from '@/store/auth-store';
import { ROUTES } from '@/lib/constants';

export default function RegisterPage() {
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

        <RegisterForm />
      </div>

      {/* Right side - image/illustrations (hidden on small screens) */}
      <div className="hidden lg:block lg:w-1/2">
        <div className="flex items-center justify-center h-full bg-blue-600">
          <div className="max-w-md p-8 text-white">
            <h2 className="text-3xl font-bold mb-6">Join TaskTrack Today</h2>
            <p className="mb-8 text-lg text-blue-100">
              Create your account to start managing tasks, tracking time, and collaborating with your team more effectively.
            </p>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-500 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Create and assign tasks</h3>
                  <p className="text-blue-100">Organize your work and delegate tasks to team members</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-500 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Track time efficiently</h3>
                  <p className="text-blue-100">Monitor time spent on tasks and improve productivity</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-500 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Collaborate with your team</h3>
                  <p className="text-blue-100">Work together seamlessly on shared projects and tasks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}