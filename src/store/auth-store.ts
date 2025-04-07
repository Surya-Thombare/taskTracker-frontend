import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  loginUser,
  logoutUser,
  getUserProfile,
  refreshAccessToken
} from '@/lib/auth';
import { User, LoginCredentials } from '@/types/auth';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        try {
          set({ isLoading: true, error: null });
          const response = await loginUser(credentials);

          localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, response.data.tokens.accessToken);
          localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, response.data.tokens.refreshToken);

          set({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          let errorMessage = 'Failed to login';
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          await logoutUser();

          localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          // Still clear local data even if the API call fails
          localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },

      fetchUserProfile: async () => {
        try {
          set({ isLoading: true, error: null });
          const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

          if (!token) {
            set({ isLoading: false });
            return;
          }

          const user = await getUserProfile();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          let errorMessage = 'Failed to fetch user profile';
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          set({ error: errorMessage, isLoading: false });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setUser: (user) => {
        set({ user, isAuthenticated: true });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);