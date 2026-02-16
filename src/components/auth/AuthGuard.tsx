'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

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
    // Middleware handles protection now. 
    // This component is kept for API compatibility or future enhancements.
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
