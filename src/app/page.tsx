'use client';

import { Activity, ArrowUpRight, CreditCard, DollarSign, Users, Zap, Loader2, Search, MoreHorizontal, ArrowRight, PlayCircle, Shield } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthStore, Zone } from '@/store/auth.store';
import ZoneSelector from '@/components/ZoneSelector';

// Mock Zones for now - normally this would come from an API or store
const MOCK_ZONES: Zone[] = [
    { id: 'zone_test_123', name: 'Development', mode: 'test', org_id: 'org_123' },
    { id: 'zone_live_456', name: 'Production', mode: 'live', org_id: 'org_123' },
    { id: 'zone_staging_789', name: 'Staging', mode: 'test', org_id: 'org_123' },
];

export default function DashboardPage() {
    const { zone, setZone } = useAuthStore();
    const [stats, setStats] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initialize with default zone if none selected
        if (!zone && MOCK_ZONES.length > 0) {
            setZone(MOCK_ZONES[0]);
        }
    }, [zone, setZone]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const zoneId = zone?.id || 'default';
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

                // Fetch Payments for Volume
                const paymentsRes = await fetch(`${baseUrl}/v1/payments/payment_intents?zone=${zoneId}&limit=100`);
                const payments = await paymentsRes.json();

                // Fetch Transactions for activity and count
                const ledgerRes = await fetch(`${baseUrl}/v1/ledger/transactions?zone=${zoneId}&limit=10`);
                const transactions = await ledgerRes.json();

                const totalVolume = Array.isArray(payments) ? payments.reduce((acc: number, p: any) => p.status === 'succeeded' ? acc + p.amount : acc, 0) : 0;
                const transactionCount = Array.isArray(transactions) ? transactions.length : 0;

                setStats([
                    { label: 'Total Volume', value: `$${(totalVolume / 100).toLocaleString()}`, change: '+12.5%', trend: 'up', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Active Flows', value: '4', change: '+1', trend: 'up', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Transactions', value: transactionCount.toString(), change: '+8.2%', trend: 'up', icon: CreditCard, color: 'text-violet-500', bg: 'bg-violet-500/10' },
                    { label: 'System Health', value: '99.9%', change: 'Stable', trend: 'neutral', icon: Activity, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                ]);

                if (Array.isArray(transactions)) {
                    setRecentActivity(transactions.map((tx: any) => ({
                        id: tx.id,
                        type: 'ledger',
                        message: tx.description || 'Transaction processed',
                        amount: tx.amount ? `$${(tx.amount / 100).toFixed(2)}` : '-',
                        status: 'success',
                        time: new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        icon: CreditCard,
                    })));
                } else {
                    // Fallback mock activity if API fails or empty
                    setRecentActivity([
                        { id: '1', type: 'flow', message: 'Payment Flow triggered', amount: '-', status: 'success', time: '10:42 AM', icon: Zap },
                        { id: '2', type: 'system', message: 'Zone configuration updated', amount: '-', status: 'info', time: '09:15 AM', icon: Shield },
                    ]);
                }

            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                // Set fallback data so UI doesn't look broken
                setStats([
                    { label: 'Total Volume', value: '$0.00', change: '0%', trend: 'neutral', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Active Flows', value: '0', change: '0', trend: 'neutral', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Transactions', value: '0', change: '0%', trend: 'neutral', icon: CreditCard, color: 'text-violet-500', bg: 'bg-violet-500/10' },
                    { label: 'System Health', value: 'Good', change: '-', trend: 'neutral', icon: Activity, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [zone]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full w-full bg-gray-50/50">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground animate-pulse">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full bg-gray-50/30 overflow-y-auto">
            {/* Header */}
            <div className="bg-white border-b border-border sticky top-0 z-10 px-8 py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl mx-auto">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                        <p className="text-sm text-muted-foreground">Overview of your automation ecosystem</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-4 py-1.5 text-sm bg-muted/50 border border-transparent focus:bg-white focus:border-primary/20 hover:border-border rounded-lg outline-none transition-all w-64"
                            />
                        </div>
                        <div className="h-8 w-px bg-border mx-1 hidden md:block"></div>
                        <ZoneSelector
                            zones={MOCK_ZONES}
                            selectedZone={zone}
                            onSelect={setZone}
                            onManage={() => console.log('Manage zones')}
                        />
                        <button className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                            <Users className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div
                            key={stat.label}
                            className="bg-white p-6 rounded-xl border border-border/60 shadow-sm hover:shadow-soft-xl transition-all duration-300 group"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                {stat.change && (
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-muted-foreground bg-gray-100'}`}>
                                        {stat.change}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-3xl font-bold text-foreground mb-1 tracking-tight">{stat.value}</h3>
                            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Activity Feed */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-border/40 flex justify-between items-center bg-gray-50/30">
                            <div>
                                <h2 className="font-bold text-foreground">Recent Activity</h2>
                                <p className="text-xs text-muted-foreground">Latest events and transactions</p>
                            </div>
                            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                                <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto">
                            {recentActivity.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                                    <div className="p-4 bg-muted/50 rounded-full mb-4">
                                        <Activity className="w-8 h-8 text-muted-foreground/50" />
                                    </div>
                                    <p className="text-foreground font-medium">No recent activity</p>
                                    <p className="text-sm text-muted-foreground max-w-xs mt-1">Events and transactions will appear here once your flows are active.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border/40">
                                    {recentActivity.map((activity) => (
                                        <div key={activity.id} className="group flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                                            <div className={`p-2.5 rounded-full ${activity.status === 'success' ? 'bg-emerald-100/50 text-emerald-600' : 'bg-blue-100/50 text-blue-600'}`}>
                                                <activity.icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-foreground truncate">{activity.message}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs text-muted-foreground">{activity.type}</span>
                                                    <span className="w-1 h-1 rounded-full bg-border"></span>
                                                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-foreground">{activity.amount}</p>
                                                <span className={`text-[10px] uppercase font-bold ${activity.status === 'success' ? 'text-emerald-500' : 'text-blue-500'}`}>
                                                    {activity.status}
                                                </span>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity px-2">
                                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="p-3 border-t border-border/40 bg-gray-50/30 text-center">
                            <Link href="/activity" className="text-xs font-semibold text-primary hover:underline">
                                View Full History
                            </Link>
                        </div>
                    </div>

                    {/* Quick Actions & Tips */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-border/40 bg-gray-50/30">
                                <h2 className="font-bold text-foreground">Quick Actions</h2>
                            </div>
                            <div className="p-4 space-y-3">
                                <Link
                                    href="/builder"
                                    className="flex items-center gap-3 p-3 rounded-xl border border-border/60 hover:border-primary/50 hover:bg-primary/5 hover:shadow-md transition-all group"
                                >
                                    <div className="p-2.5 bg-blue-500 text-white rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                                        <PlusCircleIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="font-semibold text-sm text-foreground block">New Flow</span>
                                        <span className="text-xs text-muted-foreground">Create automation</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <Link
                                    href="/templates"
                                    className="flex items-center gap-3 p-3 rounded-xl border border-border/60 hover:border-purple-500/50 hover:bg-purple-500/5 hover:shadow-md transition-all group"
                                >
                                    <div className="p-2.5 bg-purple-500 text-white rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                                        <ArrowUpRight className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="font-semibold text-sm text-foreground block">Templates</span>
                                        <span className="text-xs text-muted-foreground">Start from library</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <Link
                                    href="/playground"
                                    className="flex items-center gap-3 p-3 rounded-xl border border-border/60 hover:border-orange-500/50 hover:bg-orange-500/5 hover:shadow-md transition-all group"
                                >
                                    <div className="p-2.5 bg-orange-500 text-white rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                                        <PlayCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="font-semibold text-sm text-foreground block">Playground</span>
                                        <span className="text-xs text-muted-foreground">Test events</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        <div className="bg-linear-to-br from-primary/90 to-blue-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Zap className="w-32 h-32 -mr-8 -mt-8" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="font-bold text-lg mb-2">New Features Available</h3>
                                <p className="text-blue-100 text-sm mb-4">Check out the new AI-powered flow generator.</p>
                                <button className="bg-white text-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors shadow-sm">
                                    Explore Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper icon
function PlusCircleIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8" />
            <path d="M12 8v8" />
        </svg>
    )
}
