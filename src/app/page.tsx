'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

export default function HomePage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuthStore();

    useEffect(() => {
        // Wait for auth state to hydrate from localStorage
        if (!isLoading) {
            if (isAuthenticated) {
                router.replace('/dashboard');
            } else {
                router.replace('/auth/login');
            }
        }
    }, [isAuthenticated, isLoading, router]);

    // Show loading state while checking authentication
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full"></div>
                <p className="text-gray-400">Loading...</p>
            </div>
        </div>
    );
}
