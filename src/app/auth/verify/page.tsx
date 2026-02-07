'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import authService from '@/services/authService';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
      return;
    }

    const verifyEmail = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus('success');
        setMessage('Your email has been verified successfully!');
      } catch (err) {
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Verification failed');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 opacity-40"></div>

      <div className="relative z-10 w-full max-w-md px-6 text-center">
        {status === 'loading' && (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-purple-400 to-violet-500 shadow-xl shadow-purple-500/25 mb-6">
              <svg className="animate-spin w-10 h-10 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Verifying your email...</h2>
            <p className="text-gray-400">Please wait while we verify your email address.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-green-400 to-emerald-500 shadow-xl shadow-green-500/25 mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Email Verified!</h2>
            <p className="text-gray-400 mb-8">{message}</p>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center py-3 px-8 rounded-xl bg-linear-to-r from-purple-600 to-violet-600 text-white font-medium hover:from-purple-500 hover:to-violet-500 transition-all shadow-lg shadow-purple-500/25"
            >
              Continue to Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-red-400 to-rose-500 shadow-xl shadow-red-500/25 mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Verification Failed</h2>
            <p className="text-gray-400 mb-8">{message}</p>
            <div className="space-y-4">
              <Link
                href="/auth/login"
                className="block py-3 px-8 rounded-xl bg-linear-to-r from-purple-600 to-violet-600 text-white font-medium hover:from-purple-500 hover:to-violet-500 transition-all shadow-lg shadow-purple-500/25"
              >
                Back to Login
              </Link>
              <p className="text-gray-500 text-sm">
                Need a new verification link?{' '}
                <Link href="/auth/login" className="text-purple-400 hover:text-purple-300">
                  Sign in to request one
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="animate-spin w-10 h-10 text-white">
            <svg fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
