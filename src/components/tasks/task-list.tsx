import React, { useState } from 'react';
import { Task } from '@/types/task';
import { TASK_STATUSES, TASK_PRIORITIES } from '@/lib/constants';
import TaskCard from './task-card';

interface TaskListProps {
  tasks: Task[];
  showFilters?: boolean;
  onStatusChange?: (taskId: string, status: string) => Promise<void>;
}

export default function TaskList({ tasks, showFilters = true, onStatusChange }: TaskListProps) {
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
  });

  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = async (taskId: string, status: string) => {
    if (!onStatusChange) return;

    setUpdatingTaskId(taskId);
    await onStatusChange(taskId, status);
    setUpdatingTaskId(null);
  };

  // Apply filters to tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = !filters.status || task.status === filters.status;
    const matchesPriority = !filters.priority || task.priority === filters.priority;
    const matchesSearch = !filters.search
      || task.title.toLowerCase().includes(filters.search.toLowerCase())
      || task.description.toLowerCase().includes(filters.search.toLowerCase());

    return matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <div>
      {showFilters && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                id="search"
                name="search"
                type="text"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search tasks..."
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                {TASK_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Priorities</option>
                {TASK_PRIORITIES.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No tasks found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onStatusChange={onStatusChange ? handleStatusChange : undefined}
              isUpdating={updatingTaskId === task._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}