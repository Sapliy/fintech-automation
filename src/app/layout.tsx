import type { Metadata } from 'next';
import './globals.css';


export const metadata: Metadata = {
    title: 'Fintech Automation Studio',
    description: 'Event & Automation Studio for FinTech + Operations',
};

import ClientLayout from '@/components/layout/ClientLayout';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <ClientLayout>
                    {children}
                </ClientLayout>
            </body>
        </html>
    );
}
