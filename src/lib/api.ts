import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_URL, LOCAL_STORAGE_KEYS } from './constants';
import { refreshAccessToken } from './auth';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);

        if (!refreshToken) {
          // No refresh token, redirect to login
          window.location.href = '/auth/login';
          return Promise.reject(error);
        }

        // Call the refresh token endpoint
        const response = await refreshAccessToken(refreshToken);

        // Store the new access token
        localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, response.data.accessToken);

        // Update the failed request with the new token and retry
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message || axiosError.message || 'An error occurred';
  }
  return 'An unexpected error occurred';
};