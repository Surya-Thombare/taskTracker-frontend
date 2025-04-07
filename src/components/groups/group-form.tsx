import React, { useState, useEffect } from 'react';
import { Group, CreateGroupRequest, UpdateGroupRequest } from '@/types/group';

interface GroupFormProps {
  onSubmit: (groupData: CreateGroupRequest | UpdateGroupRequest) => Promise<void>;
  initialData?: Group;
  isEditing?: boolean;
  isLoading?: boolean;
}

export default function GroupForm({
  onSubmit,
  initialData,
  isEditing = false,
  isLoading = false
}: GroupFormProps) {
  const [formData, setFormData] = useState<CreateGroupRequest | UpdateGroupRequest>({
    name: '',
    description: '',
    isPublic: false,
  });

  // Initialize form with group data when editing
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        isPublic: initialData.isPublic,
      });
    }
  }, [isEditing, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    // Handle checkbox inputs
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else {
      // Handle text inputs
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Group Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter group name"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe the purpose of this group"
        />
      </div>

      <div className="flex items-center">
        <input
          id="isPublic"
          name="isPublic"
          type="checkbox"
          checked={formData.isPublic}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
          Make this group public (visible to all users)
        </label>
      </div>

      <div className="pt-5">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="w-4 h-4 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
              {isEditing ? 'Updating...' : 'Creating...'}
            </div>
          ) : (
            isEditing ? 'Update Group' : 'Create Group'
          )}
        </button>
      </div>
    </form>
  );
}