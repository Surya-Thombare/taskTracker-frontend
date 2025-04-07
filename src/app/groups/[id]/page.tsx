'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Copy,
  RefreshCcw,
  Users,
  UserPlus,
  Crown,
  LogOut,
  ShieldAlert,
  UserMinus,
  Trash,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { useGroupStore } from '@/store/group-store';
import { useTaskStore } from '@/store/task-store';
import { ROUTES } from '@/lib/constants';
import { formatDuration, getInitials } from '@/lib/utils';
import GroupForm from '@/components/groups/group-form';

export default function GroupDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const groupId = id as string;

  const {
    currentGroup,
    groupStats,
    userRole,
    leaderboard,
    isLoading,
    error,
    fetchGroup,
    fetchLeaderboard,
    updateGroup,
    regenerateInviteCode,
    leaveGroup,
    addMember,
    removeMember,
    promoteToLeader,
    demoteToMember
  } = useGroupStore();

  const { fetchTasks, tasks } = useTaskStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteErrorMsg, setInviteErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState({
    leaveGroup: false,
    copyInvite: false,
    regenerateInvite: false,
    invite: false,
    remove: '',
    promote: '',
    demote: ''
  });
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);

  useEffect(() => {
    fetchGroup(groupId);
    fetchLeaderboard(groupId);
    fetchTasks({ groupId });
  }, [groupId, fetchGroup, fetchLeaderboard, fetchTasks]);

  const handleUpdateGroup = async (formData: any) => {
    try {
      setIsUpdating(true);
      await updateGroup(groupId, formData);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating group:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyInviteCode = async () => {
    if (!currentGroup?.inviteCode) return;

    setLoading(prev => ({ ...prev, copyInvite: true }));

    try {
      await navigator.clipboard.writeText(currentGroup.inviteCode);
      // Show a success message or toast here if you want
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    } finally {
      setTimeout(() => {
        setLoading(prev => ({ ...prev, copyInvite: false }));
      }, 1000);
    }
  };

  const handleRegenerateInviteCode = async () => {
    setLoading(prev => ({ ...prev, regenerateInvite: true }));

    try {
      await regenerateInviteCode(groupId);
    } catch (err) {
      console.error('Error regenerating invite code:', err);
    } finally {
      setLoading(prev => ({ ...prev, regenerateInvite: false }));
    }
  };

  const handleLeaveGroup = async () => {
    if (!showConfirmLeave) {
      setShowConfirmLeave(true);
      return;
    }

    setLoading(prev => ({ ...prev, leaveGroup: true }));

    try {
      await leaveGroup(groupId);
      router.push(ROUTES.GROUPS);
    } catch (err) {
      console.error('Error leaving group:', err);
      setLoading(prev => ({ ...prev, leaveGroup: false }));
      setShowConfirmLeave(false);
    }
  };

  const handleAddMember = async () => {
    if (!inviteEmail) {
      setInviteErrorMsg('Please enter an email address');
      return;
    }

    setInviteErrorMsg(null);
    setLoading(prev => ({ ...prev, invite: true }));

    try {
      await addMember(groupId, inviteEmail);
      setInviteEmail('');
    } catch (err) {
      console.error('Error adding member:', err);
      setInviteErrorMsg('Failed to add member. Check the email address.');
    } finally {
      setLoading(prev => ({ ...prev, invite: false }));
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    setLoading(prev => ({ ...prev, remove: memberId }));

    try {
      await removeMember(groupId, memberId);
    } catch (err) {
      console.error('Error removing member:', err);
    } finally {
      setLoading(prev => ({ ...prev, remove: '' }));
    }
  };

  const handlePromoteToLeader = async (memberId: string) => {
    setLoading(prev => ({ ...prev, promote: memberId }));

    try {
      await promoteToLeader(groupId, memberId);
    } catch (err) {
      console.error('Error promoting member:', err);
    } finally {
      setLoading(prev => ({ ...prev, promote: '' }));
    }
  };

  const handleDemoteToMember = async (leaderId: string) => {
    setLoading(prev => ({ ...prev, demote: leaderId }));

    try {
      await demoteToMember(groupId, leaderId);
    } catch (err) {
      console.error('Error demoting leader:', err);
    } finally {
      setLoading(prev => ({ ...prev, demote: '' }));
    }
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  if (isLoading && !currentGroup) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !currentGroup) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        <p>{error || 'Group not found'}</p>
        <Link
          href={ROUTES.GROUPS}
          className="mt-2 inline-block text-sm font-medium underline"
        >
          Back to Groups
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href={ROUTES.GROUPS}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Groups
        </Link>
      </div>

      {isEditing ? (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Edit Group</h2>
          <GroupForm
            initialData={currentGroup}
            onSubmit={handleUpdateGroup}
            isEditing={true}
            isLoading={isUpdating}
          />

          <div className="mt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-sm font-medium text-gray-600 hover:text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  {currentGroup.avatar ? (
                    <img
                      src={currentGroup.avatar}
                      alt={currentGroup.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-blue-100 flex items-center justify-center text-blue-800 font-semibold text-xl">
                      {currentGroup.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="ml-4">
                    <h1 className="text-2xl font-bold text-gray-900">{currentGroup.name}</h1>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentGroup.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {currentGroup.isPublic ? 'Public' : 'Private'}
                      </span>

                      {userRole && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {userRole === 'leader' && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Edit className="mr-1.5 h-4 w-4 text-gray-500" />
                      Edit
                    </button>
                  )}

                  <button
                    onClick={handleLeaveGroup}
                    disabled={loading.leaveGroup}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading.leaveGroup ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                        Leaving...
                      </div>
                    ) : (
                      <>
                        <LogOut className="mr-1.5 h-4 w-4" />
                        {showConfirmLeave ? 'Confirm Leave' : 'Leave Group'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-600">{currentGroup.description}</p>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Completed Tasks</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {groupStats?.completedTasks || 0}
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Pending Tasks</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {groupStats?.pendingTasks || 0}
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">In Progress</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {groupStats?.inProgressTasks || 0}
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Active Timers</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {groupStats?.activeTimers || 0}
                  </p>
                </div>
              </div>

              {/* Invite Code Section */}
              {userRole === 'leader' && (
                <div className="mt-8 p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Invite Members</h3>

                  <div className="flex items-center space-x-2">
                    <div className="flex-1 flex items-center space-x-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={currentGroup.inviteCode || ''}
                          readOnly
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500"
                        />
                      </div>

                      <button
                        onClick={handleCopyInviteCode}
                        disabled={loading.copyInvite}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {loading.copyInvite ? (
                          <div className="w-5 h-5 border-t-2 border-b-2 border-gray-500 rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">Copy Invite Code</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleRegenerateInviteCode}
                        disabled={loading.regenerateInvite}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {loading.regenerateInvite ? (
                          <div className="w-5 h-5 border-t-2 border-b-2 border-gray-500 rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <RefreshCcw className="h-4 w-4" />
                            <span className="sr-only">Regenerate Invite Code</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-stretch">
                      <input
                        type="email"
                        placeholder="Enter email to invite"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={handleAddMember}
                        disabled={loading.invite}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading.invite ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                            Inviting...
                          </div>
                        ) : (
                          <>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Invite
                          </>
                        )}
                      </button>
                    </div>

                    {inviteErrorMsg && (
                      <p className="mt-2 text-xs text-red-600">{inviteErrorMsg}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Members */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Members</h3>
                </div>

                <div className="p-6">
                  {/* Leaders */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                      <Crown className="h-4 w-4 text-yellow-500 mr-1" />
                      Leaders
                    </h4>

                    <ul className="space-y-3">
                      {currentGroup.leaders && currentGroup.leaders.length > 0 ? (
                        currentGroup.leaders.map((leader) => {
                          const leaderId = typeof leader === 'object' ? leader._id : leader;
                          const leaderName = typeof leader === 'object'
                            ? `${leader.firstName} ${leader.lastName}`
                            : 'Unknown';
                          const leaderAvatar = typeof leader === 'object' ? leader.avatar : undefined;

                          return (
                            <li key={leaderId} className="flex items-center justify-between">
                              <div className="flex items-center">
                                {leaderAvatar ? (
                                  <img
                                    src={leaderAvatar}
                                    alt={leaderName}
                                    className="h-8 w-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium text-sm">
                                    {typeof leader === 'object'
                                      ? getInitials(leader.firstName, leader.lastName)
                                      : 'UN'
                                    }
                                  </div>
                                )}

                                <span className="ml-3 text-sm font-medium">{leaderName}</span>
                              </div>

                              {userRole === 'leader' && currentGroup.leaders && currentGroup.leaders.length > 1 && (
                                <button
                                  onClick={() => handleDemoteToMember(leaderId)}
                                  disabled={loading.demote === leaderId}
                                  className="text-sm text-gray-500 hover:text-red-500"
                                >
                                  {loading.demote === leaderId ? (
                                    <div className="w-4 h-4 border-t-2 border-b-2 border-gray-500 rounded-full animate-spin"></div>
                                  ) : (
                                    <ShieldAlert className="h-4 w-4" />
                                  )}
                                </button>
                              )}
                            </li>
                          );
                        })
                      ) : (
                        <li className="text-sm text-gray-500">No leaders found</li>
                      )}
                    </ul>
                  </div>

                  {/* Members */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                      <Users className="h-4 w-4 text-blue-500 mr-1" />
                      Members
                    </h4>

                    <ul className="space-y-3">
                      {currentGroup.members && currentGroup.members.length > 0 ? (
                        currentGroup.members.map((member) => {
                          const memberId = typeof member === 'object' ? member._id : member;
                          const memberName = typeof member === 'object'
                            ? `${member.firstName} ${member.lastName}`
                            : 'Unknown';
                          const memberAvatar = typeof member === 'object' ? member.avatar : undefined;

                          return (
                            <li key={memberId} className="flex items-center justify-between">
                              <div className="flex items-center">
                                {memberAvatar ? (
                                  <img
                                    src={memberAvatar}
                                    alt={memberName}
                                    className="h-8 w-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 font-medium text-sm">
                                    {typeof member === 'object'
                                      ? getInitials(member.firstName, member.lastName)
                                      : 'UN'
                                    }
                                  </div>
                                )}

                                <span className="ml-3 text-sm font-medium">{memberName}</span>
                              </div>

                              {userRole === 'leader' && (
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handlePromoteToLeader(memberId)}
                                    disabled={loading.promote === memberId}
                                    className="text-sm text-gray-500 hover:text-yellow-500"
                                  >
                                    {loading.promote === memberId ? (
                                      <div className="w-4 h-4 border-t-2 border-b-2 border-gray-500 rounded-full animate-spin"></div>
                                    ) : (
                                      <Crown className="h-4 w-4" />
                                    )}
                                  </button>

                                  <button
                                    onClick={() => handleRemoveMember(memberId)}
                                    disabled={loading.remove === memberId}
                                    className="text-sm text-gray-500 hover:text-red-500"
                                  >
                                    {loading.remove === memberId ? (
                                      <div className="w-4 h-4 border-t-2 border-b-2 border-gray-500 rounded-full animate-spin"></div>
                                    ) : (
                                      <UserMinus className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              )}
                            </li>
                          );
                        })
                      ) : (
                        <li className="text-sm text-gray-500">No members found</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Group tasks & Leaderboard */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Tasks */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Recent Tasks</h3>

                  <Link
                    href={ROUTES.TASKS}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    View All
                  </Link>
                </div>

                <div className="p-6">
                  {tasks.length === 0 ? (
                    <p className="text-gray-500">No tasks found for this group.</p>
                  ) : (
                    <ul className="space-y-3">
                      {tasks.slice(0, 5).map((task) => (
                        <li key={task._id} className="flex items-start">
                          <div className="mt-0.5 mr-3">
                            {getTaskStatusIcon(task.status)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <Link
                              href={ROUTES.TASK_DETAILS(task._id)}
                              className="text-sm font-medium text-gray-900 hover:text-blue-600"
                            >
                              {task.title}
                            </Link>

                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <span className="font-medium text-gray-700">
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                              </span>
                              <span className="mx-1">•</span>
                              <span>
                                Due {format(new Date(task.dueDate), 'MMM d')}
                              </span>
                              <span className="mx-1">•</span>
                              <span>
                                {formatDuration(task.estimatedTime)}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Leaderboard */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Leaderboard</h3>
                </div>

                <div className="p-6">
                  {leaderboard.length === 0 ? (
                    <p className="text-gray-500">No data available for the leaderboard yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Member
                            </th>
                            <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tasks Completed
                            </th>
                            <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Time Spent
                            </th>
                            <th className="px-3 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Completion Rate
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {leaderboard.map((entry, index) => (
                            <tr key={entry.user._id} className={index === 0 ? 'bg-yellow-50' : ''}>
                              <td className="px-3 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {entry.user.avatar ? (
                                    <img
                                      src={entry.user.avatar}
                                      alt={entry.user.name}
                                      className="h-8 w-8 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 font-medium text-sm">
                                      {entry.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </div>
                                  )}

                                  <div className="ml-3 flex items-center">
                                    <span className="text-sm font-medium text-gray-900">
                                      {entry.user.name}
                                    </span>

                                    {entry.isLeader && (
                                      <Crown className="ml-1 h-4 w-4 text-yellow-500" />
                                    )}

                                    {index === 0 && (
                                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                        #1
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                {entry.tasksCompleted}
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatDuration(entry.totalTime)}
                              </td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                {entry.completionRate}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}