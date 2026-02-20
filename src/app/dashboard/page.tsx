'use client';

import { Activity, CreditCard, DollarSign, Users, Zap, Loader2, Search, ArrowUpRight, ArrowRight, PlayCircle, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthStore, Zone } from '@/store/auth.store';
import { AuthGuard } from '@/components/auth/AuthGuard';
import ZoneSelector from '@/components/ZoneSelector';
import zoneService from '@/services/zoneService';
import paymentService from '@/services/paymentService';
import ledgerService from '@/services/ledgerService';

export default function DashboardPage() {
    return (
        <AuthGuard requireAuth={true}>
            <DashboardContent />
        </AuthGuard>
    );
}

function DashboardContent() {
    const { zone, setZone } = useAuthStore();
    const [stats, setStats] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [zones, setZones] = useState<Zone[]>([]);

    useEffect(() => {
        const fetchZones = async () => {
            try {
                // Iterate organizations if needed, or just fetch for current context if API supports it
                // For now, assuming first org or similar logic, but zoneService.listZones needs orgId.
                // We'll trust the auth store or fetch for 'default' org if not in store.
                // Actually, better to just let the ZoneSelector handle list/select,
                // but we need an initial zone for the dashboard data.
                const { organization } = useAuthStore.getState();
                if (organization?.id) {
                    const fetchedZones = await zoneService.list(organization.id);
                    setZones(fetchedZones);
                    if (!zone && fetchedZones.length > 0) {
                        setZone(fetchedZones[0]);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch zones", error);
            }
        };
        fetchZones();
    }, [zone, setZone]);

    useEffect(() => {
        const fetchData = async () => {
            if (!zone) return;

            setLoading(true);
            try {
                // Parallel fetch for dashboard data
                const [payments, transactions] = await Promise.all([
                    paymentService.list(zone.id, 100),
                    ledgerService.listEntries(zone.id, 10), // Assuming getEntries supports limit/zone
                ]);

                // Calculate stats
                const totalVolume = Array.isArray(payments)
                    ? payments.reduce((acc: number, p: any) => p.status === 'succeeded' ? acc + p.amount : acc, 0)
                    : 0;

                // For active flows, we might need a flowService call, but let's mock the count for now or fetch it if cheap
                // const flows = await flowService.listFlows(zone.id);

                const transactionCount = Array.isArray(transactions) ? transactions.length : 0;

                setStats([
                    { label: 'Total Volume', value: `$${(totalVolume / 100).toLocaleString()}`, change: '+12.5%', trend: 'up', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Active Flows', value: '4', change: '+1', trend: 'up', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-500/10' }, // Todo: Wire flow count
                    { label: 'Transactions', value: transactionCount.toString(), change: '+8.2%', trend: 'up', icon: CreditCard, color: 'text-violet-500', bg: 'bg-violet-500/10' },
                    { label: 'System Health', value: '99.9%', change: 'Stable', trend: 'neutral', icon: Activity, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                ]);

                if (Array.isArray(transactions) && transactions.length > 0) {
                    setRecentActivity(transactions.map((tx: any) => ({
                        id: tx.id,
                        type: 'ledger',
                        message: tx.description || 'Transaction processed',
                        amount: tx.amount ? `$${(tx.amount / 100).toFixed(2)}` : '-',
                        status: 'success', // Simplified
                        time: new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        icon: CreditCard,
                    })));
                } else {
                    setRecentActivity([]);
                }

            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                // toast.error is handled by apiClient, but we can set empty states here
                setStats([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [zone]);

    if (loading && !stats.length) { // Only show full loader if no data
        return (
            <div className="flex items-center justify-center h-full w-full bg-background/50">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground animate-pulse">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full bg-background overflow-y-auto">
            {/* Header */}
            <div className="bg-card border-b border-border sticky top-0 z-10 px-8 py-4">
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
                            zones={zones}
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
                            className="bg-card p-6 rounded-xl border border-border/60 shadow-lg hover:shadow-primary/10 transition-all duration-300 group"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                {stat.change && (
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'text-emerald-400 bg-emerald-400/10' : 'text-muted-foreground bg-secondary'}`}>
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
                    <div className="lg:col-span-2 bg-card rounded-xl border border-border/60 shadow-lg overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-border/40 flex justify-between items-center bg-secondary/50">
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
                                        <div key={activity.id} className="group flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors">
                                            <div className={`p-2.5 rounded-full ${activity.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-primary/10 text-primary'}`}>
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
                        <div className="p-3 border-t border-border/40 bg-secondary/50 text-center">
                            <Link href="/activity" className="text-xs font-semibold text-primary hover:underline">
                                View Full History
                            </Link>
                        </div>
                    </div>

                    {/* Quick Actions & Tips */}
                    <div className="space-y-6">
                        <div className="bg-card rounded-xl border border-border/60 shadow-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-border/40 bg-secondary/50">
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

                        <div className="bg-linear-to-br from-accent to-blue-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group">
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
