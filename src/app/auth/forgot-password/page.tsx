'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '@/lib/constants';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setLoading(true);

      // Note: This is a placeholder. In a real app, you would call an API endpoint
      // to send a reset password email to the user

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to send password reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto px-4 py-12 sm:px-6">
        <div className="flex items-center mb-8">
          <Image src="/logo.svg" alt="TaskTrack" width={40} height={40} />
          <span className="ml-2 text-2xl font-bold">TaskTrack</span>
        </div>

        <div className="w-full p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Reset Your Password</h1>
            <p className="mt-2 text-gray-600">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {success ? (
            <div className="space-y-6">
              <div className="p-4 text-sm text-green-700 bg-green-100 rounded-lg">
                We&apos;ve sent a password reset link to your email address. Please check your inbox.
              </div>

              <div className="text-center space-y-4">
                <Link
                  href={ROUTES.LOGIN}
                  className="block w-full px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Return to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your.email@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              <div className="text-center">
                <Link
                  href={ROUTES.LOGIN}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}