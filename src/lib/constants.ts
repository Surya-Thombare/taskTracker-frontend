import dotenv from 'dotenv';
dotenv.config();

// export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://64.227.176.70:3000/api';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://64.227.176.70:3000';
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: 'tasktrack_access_token',
  REFRESH_TOKEN: 'tasktrack_refresh_token',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  DASHBOARD: '/dashboard',
  TASKS: '/tasks',
  TASK_DETAILS: (id: string) => `/tasks/${id}`,
  GROUPS: '/groups',
  GROUP_DETAILS: (id: string) => `/groups/${id}`,
  TIMER: '/timer',
  PROFILE: '/profile',
};

export const TASK_PRIORITIES = [
  { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' },
];

export const TASK_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'bg-gray-100 text-gray-800' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
];