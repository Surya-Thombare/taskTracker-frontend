'use client';

import { useEffect, useState } from 'react';
import { PlusCircle, UsersRound } from 'lucide-react';
import { useGroupStore } from '@/store/group-store';
import GroupList from '@/components/groups/group-list';
import GroupForm from '@/components/groups/group-form';
import { toast } from 'sonner';

export default function GroupsPage() {
  const {
    myGroups,
    publicGroups,
    isLoading,
    error,
    fetchGroups,
    createGroup
  } = useGroupStore();

  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joiningGroup, setJoiningGroup] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleCreateGroup = async (groupData: any) => {
    try {
      setCreating(true);
      await createGroup(groupData);
      setShowForm(false);
      toast.success("Group created successfully!");
    } catch (err) {
      console.error('Error creating group:', err);
      toast.error("Failed to create group. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!joinCode.trim()) {
      toast.error("Please enter an invite code");
      return;
    }

    try {
      setJoiningGroup(true);
      await useGroupStore.getState().joinGroup(joinCode);
      setJoinCode('');
      toast.success("Successfully joined the group!");
    } catch (err) {
      console.error('Error joining group:', err);
      toast.error("Invalid or expired invite code");
    } finally {
      setJoiningGroup(false);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Groups</h1>
          <p className="text-gray-600">Manage your groups and collaborations</p>
        </div>

        <div className="mt-4 md:mt-0">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {showForm ? (
              <>Cancel</>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Group
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          <p>{error}</p>
          <button
            className="mt-2 text-sm font-medium underline"
            onClick={() => fetchGroups()}
          >
            Try again
          </button>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Create a New Group</h2>
          <GroupForm
            onSubmit={handleCreateGroup}
            isLoading={creating}
          />
        </div>
      )}

      {!showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Join a Group</h2>

          <div className="flex items-stretch">
            <input
              type="text"
              placeholder="Enter invite code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="flex-1 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleJoinGroup}
              disabled={joiningGroup}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {joiningGroup ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                  Joining...
                </div>
              ) : (
                <>
                  <UsersRound className="mr-2 h-4 w-4" />
                  Join Group
                </>
              )}
            </button>
          </div>

          {joinError && (
            <p className="mt-2 text-xs text-red-600">{joinError}</p>
          )}

          <p className="mt-2 text-xs text-gray-500">
            Enter the invite code provided by the group leader to join the group
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-8">
          <GroupList
            groups={myGroups}
            title="My Groups"
            emptyMessage="You haven't joined any groups yet."
          />

          <GroupList
            groups={publicGroups}
            title="Public Groups"
            emptyMessage="No public groups available."
          />
        </div>
      )}
    </div>
  );
}