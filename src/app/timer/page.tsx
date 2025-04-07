'use client';

import { useState, useEffect } from 'react';
import { useTimerStore } from '@/store/timer-store';
import ActiveTimer from '@/components/timer/active-timer';
import TimerControls from '@/components/timer/timer-controls';
import { formatDateTime, formatDuration } from '@/lib/utils';
import { toast } from 'sonner';

export default function TimerPage() {
  const {
    activeTimer,
    elapsedTime,
    timerHistory,
    isLoading,
    fetchActiveTimer,
    fetchTimerHistory,
    startTimer,
    completeTimer
  } = useTimerStore();

  const [isStarting, setIsStarting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    fetchActiveTimer();
    fetchTimerHistory();
  }, [fetchActiveTimer, fetchTimerHistory]);

  const handleStartTimer = async (taskId: string) => {
    try {
      setIsStarting(true);
      await startTimer(taskId);
      toast.success("Timer started successfully");
    } catch (err) {
      console.error('Error starting timer:', err);
      toast.error("Failed to start timer. Please try again.");
    } finally {
      setIsStarting(false);
    }
  };

  const handleCompleteTimer = async (notes?: string) => {
    try {
      setIsCompleting(true);
      await completeTimer(notes);
      await fetchTimerHistory();
      toast.success("Timer completed successfully");
    } catch (err) {
      console.error('Error completing timer:', err);
      toast.error("Failed to complete timer. Please try again.");
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Time Tracking</h1>
        <p className="text-gray-600">Track time spent on your tasks</p>
      </div>

      {activeTimer ? (
        <ActiveTimer
          timer={activeTimer}
          elapsedSeconds={elapsedTime}
          onComplete={handleCompleteTimer}
        />
      ) : (
        <TimerControls
          onStartTimer={handleStartTimer}
          isStarting={isStarting}
        />
      )}

      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Timer History</h3>
        </div>

        <div className="p-6">
          {timerHistory.length === 0 ? (
            <p className="text-gray-500">No timer history found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {timerHistory.map((timer) => (
                    <tr key={timer._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {typeof timer.task === 'object' ? timer.task.title : 'Unknown Task'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDateTime(timer.startTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {timer.endTime ? formatDateTime(timer.endTime) : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {timer.duration ? formatDuration(timer.duration) : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${timer.isCompleted
                          ? 'bg-green-100 text-green-800'
                          : timer.isActive
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                          }`}>
                          {timer.isCompleted
                            ? 'Completed'
                            : timer.isActive
                              ? 'Active'
                              : 'Stopped'
                          }
                        </span>
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
  );
}