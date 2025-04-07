import React from 'react';
import {
  CheckCircle,
  Clock,
  ArrowUpCircle,
  Calendar
} from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: 'tasks' | 'time' | 'completion' | 'streak';
  trend?: {
    value: number;
    label: string;
  };
}

export default function StatsCard({ title, value, subValue, icon, trend }: StatsCardProps) {
  // Determine icon component and colors based on the icon prop
  const getIconComponent = () => {
    switch (icon) {
      case 'tasks':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'time':
        return <Clock className="h-8 w-8 text-blue-500" />;
      case 'completion':
        return <ArrowUpCircle className="h-8 w-8 text-purple-500" />;
      case 'streak':
        return <Calendar className="h-8 w-8 text-orange-500" />;
      default:
        return <CheckCircle className="h-8 w-8 text-green-500" />;
    }
  };

  // Determine background color based on the icon prop
  const getBgColor = () => {
    switch (icon) {
      case 'tasks':
        return 'bg-green-50';
      case 'time':
        return 'bg-blue-50';
      case 'completion':
        return 'bg-purple-50';
      case 'streak':
        return 'bg-orange-50';
      default:
        return 'bg-green-50';
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-sm ${getBgColor()}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold">
              {value}
            </p>
            {subValue && (
              <p className="ml-1 text-sm text-gray-500">
                {subValue}
              </p>
            )}
          </div>

          {trend && (
            <div className="mt-2 flex items-center">
              {trend.value > 0 ? (
                <>
                  <svg
                    className="h-3 w-3 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                  <span className="ml-1 text-xs text-green-600">
                    {trend.value}% {trend.label}
                  </span>
                </>
              ) : trend.value < 0 ? (
                <>
                  <svg
                    className="h-3 w-3 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                  <span className="ml-1 text-xs text-red-600">
                    {Math.abs(trend.value)}% {trend.label}
                  </span>
                </>
              ) : (
                <span className="ml-1 text-xs text-gray-500">
                  No change {trend.label}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="p-2 rounded-full bg-white">
          {getIconComponent()}
        </div>
      </div>
    </div>
  );
}