'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Trash,
  Clock,
  CheckCircle,
  Play,
  Tag,
  Users,
  CalendarClock
} from 'lucide-react';
import { format } from 'date-fns';
import { useTaskStore } from '@/store/task-store';
import { useTimerStore } from '@/store/timer-store';
import { formatDuration } from '@/lib/utils';
import { ROUTES, TASK_PRIORITIES, TASK_STATUSES } from '@/lib/constants';
import TaskForm from '@/components/tasks/task-form';

export default function TaskDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const taskId = id as string;
  const {
    currentTask,
    isLoading,
    error,
    fetchTask,
    updateTask,
    deleteTask
  } = useTaskStore();
  const {
    activeTimer,
    startTimer,
    completeTimer,
    fetchTimerHistory,
    timerHistory
  } = useTimerStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [startingTimer, setStartingTimer] = useState(false);

  useEffect(() => {
    fetchTask(taskId);
    fetchTimerHistory(taskId);
  }, [taskId, fetchTask, fetchTimerHistory]);

  const handleUpdateTask = async (formData: any) => {
    try {
      setIsUpdating(true);
      await updateTask(taskId, formData);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating task:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    try {
      setIsDeleting(true);
      await deleteTask(taskId);
      router.push(ROUTES.TASKS);
    } catch (err) {
      console.error('Error deleting task:', err);
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleStartTimer = async () => {
    try {
      setStartingTimer(true);
      await startTimer(taskId);
    } catch (err) {
      console.error('Error starting timer:', err);
    } finally {
      setStartingTimer(false);
    }
  };

  if (isLoading && !currentTask) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !currentTask) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        <p>{error || 'Task not found'}</p>
        <Link
          href={ROUTES.TASKS}
          className="mt-2 inline-block text-sm font-medium underline"
        >
          Back to Tasks
        </Link>
      </div>
    );
  }

  // Find priority and status config
  const priorityConfig = TASK_PRIORITIES.find(p => p.value === currentTask.priority);
  const statusConfig = TASK_STATUSES.find(s => s.value === currentTask.status);

  // Get creator and group name
  const creatorName = typeof currentTask.creator === 'object'
    ? `${currentTask.creator.firstName} ${currentTask.creator.lastName}`
    : 'Unknown';

  const groupName = typeof currentTask.group === 'object'
    ? currentTask.group.name
    : 'Unknown Group';

  // Get assignees names
  const assignees = Array.isArray(currentTask.assignees) && currentTask.assignees.length > 0
    ? currentTask.assignees.map(assignee =>
      typeof assignee === 'object'
        ? `${assignee.firstName} ${assignee.lastName}`
        : 'Unknown'
    )
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href={ROUTES.TASKS}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Tasks
        </Link>
      </div>

      {isEditing ? (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Edit Task</h2>
          <TaskForm
            initialData={currentTask}
            onSubmit={handleUpdateTask}
            isEditing={true}
            isLoading={isUpdating}
          />

          <div className="mt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-sm font-medium text-gray-600 hover:text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentTask.title}</h1>
                <div className="flex items-center mt-2 space-x-4">
                  {statusConfig && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  )}

                  {priorityConfig && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityConfig.color}`}>
                      {priorityConfig.label} Priority
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {!activeTimer && currentTask.status !== 'completed' && (
                  <button
                    onClick={handleStartTimer}
                    disabled={startingTimer}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {startingTimer ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                        Starting...
                      </div>
                    ) : (
                      <>
                        <Play className="mr-1.5 h-4 w-4" />
                        Start Timer
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Edit className="mr-1.5 h-4 w-4 text-gray-500" />
                  Edit
                </button>

                <button
                  onClick={handleDeleteTask}
                  disabled={isDeleting}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                      Deleting...
                    </div>
                  ) : (
                    <>
                      <Trash className="mr-1.5 h-4 w-4" />
                      {confirmDelete ? 'Confirm Delete' : 'Delete'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="prose max-w-none">
              <p>{currentTask.description}</p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Details</h3>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <CalendarClock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Due Date</p>
                      <p className="text-base">
                        {format(new Date(currentTask.dueDate), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Estimated Time</p>
                      <p className="text-base">{formatDuration(currentTask.estimatedTime)}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Group</p>
                      <p className="text-base">{groupName}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Created By</p>
                      <p className="text-base">{creatorName}</p>
                    </div>
                  </div>

                  {assignees.length > 0 && (
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Assignees</p>
                        <ul className="text-base list-disc list-inside ml-2">
                          {assignees.map((name, index) => (
                            <li key={index}>{name}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {currentTask.tags && currentTask.tags.length > 0 && (
                    <div className="flex items-start">
                      <Tag className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Tags</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {currentTask.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Timer History</h3>

                {timerHistory.length === 0 ? (
                  <p className="text-gray-500">No timer history yet.</p>
                ) : (
                  <div className="space-y-4">
                    {timerHistory.map((timer) => (
                      <div
                        key={timer._id}
                        className="flex items-start p-4 border border-gray-200 rounded-md"
                      >
                        {timer.isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        ) : (
                          <Clock className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                        )}

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">
                              {typeof timer.user === 'object'
                                ? `${timer.user.firstName} ${timer.user.lastName}`
                                : 'Unknown'
                              }
                            </p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(timer.startTime), 'MMM d, yyyy')}
                            </p>
                          </div>

                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <span>
                              {format(new Date(timer.startTime), 'h:mm a')}
                              {timer.endTime && ` - ${format(new Date(timer.endTime), 'h:mm a')}`}
                            </span>
                            {timer.duration && (
                              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {formatDuration(timer.duration)}
                              </span>
                            )}
                          </div>

                          {timer.notes && (
                            <p className="mt-2 text-sm text-gray-600">{timer.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}