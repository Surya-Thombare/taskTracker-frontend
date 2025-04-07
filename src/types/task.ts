import { User } from './auth';
import { Group } from './group';

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task {
  _id: string;
  title: string;
  description: string;
  creator: string | User;
  group: string | Group;
  status: TaskStatus;
  priority: TaskPriority;
  estimatedTime: number; // in minutes
  dueDate: string;
  tags: string[];
  assignees: string[] | User[];
  activeTimers?: number;
  totalTimers?: number;
  completedBy?: string[] | User[];
  createdAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  groupId: string;
  estimatedTime: number;
  dueDate: string;
  priority: TaskPriority;
  tags?: string[];
  assigneeIds?: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  estimatedTime?: number;
  dueDate?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  tags?: string[];
  assigneeIds?: string[];
}

export interface TasksResponse {
  success: boolean;
  message: string;
  data: {
    tasks: Task[];
  };
  meta: {
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface TaskResponse {
  success: boolean;
  message: string;
  data: {
    task: Task;
  };
}