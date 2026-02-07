'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface AuthGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    redirectTo?: string;
}

export function AuthGuard({
    children,
    requireAuth = true,
    redirectTo = '/auth/login'
}: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, token } = useAuthStore();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Small delay to allow hydration
        const checkAuth = () => {
            if (requireAuth && !isAuthenticated) {
                // Redirect to login with return URL
                const returnUrl = encodeURIComponent(pathname);
                router.push(`${redirectTo}?redirect=${returnUrl}`);
            } else {
                setIsChecking(false);
            }
        };

        // Check immediately and after a brief hydration delay
        const timer = setTimeout(checkAuth, 100);
        return () => clearTimeout(timer);
    }, [isAuthenticated, requireAuth, redirectTo, pathname, router]);

    // Also sync token to cookie for middleware
    useEffect(() => {
        if (token) {
            document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        } else {
            document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
    }, [token]);

    if (isChecking && requireAuth) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full"></div>
                    <p className="text-gray-400">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

// HOC version for wrapping pages
export function withAuth<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    options?: { redirectTo?: string }
) {
    return function AuthenticatedComponent(props: P) {
        return (
            <AuthGuard requireAuth={true} redirectTo={options?.redirectTo}>
                <WrappedComponent {...props} />
            </AuthGuard>
        );
    };
}

// Hook for checking auth status
export function useRequireAuth(redirectTo = '/auth/login') {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, isLoading } = useAuthStore();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            const returnUrl = encodeURIComponent(pathname);
            router.push(`${redirectTo}?redirect=${returnUrl}`);
        }
    }, [isAuthenticated, isLoading, redirectTo, pathname, router]);

    return { isAuthenticated, isLoading };
}
