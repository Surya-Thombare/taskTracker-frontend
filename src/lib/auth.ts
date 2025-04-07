import api from './api';
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  TokenResponse,
  User
} from '../types/auth';

export const registerUser = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', credentials);
  return response.data;
};

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const refreshAccessToken = async (refreshToken: string): Promise<TokenResponse> => {
  const response = await api.post<TokenResponse>('/auth/refresh-token', { refreshToken });
  return response.data;
};

export const getUserProfile = async (): Promise<User> => {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: User;
  }>('/auth/profile');
  return response.data.data;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.post<{ success: boolean; message: string }>('/users/change-password', {
    currentPassword,
    newPassword
  });
  return response.data;
};

export const updateUserProfile = async (profileData: {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
}): Promise<User> => {
  const response = await api.patch<{
    success: boolean;
    message: string;
    data: User;
  }>('/users/profile', profileData);
  return response.data.data;
};