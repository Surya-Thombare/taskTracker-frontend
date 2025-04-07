import { Task } from './task';
import { User } from './auth';

export interface Timer {
  _id: string;
  task: string | Task;
  user?: string | User;
  startTime: string;
  endTime?: string;
  duration?: number; // in minutes
  isActive: boolean;
  isCompleted?: boolean;
  completedOnTime?: boolean;
  notes?: string;
}

export interface TimerResponse {
  success: boolean;
  message: string;
  data: {
    timer: Timer;
  };
}

export interface TimersResponse {
  success: boolean;
  message: string;
  data: {
    timers: Timer[];
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

export interface StartTimerRequest {
  taskId: string;
  socketId?: string;
}

export interface CompleteTimerRequest {
  notes?: string;
  socketId?: string;
}