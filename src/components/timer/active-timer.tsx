import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlayCircle, PauseCircle, StopCircle, XCircle } from 'lucide-react';
import { Timer } from '@/types/timer';
import { ROUTES } from '@/lib/constants';

interface ActiveTimerProps {
  timer: Timer;
  elapsedSeconds: number;
  onComplete: (notes?: string) => Promise<void>;
}

export default function ActiveTimer({ timer, elapsedSeconds, onComplete }: ActiveTimerProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get estimated time for the task in seconds
  const getEstimatedTime = () => {
    if (typeof timer.task === 'object' && timer.task.estimatedTime) {
      return timer.task.estimatedTime * 60; // Convert minutes to seconds
    }
    return 0;
  };

  const estimatedSeconds = getEstimatedTime();
  const percentComplete = estimatedSeconds ? Math.min(100, (elapsedSeconds / estimatedSeconds) * 100) : 0;
  const isOvertime = elapsedSeconds > estimatedSeconds && estimatedSeconds > 0;

  const handleComplete = async () => {
    if (showNotes) {
      setIsSubmitting(true);
      await onComplete(notes);
      setIsSubmitting(false);
      setShowNotes(false);
    } else {
      setShowNotes(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {typeof timer.task === 'object' ? timer.task.title : 'Current Task'}
          </h2>

          {typeof timer.task === 'object' && (
            <Link
              href={ROUTES.TASK_DETAILS(typeof timer.task === 'object' ? timer.task._id : timer.task)}
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View Task Details
            </Link>
          )}
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="inline-flex items-center p-2 border border-transparent rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isPaused ? (
              <PlayCircle className="h-8 w-8 text-green-500" />
            ) : (
              <PauseCircle className="h-8 w-8 text-yellow-500" />
            )}
          </button>

          <button
            onClick={handleComplete}
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                Submitting...
              </div>
            ) : (
              <>
                <StopCircle className="mr-2 h-4 w-4" />
                {showNotes ? 'Submit & Complete' : 'Complete Timer'}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className={`text-sm font-medium ${isOvertime ? 'text-red-600' : 'text-gray-700'}`}>
            {formatTime(elapsedSeconds)} {estimatedSeconds > 0 && `/ ${formatTime(estimatedSeconds)}`}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${isOvertime ? 'bg-red-600' : 'bg-blue-600'}`}
            style={{ width: `${percentComplete}%` }}
          ></div>
        </div>
      </div>

      {showNotes && (
        <div className="space-y-4">
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Add notes about what you accomplished (optional)
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe what you accomplished during this time..."
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setShowNotes(false)}
              className="mr-2 inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <XCircle className="mr-1.5 h-4 w-4 text-gray-500" />
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}