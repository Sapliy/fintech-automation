'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import authService from '@/services/authService';
import { useAuthStore } from '@/store/auth.store';
import { registerSchema, RegisterInput } from '@/lib/validations/auth';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthCheckbox } from '@/components/auth/AuthCheckbox';
import { AuthErrorAlert } from '@/components/auth/AuthErrorAlert';

export default function RegisterPage() {
  const { setLoading, isLoading } = useAuthStore();
  const [errorLevel, setErrorLevel] = useState<string | null>(null);
  const [successEmail, setSuccessEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '', acceptedTerms: false },
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

  const onSubmit = async (data: RegisterInput) => {
    setErrorLevel(null);
    setLoading(true);

    try {
      await authService.register(data.email, data.password);
      setSuccessEmail(data.email);
    } catch (err) {
      setErrorLevel(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (successEmail) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-xl shadow-emerald-500/10 mb-6">
          <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">Account Created!</h2>
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          We&apos;ve sent a verification email to <strong className="text-foreground">{successEmail}</strong>.
          Please check your inbox and click the link to verify your account.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center py-3 px-8 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-white font-bold tracking-wide hover:from-cyan-400 hover:to-blue-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transform hover:-translate-y-0.5"
        >
          Continue to Login
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10 lg:text-left text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Create an account</h2>
        <p className="text-muted-foreground">Join Sapliy Fintech Automation today</p>
      </div>

      <div className="bg-card/40 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-[0_8px_32px_rgba(6,182,212,0.05)] border border-white/5 relative z-10 before:absolute before:inset-0 before:bg-linear-to-b before:from-white/5 before:to-transparent before:rounded-3xl before:pointer-events-none">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <AuthErrorAlert message={errorLevel} />

          <AuthInput
            label="Email address"
            id="email"
            type="email"
            placeholder="name@company.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="space-y-1.5">
            <AuthInput
              label="Password"
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

          <AuthCheckbox
            id="acceptedTerms"
            label={
              <>
                I agree to the{' '}
                <Link href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" className="font-medium text-primary hover:text-primary/80 transition-colors">
                  Privacy Policy
                </Link>
              </>
            }
            error={errors.acceptedTerms?.message}
            {...register('acceptedTerms')}
          />

          <AuthButton type="submit" isLoading={isLoading}>
            Create Account
          </AuthButton>
        </form>

        <div className="mt-8 pt-6 border-t border-border/60 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-4 text-xs font-medium text-muted-foreground">
        <Link href="#" className="hover:text-foreground transition-colors">
          Help Center
        </Link>
        <span>&bull;</span>
        <Link href="#" className="hover:text-foreground transition-colors">
          Terms
        </Link>
        <span>&bull;</span>
        <Link href="#" className="hover:text-foreground transition-colors">
          Privacy
        </Link>
      </div>
    </>
  );
}
