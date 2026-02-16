'use client';

// Removed unnecessary imports
import React from 'react';

interface AuthGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    redirectTo?: string;
}

export function AuthGuard({
    children,
    // requireAuth = true, // unused
    // redirectTo = '/auth/login' // unused
}: AuthGuardProps) {
    // Middleware handles protection now. 
    // This component is kept for API compatibility.
    // Props are ignored.
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

// Hook for checking auth status - Dummy implementation
export function useRequireAuth(_redirectTo = '/auth/login') {
    // Always return authenticated as middleware handles the real check
    return { isAuthenticated: true, isLoading: false };
}
