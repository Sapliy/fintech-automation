'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import authService from '@/services/authService';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      setError('Invalid or missing verification token');
      return;
    }

    const verify = async () => {
      try {
        await authService.verifyEmail(token);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Verification failed');
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full"></div>
          <p className="text-gray-400">Verifying your email...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 opacity-40"></div>

        <div className="relative z-10 w-full max-w-md px-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-red-500 to-pink-600 shadow-xl shadow-red-500/25 mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Verification Failed</h2>
          <p className="text-gray-400 mb-8">{error}</p>
          <Link
            href="/auth/register" // Or resend verification page
            className="inline-flex items-center justify-center py-3 px-8 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all"
          >
            Back to Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 opacity-40"></div>

      <div className="relative z-10 w-full max-w-md px-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-green-400 to-emerald-500 shadow-xl shadow-green-500/25 mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Email Verified!</h2>
        <p className="text-gray-400 mb-8">
          Your email has been successfully verified. You can now access all features of Sapliy Fintech.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center py-3 px-8 rounded-xl bg-linear-to-r from-purple-600 to-violet-600 text-white font-medium hover:from-purple-500 hover:to-violet-500 transition-all shadow-lg shadow-purple-500/25"
        >
          Continue to Login
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
