'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { motion } from 'framer-motion';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    // setLoading(true); // login action handles loading state

    try {
      await login(email, password);
      router.push(redirect);
    } catch (err) {
      // Error is handled in store
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Pane - Branding & Inspiration */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex w-1/2 relative bg-background items-center justify-center overflow-hidden border-r border-border/40"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 bg-linear-to-br from-cyan-950/20 via-background to-background"></div>
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-cyan-500/15 via-transparent to-transparent animate-pulse" style={{ animationDuration: '10s' }}></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[linear-gradient(rgba(6,182,212,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.04)_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-start max-w-lg px-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-card border border-border/60 flex items-center justify-center shadow-lg shadow-black/50 overflow-hidden">
              <img src="/sapliy-logo.png" alt="Sapliy Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-black to-gray-400">Sapliy Fintech</span>
          </div>

          <h1 className="text-5xl font-extrabold text-gray-500 mb-6 leading-tight tracking-tight">
            Next-Gen <br />
            <span className="text-primary">Financial Automation.</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-md">
            Streamline your financial operations, build powerful payment flows, and gain real-time insights with our enterprise-grade automation engine.
          </p>

          <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground bg-white/5 px-4 py-2 border border-green-500/50 rounded-full backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            Systems Operational
          </div>
        </div>
      </motion.div>

      {/* Right Pane - Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative overflow-hidden"
      >
        {/* Decorative mobile glow */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-96 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-cyan-900/30 via-background to-background pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="w-full max-w-md relative z-10"
        >
          <div className="mb-10 lg:text-left text-center">
            {/* Mobile Logo */}
            <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-card border border-border/60 flex items-center justify-center shadow-lg shadow-black/50 overflow-hidden">
                <img src="/sapliy-logo.png" alt="Sapliy Logo" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-black to-gray-400">Sapliy Fintech</span>
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <div className="bg-card/40 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-[0_8px_32px_rgba(6,182,212,0.05)] border border-white/5 relative z-10 before:absolute before:inset-0 before:bg-linear-to-b before:from-white/5 before:to-transparent before:rounded-3xl before:pointer-events-none">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="name@company.com"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-foreground">
                    Password
                  </label>
                  <Link href="/auth/forgot-password" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-4 h-4 rounded border border-border bg-background peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                    <svg className="absolute w-3 h-3 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Remember me for 30 days</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-white font-bold tracking-wide hover:from-cyan-400 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-background transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  'Sign in to platform'
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-border/60 text-center">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/auth/register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                  Create account
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4 text-xs font-medium text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Help Center</Link>
            <span>&bull;</span>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            <span>&bull;</span>
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
