'use client';

import Link from 'next/link';
import { Zap, LayoutDashboard, Database, Activity, Settings, Package, GitGraph, GitBranch } from 'lucide-react';
import ZoneSelector from './ZoneSelector';
import { useAuthStore } from '@/store/auth.store';
import { useRouter, usePathname } from 'next/navigation';

const NAV_ITEMS = [
    { to: '/', icon: Zap, label: 'Dashboard' },
    { to: '/flows', icon: GitBranch, label: 'Flows' },
    { to: '/builder', icon: GitGraph, label: 'Builder' },
    { to: '/templates', icon: LayoutDashboard, label: 'Templates' },
    { to: '/data', icon: Database, label: 'Data' },
    { to: '/timeline', icon: Activity, label: 'Timeline' },
    { to: '/packages', icon: Package, label: 'Packages' },
    { to: '/settings', icon: Settings, label: 'Settings' },
];

const SidebarNav = () => {
    const pathname = usePathname();
    const { zones, zone, setZone } = useAuthStore();
    const router = useRouter();

    return (
        <div className="w-64 md:w-60 bg-card border-r border-border flex flex-col h-full shadow-2xl md:shadow-none">
            <div className="p-6 hidden md:flex items-center">
                <img src="/sapliy-logo.png" alt="Sapliy Logo" className="w-8 h-8 mr-3 object-contain" />
                <span className="text-xl font-bold tracking-tight text-foreground">Sapliy</span>
            </div>

            <ZoneSelector
                zones={zones}
                selectedZone={zone}
                onSelect={(z) => setZone(z as any)}
                onManage={() => router.push('/settings/zones')}
            />

            <nav className="flex-1 w-full overflow-y-auto space-y-2 px-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.to || (item.to !== '/' && pathname?.startsWith(item.to));
                    return (
                        <Link
                            key={item.to}
                            href={item.to}
                            className={`
                                flex flex-col items-center justify-center w-full aspect-square rounded-lg transition-all
                                ${isActive
                                    ? 'bg-primary/20 text-primary border-l-2 border-primary'
                                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}
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
