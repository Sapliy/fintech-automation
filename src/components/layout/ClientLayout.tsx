'use client';

import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import SidebarNav from '../SidebarNav';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { accessToken } = useAuthStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Handle initial hydration mismatch or missing token if needed
    // But middleware handles redirection mostly.

    return (
        <div className="flex flex-col md:flex-row h-screen w-screen bg-background text-foreground overflow-hidden">
            {!isAuthRoute && (
                <>
                    {/* Mobile Header */}
                    <div className="md:hidden flex items-center justify-between p-4 bg-card border-b border-border z-20">
                        <div className="flex items-center gap-3">
                            <img src="/sapliy-logo.png" alt="Sapliy Logo" className="w-8 h-8 object-contain" />
                            <span className="text-xl font-bold tracking-tight text-foreground">Sapliy</span>
                        </div>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Desktop Sidebar & Mobile Drawer */}
                    <div className={`
                        absolute inset-y-0 left-0 z-30 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
                        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}>
                        <SidebarNav />
                    </div>

                    {/* Mobile Menu Overlay */}
                    {isMobileMenuOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-20 md:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                    )}
                </>
            )}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {children}
            </main>
        </div>
    );
}
