'use client';

import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import SidebarNav from '../SidebarNav';
import { useEffect } from 'react';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { accessToken } = useAuthStore();

    // Auth routes where sidebar should be hidden
    const isAuthRoute = pathname?.startsWith('/auth/');

    // Sync auth state to cookies for middleware
    useEffect(() => {
        if (accessToken) {
            document.cookie = `auth-token=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        } else {
            // Only clear if explicitly not present, though middleware handles missing token
            document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
    }, [accessToken]);

    // Handle initial hydration mismatch or missing token if needed
    // But middleware handles redirection mostly.

    return (
        <div className="flex h-screen w-screen bg-gray-50 overflow-hidden">
            {!isAuthRoute && <SidebarNav />}
            <main className="flex-1 flex overflow-hidden relative">
                {children}
            </main>
        </div>
    );
}
