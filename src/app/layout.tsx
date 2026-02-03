import type { Metadata } from 'next';
import './globals.css';
import SidebarNav from '../components/SidebarNav';


export const metadata: Metadata = {
    title: 'Fintech Automation Studio',
    description: 'Event & Automation Studio for FinTech + Operations',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="flex h-screen w-screen bg-gray-50 overflow-hidden">
                {/* We need to wrap SidebarNav in a client component wrapper if it uses hooks, 
            or make SidebarNav use 'use client' */}
                <SidebarNav />
                <main className="flex-1 flex overflow-hidden relative">
                    {children}
                </main>
            </body>
        </html>
    );
}
