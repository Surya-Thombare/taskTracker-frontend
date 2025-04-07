'use client';

import { useEffect, useState } from 'react';
import { PlusCircle, Filter } from 'lucide-react';
import { useTaskStore } from '@/store/task-store';
import TaskList from '@/components/tasks/task-list';
import TaskForm from '@/components/tasks/task-form';

export default function TasksPage() {
  const {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask
  } = useTaskStore();

  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (taskData: any) => {
    try {
      setCreating(true);
      await createTask(taskData);
      setShowForm(false);
    } catch (err) {
      console.error('Error creating task:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (taskId: string, status: string) => {
    try {
      await updateTask(taskId, { status: status as any });
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-gray-600">Manage and track your tasks</p>
        </div>

        <div className="mt-4 md:mt-0">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {showForm ? (
              <>
                <Filter className="mr-2 h-4 w-4" />
                Show Tasks
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Task
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          <p>{error}</p>
          <button
            className="mt-2 text-sm font-medium underline"
            onClick={() => fetchTasks()}
          >
            Try again
          </button>
        </div>
      )}

      {showForm ? (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Create a New Task</h2>
          <TaskForm
            onSubmit={handleCreateTask}
            isLoading={creating}
          />
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <TaskList
          tasks={tasks}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}