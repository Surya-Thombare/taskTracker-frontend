'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistance } from 'date-fns';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Task } from '@/types/task';
import { ROUTES } from '@/lib/constants';
import { useTaskStore } from '@/store/task-store';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/lib/constants';

interface RecentTasksProps {
  tasks: Task[];
}

export default function RecentTasks({ tasks }: RecentTasksProps) {
  const { updateTask } = useTaskStore();
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      setUpdatingTaskId(taskId);
      await updateTask(taskId, { status: newStatus as any });
    } catch (error) {
      console.error('Failed to update task status:', error);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = TASK_PRIORITIES.find(p => p.value === priority);

    if (!priorityConfig) return null;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig.color}`}>
        {priorityConfig.label}
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getDueDateColor = (dueDate: string, status: string) => {
    if (status === 'completed') return 'text-gray-500';

    const now = new Date();
    const due = new Date(dueDate);

    // Past due
    if (due < now) return 'text-red-600';

    // Due today
    if (
      due.getDate() === now.getDate() &&
      due.getMonth() === now.getMonth() &&
      due.getFullYear() === now.getFullYear()
    ) {
      return 'text-yellow-600 font-medium';
    }

    // Due within 2 days
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(now.getDate() + 2);
    if (due <= twoDaysFromNow) return 'text-yellow-600';

    return 'text-gray-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Tasks</h3>
      </div>

      {tasks.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500">No recent tasks found.</p>
          <Link
            href={ROUTES.TASKS}
            className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Create a task
            <svg
              className="ml-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <li key={task._id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0 flex-1">
                  <div className="mr-3">
                    {getStatusIcon(task.status)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={ROUTES.TASK_DETAILS(task._id)}
                      className="text-sm font-medium text-gray-900 hover:text-blue-600"
                    >
                      {task.title}
                    </Link>

                    <div className="flex items-center mt-1 text-xs text-gray-500 space-x-2">
                      <span>
                        {typeof task.group === 'object' ? (
                          task.group.name
                        ) : (
                          'Unknown Group'
                        )}
                      </span>
                      <span>•</span>
                      <span className={getDueDateColor(task.dueDate, task.status)}>
                        Due {formatDistance(new Date(task.dueDate), new Date(), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {getPriorityBadge(task.priority)}

                  <div className="relative ml-2">
                    {updatingTaskId === task._id ? (
                      <div className="w-5 h-5 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
                    ) : (
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        className="block w-full bg-white border border-gray-300 rounded-md shadow-sm py-1 pl-3 pr-8 text-xs"
                      >
                        {TASK_STATUSES.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <Link
          href={ROUTES.TASKS}
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          View all tasks
        </Link>
      </div>
    </div>
  );
}