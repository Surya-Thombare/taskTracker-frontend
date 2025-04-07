import { User } from './auth';

export interface Group {
  _id: string;
  name: string;
  description: string;
  isPublic: boolean;
  avatar?: string;
  creator: string | User;
  leaders?: string[] | User[];
  members?: string[] | User[];
  completedTasks?: number;
  totalTasks?: number;
  totalTimeSpent?: number;
  inviteCode?: string;
  createdAt: string;
  lastActive?: string;
  role?: 'leader' | 'member' | 'guest';
}

export interface GroupStats {
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  activeTimers: number;
}

export interface CreateGroupRequest {
  name: string;
  description: string;
  isPublic: boolean;
}

export interface UpdateGroupRequest {
  name?: string;
  description?: string;
  isPublic?: boolean;
  avatar?: string;
}

export interface GroupsResponse {
  success: boolean;
  message: string;
  data: {
    myGroups: Group[];
    publicGroups: Group[];
  };
}

export interface GroupResponse {
  success: boolean;
  message: string;
  data: {
    group: Group;
    stats?: GroupStats;
    userRole: 'leader' | 'member' | 'guest';
  };
}

export interface GroupLeaderboardEntry {
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  tasksCompleted: number;
  totalTime: number;
  completionRate: number;
  isLeader: boolean;
}

export interface GroupLeaderboardResponse {
  success: boolean;
  message: string;
  data: {
    leaderboard: GroupLeaderboardEntry[];
  };
}