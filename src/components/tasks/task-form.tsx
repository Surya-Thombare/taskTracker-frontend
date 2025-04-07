import React, { useState, useEffect } from 'react';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types/task';
import { Group } from '@/types/group';
import { toast } from "sonner"
import { TASK_PRIORITIES, TASK_STATUSES } from '@/lib/constants';
import { useGroupStore } from '@/store/group-store';

interface TaskFormProps {
  onSubmit: (taskData: CreateTaskRequest | UpdateTaskRequest) => Promise<void>;
  initialData?: Task;
  isEditing?: boolean;
  isLoading?: boolean;
}

export default function TaskForm({
  onSubmit,
  initialData,
  isEditing = false,
  isLoading = false
}: TaskFormProps) {
  const { myGroups, fetchGroups } = useGroupStore();
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [loading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState<CreateTaskRequest | UpdateTaskRequest>({
    title: '',
    description: '',
    groupId: '',
    estimatedTime: 30,
    dueDate: new Date().toISOString().slice(0, 16), // Format as YYYY-MM-DDThh:mm
    priority: 'medium',
    tags: [],
  });

  const [tagInput, setTagInput] = useState('');

  // Fetch user's groups if not already loaded
  useEffect(() => {
    const loadGroups = async () => {
      if (myGroups.length === 0) {
        setGroupsLoading(true);
        await fetchGroups();
        setGroupsLoading(false);
      }
    };

    loadGroups();
  }, [myGroups.length, fetchGroups]);

  // Initialize form with task data when editing
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        groupId: typeof initialData.group === 'object' ? initialData.group._id : initialData.group,
        estimatedTime: initialData.estimatedTime,
        dueDate: new Date(initialData.dueDate).toISOString().slice(0, 16),
        priority: initialData.priority,
        status: initialData.status,
        tags: initialData.tags,
      });
    }
  }, [isEditing, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagAdd = () => {
    if (tagInput.trim() === '') return;

    setFormData((prev) => ({
      ...prev,
      tags: [...(prev.tags || []), tagInput.trim()],
    }));
    setTagInput('');
  };

  const handleTagRemove = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await onSubmit(formData);
      toast.success(isEditing ? "Task updated successfully" : "Task created successfully");
    } catch (err) {
      console.error(isEditing ? 'Error updating task:' : 'Error creating task:', err);
      toast.error(isEditing ? "Failed to update task" : "Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Task Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter task title"
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
          placeholder="Describe the task and what needs to be done"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="groupId" className="block text-sm font-medium text-gray-700">
            Group *
          </label>
          <select
            id="groupId"
            name="groupId"
            value={formData.groupId}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>
              {groupsLoading ? 'Loading groups...' : 'Select a group'}
            </option>
            {myGroups.map((group) => (
              <option key={group._id} value={group._id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority *
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {TASK_PRIORITIES.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700">
            Estimated Time (minutes) *
          </label>
          <input
            id="estimatedTime"
            name="estimatedTime"
            type="number"
            min={5}
            step={5}
            value={formData.estimatedTime}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
            Due Date and Time *
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="datetime-local"
            value={formData.dueDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {isEditing && (
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {TASK_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags
        </label>
        <div className="mt-1 flex items-center">
          <input
            id="tags"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="block w-full border border-gray-300 rounded-md rounded-r-none shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add a tag"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleTagAdd();
              }
            }}
          />
          <button
            type="button"
            onClick={handleTagAdd}
            className="inline-flex items-center px-4 py-2 border border-transparent border-l-0 text-sm font-medium rounded-l-none rounded-r-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>

        {formData.tags && formData.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagRemove(tag)}
                  className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 text-blue-500 hover:bg-blue-300"
                >
                  <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
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
            isEditing ? 'Update Task' : 'Create Task'
          )}
        </button>
      </div>
    </form>
  );
}