'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import authService from '@/services/authService';
import { resetPasswordSchema, ResetPasswordInput } from '@/lib/validations/auth';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthErrorAlert } from '@/components/auth/AuthErrorAlert';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [errorLevel, setErrorLevel] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const passwordValue = watch('password');

  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length > 7) score++;
    if (pass.match(/[A-Z]/)) score++;
    if (pass.match(/[0-9]/)) score++;
    if (pass.match(/[^A-Za-z0-9]/)) score++;
    return score;
  };
  const strength = getPasswordStrength(passwordValue || '');

  const onSubmit = async (data: ResetPasswordInput) => {
    setErrorLevel(null);

    if (!token) {
      setErrorLevel('Invalid or missing reset token');
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(token, data.password);
      setSuccess(true);
    } catch (err) {
      setErrorLevel(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center pt-8">
        <h2 className="text-2xl font-bold mb-4 text-foreground">Invalid Link</h2>
        <p className="text-muted-foreground mb-6">This password reset link is invalid or expired.</p>
        <Link href="/auth/forgot-password" className="text-primary hover:text-primary/80 font-medium transition-colors">
          Request a new link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center pt-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-xl shadow-emerald-500/10 mb-6">
          <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">Password Reset!</h2>
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          Your password has been successfully reset. You can now sign in with your new password.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center py-3.5 px-8 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-white font-bold tracking-wide hover:from-cyan-400 hover:to-blue-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transform hover:-translate-y-0.5"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10 lg:text-left text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Reset Password</h2>
        <p className="text-muted-foreground">Create a new secure password</p>
      </div>

      <div className="bg-card/40 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-[0_8px_32px_rgba(6,182,212,0.05)] border border-white/5 relative z-10 before:absolute before:inset-0 before:bg-linear-to-b before:from-white/5 before:to-transparent before:rounded-3xl before:pointer-events-none">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AuthErrorAlert message={errorLevel} />

          <div className="space-y-1.5">
            <AuthInput
              label="New Password"
              id="password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            {/* Password Strength Indicator */}
            {passwordValue && (
              <div className="flex gap-1 mt-2.5">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${strength >= level
                        ? strength <= 2
                          ? 'bg-destructive'
                          : strength === 3
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        : 'bg-border'
                      }`}
                  />
                ))}
              </div>
            )}
          </div>

          <AuthInput
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <AuthButton type="submit" isLoading={isLoading}>
            Reset Password
          </AuthButton>
        </form>

        <div className="mt-8 pt-6 border-t border-border/60 text-center">
          <Link href="/auth/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to login
          </Link>
        </div>
      </div>

      <p className="text-center text-muted-foreground text-sm mt-8">
        &copy; {new Date().getFullYear()} Sapliy Fintech. All rights reserved.
      </p>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
