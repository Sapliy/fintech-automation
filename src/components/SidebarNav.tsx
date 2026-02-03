'use client';

import { Activity, FileText, GitGraph, LayoutDashboard, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
    { to: '/', icon: GitGraph, label: 'Builder' },
    { to: '/templates', icon: LayoutDashboard, label: 'Templates' },
    { to: '/timeline', icon: Activity, label: 'Timeline' },
    { to: '/transactions', icon: FileText, label: 'Transactions' },
    { to: '/audit', icon: Settings, label: 'Audit Logs' },
];

const SidebarNav = () => {
    const pathname = usePathname();

    return (
        <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 z-50">
            <div className="mb-8">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <GitGraph className="w-6 h-6 text-white" />
                </div>
            </div>

            <nav className="flex-1 w-full space-y-2 px-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.to || (item.to !== '/' && pathname?.startsWith(item.to));
                    return (
                        <Link
                            key={item.to}
                            href={item.to}
                            className={`
                                flex flex-col items-center justify-center w-full aspect-square rounded-lg transition-all
                                ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}
                            `}
                            title={item.label}
                        >
                            <item.icon className="w-5 h-5 mb-1" />
                        </Link>
                    )
                })}
            </nav>
        </div>
    );
};

export default SidebarNav;
