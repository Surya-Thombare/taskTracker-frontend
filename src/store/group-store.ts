import { create } from 'zustand';
import api from '@/lib/api';
import {
  Group,
  GroupsResponse,
  GroupResponse,
  CreateGroupRequest,
  UpdateGroupRequest,
  GroupLeaderboardResponse,
  GroupLeaderboardEntry
} from '@/types/group';

interface GroupState {
  myGroups: Group[];
  publicGroups: Group[];
  currentGroup: Group | null;
  groupStats: {
    pendingTasks: number;
    inProgressTasks: number;
    completedTasks: number;
    activeTimers: number;
  } | null;
  leaderboard: GroupLeaderboardEntry[];
  userRole: 'leader' | 'member' | 'guest' | null;
  isLoading: boolean;
  error: string | null;

  // Group list operations
  fetchGroups: () => Promise<void>;

  // Single group operations
  fetchGroup: (groupId: string) => Promise<void>;
  createGroup: (group: CreateGroupRequest) => Promise<Group>;
  updateGroup: (groupId: string, updates: UpdateGroupRequest) => Promise<Group>;

  // Group membership operations
  joinGroup: (inviteCode: string) => Promise<Group>;
  leaveGroup: (groupId: string) => Promise<void>;
  addMember: (groupId: string, email: string) => Promise<void>;
  removeMember: (groupId: string, memberId: string) => Promise<void>;
  promoteToLeader: (groupId: string, memberId: string) => Promise<void>;
  demoteToMember: (groupId: string, leaderId: string) => Promise<void>;
  regenerateInviteCode: (groupId: string) => Promise<string>;

  // Leaderboard
  fetchLeaderboard: (groupId: string) => Promise<void>;

  // State management
  clearCurrentGroup: () => void;
  clearError: () => void;
  reset: () => void;
}

export const useGroupStore = create<GroupState>((set, get) => ({
  myGroups: [],
  publicGroups: [],
  currentGroup: null,
  groupStats: null,
  leaderboard: [],
  userRole: null,
  isLoading: false,
  error: null,

  fetchGroups: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.get<GroupsResponse>('/groups');

      set({
        myGroups: response.data.data.myGroups,
        publicGroups: response.data.data.publicGroups,
        isLoading: false,
      });
    } catch (error) {
      let errorMessage = 'Failed to fetch groups';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchGroup: async (groupId: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.get<GroupResponse>(`/groups/${groupId}`);

      set({
        currentGroup: response.data.data.group,
        groupStats: response.data.data.stats || null,
        userRole: response.data.data.userRole,
        isLoading: false,
      });
    } catch (error) {
      let errorMessage = 'Failed to fetch group details';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, isLoading: false });
    }
  },

  createGroup: async (group: CreateGroupRequest) => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.post<{
        success: boolean;
        message: string;
        data: { group: Group }
      }>('/groups', group);

      const newGroup = response.data.data.group;

      set((state) => ({
        myGroups: [...state.myGroups, newGroup],
        isLoading: false,
      }));

      return newGroup;
    } catch (error) {
      let errorMessage = 'Failed to create group';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateGroup: async (groupId: string, updates: UpdateGroupRequest) => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.patch<{
        success: boolean;
        message: string;
        data: { group: Group }
      }>(`/groups/${groupId}`, updates);

      const updatedGroup = response.data.data.group;

      set((state) => ({
        myGroups: state.myGroups.map((group) =>
          group._id === groupId ? { ...group, ...updatedGroup } : group
        ),
        currentGroup: state.currentGroup?._id === groupId
          ? { ...state.currentGroup, ...updatedGroup }
          : state.currentGroup,
        isLoading: false,
      }));

      return updatedGroup;
    } catch (error) {
      let errorMessage = 'Failed to update group';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  joinGroup: async (inviteCode: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.post<{
        success: boolean;
        message: string;
        data: { group: Group }
      }>('/groups/join', { inviteCode });

      const joinedGroup = response.data.data.group;

      set((state) => ({
        myGroups: [...state.myGroups, joinedGroup],
        isLoading: false,
      }));

      return joinedGroup;
    } catch (error) {
      let errorMessage = 'Failed to join group';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  leaveGroup: async (groupId: string) => {
    try {
      set({ isLoading: true, error: null });

      await api.delete(`/groups/${groupId}/members/me`);

      set((state) => ({
        myGroups: state.myGroups.filter((group) => group._id !== groupId),
        currentGroup: state.currentGroup?._id === groupId ? null : state.currentGroup,
        isLoading: false,
      }));
    } catch (error) {
      let errorMessage = 'Failed to leave group';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  addMember: async (groupId: string, email: string) => {
    try {
      set({ isLoading: true, error: null });

      await api.post(`/groups/${groupId}/members`, { email });

      // Refresh group data to get updated members list
      await get().fetchGroup(groupId);

      set({ isLoading: false });
    } catch (error) {
      let errorMessage = 'Failed to add member';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  removeMember: async (groupId: string, memberId: string) => {
    try {
      set({ isLoading: true, error: null });

      await api.delete(`/groups/${groupId}/members/${memberId}`);

      // Refresh group data to get updated members list
      await get().fetchGroup(groupId);

      set({ isLoading: false });
    } catch (error) {
      let errorMessage = 'Failed to remove member';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  promoteToLeader: async (groupId: string, memberId: string) => {
    try {
      set({ isLoading: true, error: null });

      await api.post(`/groups/${groupId}/members/${memberId}/promote`);

      // Refresh group data to get updated members/leaders lists
      await get().fetchGroup(groupId);

      set({ isLoading: false });
    } catch (error) {
      let errorMessage = 'Failed to promote member';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  demoteToMember: async (groupId: string, leaderId: string) => {
    try {
      set({ isLoading: true, error: null });

      await api.post(`/groups/${groupId}/leaders/${leaderId}/demote`);

      // Refresh group data to get updated members/leaders lists
      await get().fetchGroup(groupId);

      set({ isLoading: false });
    } catch (error) {
      let errorMessage = 'Failed to demote leader';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  regenerateInviteCode: async (groupId: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.post<{
        success: boolean;
        message: string;
        data: { inviteCode: string }
      }>(`/groups/${groupId}/invite`);

      const newInviteCode = response.data.data.inviteCode;

      // Update the current group with the new invite code
      if (get().currentGroup?._id === groupId) {
        set((state) => ({
          currentGroup: state.currentGroup
            ? { ...state.currentGroup, inviteCode: newInviteCode }
            : null,
        }));
      }

      set({ isLoading: false });

      return newInviteCode;
    } catch (error) {
      let errorMessage = 'Failed to regenerate invite code';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  fetchLeaderboard: async (groupId: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.get<GroupLeaderboardResponse>(`/groups/${groupId}/leaderboard`);

      set({
        leaderboard: response.data.data.leaderboard,
        isLoading: false,
      });
    } catch (error) {
      let errorMessage = 'Failed to fetch leaderboard';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, isLoading: false });
    }
  },

  clearCurrentGroup: () => {
    set({
      currentGroup: null,
      groupStats: null,
      userRole: null,
      leaderboard: [],
    });
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({
      myGroups: [],
      publicGroups: [],
      currentGroup: null,
      groupStats: null,
      leaderboard: [],
      userRole: null,
      isLoading: false,
      error: null,
    });
  },
}));