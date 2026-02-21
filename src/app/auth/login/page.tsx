'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/auth.store';
import { loginSchema, LoginInput } from '@/lib/validations/auth';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthCheckbox } from '@/components/auth/AuthCheckbox';
import { AuthErrorAlert } from '@/components/auth/AuthErrorAlert';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const { login, isLoading, error, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const onSubmit = async (data: LoginInput) => {
    clearError();
    try {
      await login(data.email, data.password);
      router.push(redirect);
    } catch (err) {
      // Error is handled in store
    }
  };

  return (
    <>
      <div className="mb-10 lg:text-left text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back</h2>
        <p className="text-muted-foreground">Sign in to your account to continue</p>
      </div>

      <div className="bg-card/40 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-[0_8px_32px_rgba(6,182,212,0.05)] border border-white/5 relative z-10 before:absolute before:inset-0 before:bg-linear-to-b before:from-white/5 before:to-transparent before:rounded-3xl before:pointer-events-none">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AuthErrorAlert message={error} />

          <AuthInput
            label="Email address"
            type="email"
            id="email"
            placeholder="name@company.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <AuthInput
              label="" // empty because handled above
              type="password"
              id="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>

          <AuthCheckbox
            id="rememberMe"
            label="Remember me for 30 days"
            {...register('rememberMe')}
          />

          <AuthButton type="submit" isLoading={isLoading}>
            Sign in to platform
          </AuthButton>
        </form>

        <div className="mt-8 pt-6 border-t border-border/60 text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/register"
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Create account
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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
