import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Group } from '@/types/group';
import GroupCard from './group-card';

interface GroupListProps {
  groups: Group[];
  title: string;
  showFilters?: boolean;
  emptyMessage?: string;
}

export default function GroupList({
  groups,
  title,
  showFilters = true,
  emptyMessage = 'No groups found.'
}: GroupListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter groups based on search term
  const filteredGroups = searchTerm
    ? groups.filter(
      (group) =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : groups;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>

        {showFilters && (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        )}
      </div>

      {filteredGroups.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <GroupCard key={group._id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
}