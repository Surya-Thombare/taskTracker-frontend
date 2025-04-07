export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  avatar?: string;
  groups: string[];
  tasksCompleted?: number;
  taskCompletionRate?: number;
  totalTimeSpent?: number;
  joinedAt?: string;
  lastActive?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface TokenResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  bio?: string;
  avatar?: string;
}