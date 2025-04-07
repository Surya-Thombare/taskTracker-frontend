import React from 'react';
import Link from 'next/link';
import { AlertCircle, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { Task } from '@/types/task';
import { ROUTES, TASK_PRIORITIES, TASK_STATUSES } from '@/lib/constants';
import { formatDuration } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onStatusChange?: (taskId: string, status: string) => void;
  isUpdating?: boolean;
}

export default function TaskCard({ task, onStatusChange, isUpdating }: TaskCardProps) {
  // Handle task objects where creator and group might be objects or IDs
  const creatorName = typeof task.creator === 'object'
    ? `${task.creator.firstName} ${task.creator.lastName}`
    : 'Unknown';

  const groupName = typeof task.group === 'object'
    ? task.group.name
    : 'Unknown Group';

  // Find priority and status config
  const priorityConfig = TASK_PRIORITIES.find(p => p.value === task.priority);
  const statusConfig = TASK_STATUSES.find(s => s.value === task.status);

  // Get status icon
  const getStatusIcon = () => {
    switch (task.status) {
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

  // Get due date color and text
  const getDueDateInfo = () => {
    if (task.status === 'completed') {
      return { color: 'text-gray-500', text: 'Completed' };
    }

    const now = new Date();
    const due = new Date(task.dueDate);

    // Past due
    if (due < now) {
      return { color: 'text-red-600', text: 'Overdue' };
    }

    // Due today
    if (
      due.getDate() === now.getDate() &&
      due.getMonth() === now.getMonth() &&
      due.getFullYear() === now.getFullYear()
    ) {
      return { color: 'text-yellow-600 font-medium', text: 'Due today' };
    }

    return {
      color: 'text-gray-500',
      text: `Due ${formatDistance(due, now, { addSuffix: true })}`
    };
  };

  const dueDateInfo = getDueDateInfo();

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <div className="mr-3 mt-0.5">
              {getStatusIcon()}
            </div>
            <div>
              <Link
                href={ROUTES.TASK_DETAILS(task._id)}
                className="text-lg font-medium text-gray-900 hover:text-blue-600"
              >
                {task.title}
              </Link>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{task.description}</p>
            </div>
          </div>

          {priorityConfig && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig.color}`}>
              {priorityConfig.label}
            </span>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Estimated Time</p>
            <p className="text-sm font-medium">{formatDuration(task.estimatedTime)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Group</p>
            <p className="text-sm font-medium">{groupName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Created By</p>
            <p className="text-sm font-medium">{creatorName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Due Date</p>
            <p className={`text-sm font-medium ${dueDateInfo.color}`}>{dueDateInfo.text}</p>
          </div>
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="px-6 py-3 bg-gray-50 rounded-b-lg flex items-center justify-between">
        {onStatusChange ? (
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-2">Status:</span>
            {isUpdating ? (
              <div className="w-4 h-4 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
            ) : (
              <select
                value={task.status}
                onChange={(e) => onStatusChange(task._id, e.target.value)}
                className="block bg-white border border-gray-300 rounded-md shadow-sm py-1 pl-3 pr-8 text-xs"
              >
                {TASK_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        ) : (
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-2">Status:</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig?.color}`}>
              {statusConfig?.label}
            </span>
          </div>
        )}

        <Link
          href={ROUTES.TASK_DETAILS(task._id)}
          className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-500"
        >
          View Details <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}