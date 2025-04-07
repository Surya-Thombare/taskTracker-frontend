import { create } from 'zustand';
import api from '@/lib/api';
import { Task, TasksResponse, TaskResponse, CreateTaskRequest, UpdateTaskRequest } from '@/types/task';

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };

  // Task list operations
  fetchTasks: (params?: {
    groupId?: string;
    status?: string;
    priority?: string;
    page?: number;
    limit?: number;
  }) => Promise<void>;

  // Single task operations
  fetchTask: (taskId: string) => Promise<void>;
  createTask: (task: CreateTaskRequest) => Promise<Task>;
  updateTask: (taskId: string, updates: UpdateTaskRequest) => Promise<Task>;
  deleteTask: (taskId: string) => Promise<void>;

  // State management
  clearCurrentTask: () => void;
  clearError: () => void;
  reset: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },

  fetchTasks: async (params = {}) => {
    try {
      set({ isLoading: true, error: null });

      const queryParams = new URLSearchParams();

      if (params.groupId) queryParams.append('groupId', params.groupId);
      if (params.status) queryParams.append('status', params.status);
      if (params.priority) queryParams.append('priority', params.priority);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const response = await api.get<TasksResponse>(`/tasks?${queryParams.toString()}`);

      set({
        tasks: response.data.data.tasks,
        pagination: response.data.meta.pagination,
        isLoading: false,
      });
    } catch (error) {
      let errorMessage = 'Failed to fetch tasks';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchTask: async (taskId: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.get<TaskResponse>(`/tasks/${taskId}`);

      set({
        currentTask: response.data.data.task,
        isLoading: false,
      });
    } catch (error) {
      let errorMessage = 'Failed to fetch task details';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, isLoading: false });
    }
  },

  createTask: async (task: CreateTaskRequest) => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.post<TaskResponse>('/tasks', task);
      const newTask = response.data.data.task;

      set((state) => ({
        tasks: [...state.tasks, newTask],
        isLoading: false,
      }));

      return newTask;
    } catch (error) {
      let errorMessage = 'Failed to create task';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateTask: async (taskId: string, updates: UpdateTaskRequest) => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.patch<TaskResponse>(`/tasks/${taskId}`, updates);
      const updatedTask = response.data.data.task;

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId ? updatedTask : task
        ),
        currentTask: state.currentTask?._id === taskId ? updatedTask : state.currentTask,
        isLoading: false,
      }));

      return updatedTask;
    } catch (error) {
      let errorMessage = 'Failed to update task';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deleteTask: async (taskId: string) => {
    try {
      set({ isLoading: true, error: null });

      await api.delete(`/tasks/${taskId}`);

      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== taskId),
        currentTask: state.currentTask?._id === taskId ? null : state.currentTask,
        isLoading: false,
      }));
    } catch (error) {
      let errorMessage = 'Failed to delete task';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  clearCurrentTask: () => {
    set({ currentTask: null });
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({
      tasks: [],
      currentTask: null,
      isLoading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    });
  },
}));