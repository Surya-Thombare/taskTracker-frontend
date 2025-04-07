import React from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useTimerStore } from '@/store/timer-store';
import { formatDuration } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import Image from 'next/image';

export default function Header() {
  const { user } = useAuthStore();
  const { activeTimer, elapsedTime } = useTimerStore();

  return (
    <header className="h-16 w-full bg-card border-b border-border px-6 flex items-center justify-between">
      <div className="flex items-center">
        {/* Mobile logo - only show on small screens */}
        <div className="md:hidden">
          <Link href={ROUTES.DASHBOARD}>
            <Image src="/logo.svg" width={20} alt="TaskTrack" className="h-8 w-8" />
          </Link>
        </div>
      </div>

      {/* Active timer display */}
      {activeTimer && (
        <div className="hidden md:flex items-center bg-blue-50 px-4 py-2 rounded-lg">
          <Timer height={20} width={20} className="text-blue-500 mr-2" />
          <div>
            <div className="text-sm text-blue-900 font-medium">
              {typeof activeTimer.task === 'object' ? activeTimer.task.title : 'Current Task'}
            </div>
            <div className="text-xs text-blue-700">
              {formatDuration(Math.floor(elapsedTime / 60))}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell size={20} />
        </button>

        <Link href={ROUTES.PROFILE} className="flex items-center">
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt={`${user.firstName} ${user.lastName}`}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}

// Adding a Timer icon component since we're not importing from the UI components
function Timer(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}