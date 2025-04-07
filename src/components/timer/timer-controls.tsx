import React, { useState, useEffect } from 'react';
import { Play, Clock } from 'lucide-react';
import { Task } from '@/types/task';
import { useTaskStore } from '@/store/task-store';

interface TimerControlsProps {
  onStartTimer: (taskId: string) => Promise<void>;
  isStarting: boolean;
}

export default function TimerControls({ onStartTimer, isStarting }: TimerControlsProps) {
  const { tasks, fetchTasks } = useTaskStore();
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      await fetchTasks({ status: 'pending,in-progress' });
      setIsLoading(false);
    };

    loadTasks();
  }, [fetchTasks]);

  const handleStartTimer = async () => {
    if (!selectedTaskId) return;
    await onStartTimer(selectedTaskId);
  };

  const renderTaskOption = (task: Task) => {
    // Get due date text
    const getDueDateText = () => {
      const now = new Date();
      const due = new Date(task.dueDate);

      // Past due
      if (due < now) {
        return 'Overdue';
      }

      // Due today
      if (
        due.getDate() === now.getDate() &&
        due.getMonth() === now.getMonth() &&
        due.getFullYear() === now.getFullYear()
      ) {
        return 'Due today';
      }

      // Due in the future
      return `Due ${due.toLocaleDateString()}`;
    };

    // Get group name
    const groupName = typeof task.group === 'object' ? task.group.name : 'Unknown Group';

    return (
      <option key={task._id} value={task._id}>
        {task.title} - {groupName} ({getDueDateText()})
      </option>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-6">
        <Clock className="h-8 w-8 text-blue-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900">Start a New Timer</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="task-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select a Task
          </label>

          {isLoading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 mr-2 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
              <span className="text-sm text-gray-500">Loading tasks...</span>
            </div>
          ) : tasks.length === 0 ? (
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-500">
                No pending or in-progress tasks found. Create a new task to start tracking time.
              </p>
            </div>
          ) : (
            <select
              id="task-select"
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>
                Select a task to work on
              </option>
              {tasks.map(renderTaskOption)}
            </select>
          )}
        </div>

        <button
          onClick={handleStartTimer}
          disabled={!selectedTaskId || isStarting}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isStarting ? (
            <div className="flex items-center">
              <div className="w-4 h-4 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
              Starting Timer...
            </div>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start Timer
            </>
          )}
        </button>
      </div>
    </div>
  );
}