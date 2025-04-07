import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Timer,
  User,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import { useAuthStore } from '@/store/auth-store';
import Image from 'next/image';

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const SidebarItem = ({ href, icon, label, isActive }: SidebarItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center p-3 rounded-lg transition-colors mb-1",
        isActive
          ? "bg-blue-100 text-blue-900"
          : "hover:bg-gray-100 text-gray-700"
      )}
    >
      <div className="mr-3">{icon}</div>
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    window.location.href = ROUTES.LOGIN;
  };

  const menuItems = [
    {
      href: ROUTES.DASHBOARD,
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
    },
    {
      href: ROUTES.TASKS,
      icon: <CheckSquare size={20} />,
      label: 'Tasks',
    },
    {
      href: ROUTES.GROUPS,
      icon: <Users size={20} />,
      label: 'Groups',
    },
    {
      href: ROUTES.TIMER,
      icon: <Timer size={20} />,
      label: 'Timer',
    },
    {
      href: ROUTES.PROFILE,
      icon: <User size={20} />,
      label: 'Profile',
    },
  ];

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <Link href={ROUTES.DASHBOARD} className="flex items-center">
          <Image src="/logo.svg" alt="TaskTrack" className="h-8 w-8 mr-2" />
          <span className="text-xl font-bold">TaskTrack</span>
        </Link>
      </div>

      <div className="flex-1 px-4 py-2">
        <nav className="flex flex-col">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}
            />
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center p-3 rounded-lg w-full hover:bg-gray-100 text-gray-700"
        >
          <LogOut size={20} className="mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}