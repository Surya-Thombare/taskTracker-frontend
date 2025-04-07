'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface DailyStats {
  date: string;
  totalTime: number;
  tasksCompleted: number;
}

interface ActivityChartProps {
  data: DailyStats[];
}

export default function ActivityChart({ data }: ActivityChartProps) {
  const [chartData, setChartData] = useState<DailyStats[]>([]);

  useEffect(() => {
    // Format dates to be more readable
    const formattedData = data.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      // Convert time from minutes to hours for better readability
      totalTimeHours: Math.round((item.totalTime / 60) * 10) / 10,
    }));

    setChartData(formattedData);
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Activity Overview</h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              label={{
                value: 'Time (hours)',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: 12, fill: '#6B7280' }
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              label={{
                value: 'Tasks Completed',
                angle: 90,
                position: 'insideRight',
                style: { textAnchor: 'middle', fontSize: 12, fill: '#6B7280' }
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                borderRadius: '0.375rem',
                borderColor: '#E5E7EB',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              }}
              formatter={(value, name) => {
                if (name === 'totalTimeHours') {
                  return [`${value} hours`, 'Time Spent'];
                }
                return [value, 'Tasks Completed'];
              }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '0.5rem' }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value) => {
                if (value === 'totalTimeHours') {
                  return 'Time Spent';
                }
                return 'Tasks Completed';
              }}
            />

            <Area
              type="monotone"
              dataKey="totalTimeHours"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorTime)"
              yAxisId="left"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="tasksCompleted"
              stroke="#10B981"
              fillOpacity={1}
              fill="url(#colorTasks)"
              yAxisId="right"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}