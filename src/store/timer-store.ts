import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '@/lib/api';
import socketClient from '@/lib/socket';
import {
  Timer,
  TimerResponse,
  TimersResponse,
  StartTimerRequest,
  CompleteTimerRequest
} from '@/types/timer';

interface TimerState {
  activeTimer: Timer | null;
  timerHistory: Timer[];
  startTime: number | null;
  elapsedTime: number; // in seconds
  isRunning: boolean;
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

  // Timer operations
  fetchActiveTimer: () => Promise<void>;
  fetchTimerHistory: (taskId?: string) => Promise<void>;
  startTimer: (taskId: string) => Promise<void>;
  completeTimer: (notes?: string) => Promise<void>;

  // Local timer control
  tick: () => void;
  resetElapsedTime: () => void;

  // State management
  clearError: () => void;
  reset: () => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      activeTimer: null,
      timerHistory: [],
      startTime: null,
      elapsedTime: 0,
      isRunning: false,
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

      fetchActiveTimer: async () => {
        try {
          set({ isLoading: true, error: null });

          const response = await api.get<TimerResponse>('/timers/active');

          if (response.data.data.timer) {
            const timer = response.data.data.timer;
            const startTime = new Date(timer.startTime).getTime();
            const now = Date.now();
            const elapsedSeconds = Math.floor((now - startTime) / 1000);

            set({
              activeTimer: timer,
              startTime,
              elapsedTime: elapsedSeconds,
              isRunning: true,
              isLoading: false,
            });
          } else {
            // No active timer
            set({
              activeTimer: null,
              startTime: null,
              elapsedTime: 0,
              isRunning: false,
              isLoading: false,
            });
          }
        } catch (error) {
          // If 404 error, it means no active timer (which is fine)
          if (error.response?.status === 404) {
            set({
              activeTimer: null,
              startTime: null,
              elapsedTime: 0,
              isRunning: false,
              isLoading: false,
            });
            return;
          }

          let errorMessage = 'Failed to fetch active timer';
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      fetchTimerHistory: async (taskId?: string) => {
        try {
          set({ isLoading: true, error: null });

          let url = '/users/timers';
          if (taskId) {
            url = `/timers/task/${taskId}`;
          }

          const response = await api.get<TimersResponse>(url);

          set({
            timerHistory: response.data.data.timers,
            pagination: response.data.meta.pagination,
            isLoading: false,
          });
        } catch (error) {
          let errorMessage = 'Failed to fetch timer history';
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      startTimer: async (taskId: string) => {
        try {
          set({ isLoading: true, error: null });

          // Connect to socket if not already connected
          let socketId = '';
          try {
            socketId = socketClient.getSocketId() || socketClient.connect();
          } catch (socketError) {
            console.error('Socket connection failed:', socketError);
            // Continue without socket
          }

          const request: StartTimerRequest = {
            taskId,
            socketId,
          };

          const response = await api.post<TimerResponse>('/timers/start', request);

          const timer = response.data.data.timer;
          const startTime = new Date(timer.startTime).getTime();

          set({
            activeTimer: timer,
            startTime,
            elapsedTime: 0,
            isRunning: true,
            isLoading: false,
          });
        } catch (error) {
          let errorMessage = 'Failed to start timer';
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      completeTimer: async (notes?: string) => {
        try {
          set({ isLoading: true, error: null });

          // Get socket ID if connected
          let socketId = '';
          try {
            socketId = socketClient.getSocketId();
          } catch {
            // Continue without socket
          }

          const request: CompleteTimerRequest = {
            notes,
            socketId,
          };

          await api.post<TimerResponse>('/timers/complete', request);

          set({
            activeTimer: null,
            startTime: null,
            elapsedTime: 0,
            isRunning: false,
            isLoading: false,
          });
        } catch (error) {
          let errorMessage = 'Failed to complete timer';
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      tick: () => {
        const { startTime, isRunning } = get();

        if (isRunning && startTime) {
          const now = Date.now();
          const elapsedSeconds = Math.floor((now - startTime) / 1000);

          set({ elapsedTime: elapsedSeconds });
        }
      },

      resetElapsedTime: () => {
        set({ elapsedTime: 0 });
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set({
          activeTimer: null,
          timerHistory: [],
          startTime: null,
          elapsedTime: 0,
          isRunning: false,
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
    }),
    {
      name: 'timer-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeTimer: state.activeTimer,
        startTime: state.startTime,
        elapsedTime: state.elapsedTime,
        isRunning: state.isRunning,
      }),
    }
  )
);

// Set up a timer to update elapsed time every second
if (typeof window !== 'undefined') {
  setInterval(() => {
    const { isRunning } = useTimerStore.getState();
    if (isRunning) {
      useTimerStore.getState().tick();
    }
  }, 1000);
}