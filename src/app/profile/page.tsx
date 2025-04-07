'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuthStore } from '@/store/auth-store';
import { updateUserProfile, changePassword } from '@/lib/auth';
import { formatDate, formatDuration, getInitials } from '@/lib/utils';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, fetchUserProfile } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    avatar: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Initialize form with user data when available
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUserProfile(profileForm);
      await fetchUserProfile();
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast.success("Password changed successfully!");
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      console.error('Password change error:', err);
      toast.error("Failed to change password. Please check your current password and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Your Profile</h1>
        <p className="text-gray-600">Manage your account information and password</p>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h2>

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* Avatar section - placeholder for now */}
              <div className="flex items-center space-x-6">
                {profileForm.avatar ? (
                  <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-gray-200">
                    <Image
                      src={profileForm.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold text-xl">
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                )}

                <div>
                  <button
                    type="button"
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Change Avatar
                  </button>
                  <p className="mt-1 text-xs text-gray-500">
                    JPG, GIF or PNG. Max size 2MB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={profileForm.firstName}
                    onChange={handleProfileChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={profileForm.lastName}
                    onChange={handleProfileChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Email address cannot be changed.
                </p>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={profileForm.bio}
                  onChange={handleProfileChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us a bit about yourself"
                />
              </div>

              <div className="pt-5">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Account and Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Stats Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Your Stats</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Tasks Completed</span>
                <span className="font-medium">{user.tasksCompleted || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Completion Rate</span>
                <span className="font-medium">{user.taskCompletionRate || 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total Time Spent</span>
                <span className="font-medium">{formatDuration(user.totalTimeSpent || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Groups</span>
                <span className="font-medium">{user.groups?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Member Since</span>
                <span className="font-medium">{user.joinedAt ? formatDate(user.joinedAt) : 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Change Password</h2>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={8}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}