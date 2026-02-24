'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

// Lazy load the heavy WebGL component so the form paints instantly
const ShaderBackground = dynamic(() => import('@/components/auth/ShaderBackground'), {
    ssr: false,
    loading: () => (
        <div className="absolute inset-0 z-0 bg-linear-to-br from-cyan-950/20 via-background to-background animate-pulse" />
    ),
});

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLogin = pathname?.includes('login');

    return (
        <div className="min-h-screen w-full flex bg-background relative overflow-hidden">
            {/* Left Pane - Branding & Inspiration (Desktop Only) */}
            <motion.div
                layout
                className="hidden lg:flex w-1/2 relative flex-col items-center justify-center border-r border-border/40 z-10 p-12"
            >
                {/* Persisted Background for Left Pane Only */}
                <ShaderBackground />

                <div className="relative z-10 flex flex-col items-start max-w-lg">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-12 h-12 rounded-xl bg-card border border-border/60 flex items-center justify-center shadow-lg shadow-white/50 overflow-hidden">
                            <img src="/sapliy-logo.png" alt="Sapliy Logo" className="w-8 h-8 object-contain" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">Sapliy Fintech</span>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? 'login' : 'register'}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-6"
                        >
                            <h1 className="text-5xl font-extrabold text-white leading-tight tracking-tight">
                                {isLogin ? (
                                    <>
                                        Next-Gen <br />
                                        <span className="text-primary">Financial Automation.</span>
                                    </>
                                ) : (
                                    <>
                                        Build powerful <br />
                                        <span className="text-primary">payment flows.</span>
                                    </>
                                )}
                            </h1>
                            <p className="text-lg text-white leading-relaxed max-w-md">
                                {isLogin
                                    ? "Streamline your financial operations, build powerful payment flows, and gain real-time insights with our enterprise-grade automation engine."
                                    : "Automating our complex multi-region payment flows with Sapliy Studio cut our engineering overhead by 60%."}
                            </p>

                            {!isLogin && (
                                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border/40">
                                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-gray-700 to-gray-600 border border-gray-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                                        JD
                                    </div>
                                    <div>
                                        <div className="font-semibold text-foreground">Jane Doe</div>
                                        <div className="text-sm text-muted-foreground">CTO, GlobalPayments Inc.</div>
                                    </div>
                                </div>
                            )}

                            {isLogin && (
                                <div className="flex items-center gap-4 text-sm text-white font-medium  bg-white/5 px-4 py-2 border border-green-500/50 rounded-full backdrop-blur-md inline-flex mt-4">
                                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                    Systems Operational
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Right Pane - Dynamic Forms */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-12 z-10 overflow-y-auto">
                <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                            className="w-full max-w-md mx-auto relative z-10 pt-10 lg:pt-0"
                        >
                            {/* Mobile Logo Header */}
                            <div className="mb-10 lg:hidden text-center">
                                <div className="flex items-center justify-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-lg bg-card border border-border/60 flex items-center justify-center shadow-lg shadow-white/50 overflow-hidden">
                                        <img src="/sapliy-logo.png" alt="Sapliy Logo" className="w-6 h-6 object-contain" />
                                    </div>
                                    <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-300">Sapliy Fintech</span>
                                </div>
                            </div>

                            {children}
                        </motion.div>
                    </AnimatePresence>
                </Suspense>
            </div>
        </div>
    );
}
