'use client';

import { useEffect, useState } from 'react';
import {
  CheckCircle,
  Clock,
  ArrowUpCircle,
  Calendar
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useTimerStore } from '@/store/timer-store';
import { formatDuration } from '@/lib/utils';
import api from '@/lib/api';
import StatsCard from '@/components/dashboard/stats-card';
import ActivityChart from '@/components/dashboard/activity-chart';
import RecentTasks from '@/components/dashboard/recent-tasks';

interface DashboardStats {
  userStats: {
    tasksCompleted: number;
    taskCompletionRate: number;
    totalTimeSpent: number;
  };
  activeTimer: {
    _id: string;
    task: {
      _id: string;
      title: string;
      description: string;
      estimatedTime: number;
      dueDate: string;
    };
    startTime: string;
    duration: number;
  } | null;
  taskCounts: {
    pending: number;
    inProgress: number;
    recentlyCompleted: number;
  };
  recentTimers: any[];
  dailyStats: {
    date: string;
    totalTime: number;
    tasksCompleted: number;
  }[];
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { activeTimer, startTimer, completeTimer } = useTimerStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users/dashboard');
        setDashboardData(response.data.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        <p>{error}</p>
        <button
          className="mt-2 text-sm font-medium underline"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Tasks Completed"
          value={dashboardData.userStats.tasksCompleted}
          icon="tasks"
        />
        <StatsCard
          title="Completion Rate"
          value={`${dashboardData.userStats.taskCompletionRate}%`}
          icon="completion"
        />
        <StatsCard
          title="Time Spent"
          value={formatDuration(dashboardData.userStats.totalTimeSpent)}
          icon="time"
        />
        <StatsCard
          title="Active Tasks"
          value={dashboardData.taskCounts.inProgress}
          subValue={`${dashboardData.taskCounts.pending} pending`}
          icon="streak"
        />
      </div>

      {/* Active Timer Card */}
      {activeTimer && (
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-blue-900 mb-4">Currently Working On</h3>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-500 mr-2" />
                <h4 className="text-xl font-medium text-gray-900">
                  {typeof activeTimer.task === 'object' ? activeTimer.task.title : 'Current Task'}
                </h4>
              </div>
              <p className="text-gray-600 mt-1">
                {typeof activeTimer.task === 'object' ? activeTimer.task.description : ''}
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <button
                onClick={() => completeTimer()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete Task
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2">
          <ActivityChart data={dashboardData.dailyStats} />
        </div>

        {/* Tasks */}
        <div className="lg:col-span-1">
          <RecentTasks
            tasks={[
              // Combine pending and in-progress tasks for the recent tasks list
              ...dashboardData.taskCounts.pending > 0 ? [{
                _id: '1',
                title: 'Pending Task',
                description: 'This is a pending task',
                status: 'pending',
                priority: 'medium',
                dueDate: new Date().toISOString(),
                group: { name: 'Test Group' },
                creator: user?._id || '',
                estimatedTime: 60,
                tags: [],
                assignees: [],
                createdAt: new Date().toISOString()
              }] : [],
              ...dashboardData.taskCounts.inProgress > 0 ? [{
                _id: '2',
                title: 'In Progress Task',
                description: 'This is an in-progress task',
                status: 'in-progress',
                priority: 'high',
                dueDate: new Date().toISOString(),
                group: { name: 'Test Group' },
                creator: user?._id || '',
                estimatedTime: 120,
                tags: [],
                assignees: [],
                createdAt: new Date().toISOString()
              }] : [],
              ...dashboardData.taskCounts.recentlyCompleted > 0 ? [{
                _id: '3',
                title: 'Completed Task',
                description: 'This is a completed task',
                status: 'completed',
                priority: 'low',
                dueDate: new Date().toISOString(),
                group: { name: 'Test Group' },
                creator: user?._id || '',
                estimatedTime: 30,
                tags: [],
                assignees: [],
                createdAt: new Date().toISOString()
              }] : [],
            ]}
          />
        </div>
      </div>
    </div>
  );
}