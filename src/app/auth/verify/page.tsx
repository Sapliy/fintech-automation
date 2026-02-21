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
      <div className="flex flex-col items-center justify-center p-12 text-center h-full">
        <div className="animate-spin w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full mb-6"></div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Verifying your email...</h2>
        <p className="text-muted-foreground">Please wait while we confirm your account.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center pt-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 border border-destructive/20 shadow-xl shadow-destructive/10 mb-6">
          <svg className="w-10 h-10 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">Verification Failed</h2>
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">{error}</p>
        <Link
          href="/auth/register"
          className="inline-flex items-center justify-center py-3.5 px-8 rounded-xl bg-card border border-border/60 hover:bg-card/60 text-foreground font-medium transition-all shadow-md"
        >
          Back to Register
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center pt-8">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-xl shadow-emerald-500/10 mb-6">
        <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-foreground mb-4">Email Verified!</h2>
      <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
        Your email has been successfully verified. You can now access all features of Sapliy Fintech.
      </p>
      <Link
        href="/auth/login"
        className="inline-flex items-center justify-center w-full py-3.5 px-8 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-white font-bold tracking-wide hover:from-cyan-400 hover:to-blue-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transform hover:-translate-y-0.5"
      >
        Continue to Login
      </Link>
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
