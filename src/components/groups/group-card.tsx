import React from 'react';
import Link from 'next/link';
import { Users, ArrowRight } from 'lucide-react';
import { Group } from '@/types/group';
import { ROUTES } from '@/lib/constants';
import Image from 'next/image';

interface GroupCardProps {
  group: Group;
}

export default function GroupCard({ group }: GroupCardProps) {
  // Get creator name
  const creatorName = typeof group.creator === 'object'
    ? `${group.creator.firstName} ${group.creator.lastName}`
    : 'Unknown';

  // Calculate completion percentage
  const completionPercentage = group.totalTasks && group.totalTasks > 0
    ? Math.round((group.completedTasks || 0) / group.totalTasks * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {group.avatar ? (
              <Image
                src={group.avatar}
                alt={group.name}
                className="h-12 w-12 rounded-lg object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-800 font-semibold">
                {group.name.substring(0, 2).toUpperCase()}
              </div>
            )}

            <div className="ml-4">
              <Link
                href={ROUTES.GROUP_DETAILS(group._id)}
                className="text-lg font-medium text-gray-900 hover:text-blue-600"
              >
                {group.name}
              </Link>

              <div className="flex items-center mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${group.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                  {group.isPublic ? 'Public' : 'Private'}
                </span>

                {group.role && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {group.role.charAt(0).toUpperCase() + group.role.slice(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-500 line-clamp-2">{group.description}</p>

        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Task Completion</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <Users className="h-4 w-4 mr-1" />
          <span>
            {(group.members?.length || 0) + (group.leaders?.length || 0)} members
          </span>

          <span className="mx-2">•</span>

          <span>
            Created by {creatorName}
          </span>
        </div>

        <Link
          href={ROUTES.GROUP_DETAILS(group._id)}
          className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-500"
        >
          View Details <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}