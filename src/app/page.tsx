'use client';

import { Activity, ArrowUpRight, CreditCard, DollarSign, Users, Zap, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';

export default function DashboardPage() {
    const { zone } = useAuthStore();
    const [stats, setStats] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

                const totalVolume = payments.reduce((acc: number, p: any) => p.status === 'succeeded' ? acc + p.amount : acc, 0);
                const transactionCount = Array.isArray(transactions) ? transactions.length : 0;

                setStats([
                    { label: 'Total Volume', value: `$${(totalVolume / 100).toLocaleString()}`, change: '+0%', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
                    { label: 'Active Flows', value: '0', change: '+0', icon: Zap, color: 'text-blue-600', bg: 'bg-blue-100' },
                    { label: 'Transactions', value: transactionCount.toString(), change: '+0%', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-100' },
                    { label: 'Active Events', value: '0', change: '+0%', icon: Activity, color: 'text-orange-600', bg: 'bg-orange-100' },
                ]);

                if (Array.isArray(transactions)) {
                    setRecentActivity(transactions.map((tx: any) => ({
                        id: tx.id,
                        type: 'ledger',
                        message: tx.description,
                        time: new Date(tx.created_at).toLocaleTimeString(),
                        icon: Activity,
                        color: 'text-blue-500',
                        bg: 'bg-blue-50'
                    })));
                }

            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [zone]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full w-full bg-gray-50">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full bg-gray-50 overflow-y-auto">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Overview of your automation ecosystem</p>
            </div>

            <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
                            <Link href="/timeline" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                View all
                            </Link>
                        </div>
                        <div className="p-6 space-y-6">
                            {recentActivity.length === 0 ? (
                                <p className="text-gray-500 text-sm text-center py-10">No recent activity found</p>
                            ) : (
                                recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-start gap-4">
                                        <div className={`p-2 rounded-full ${activity.bg} ${activity.color} mt-1`}>
                                            <activity.icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    ...

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-fit">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-900">Quick Actions</h2>
                        </div>
                        <div className="p-4 space-y-2">
                            <Link href="/builder" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors group">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-md group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Zap className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-sm">Create New Flow</span>
                            </Link>
                            <Link href="/templates" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors group">
                                <div className="p-2 bg-purple-100 text-purple-600 rounded-md group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    <ArrowUpRight className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-sm">Browse Templates</span>
                            </Link>
                            <Link href="/settings/zones" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors group">
                                <div className="p-2 bg-gray-100 text-gray-600 rounded-md group-hover:bg-gray-600 group-hover:text-white transition-colors">
                                    <Users className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-sm">Manage Team</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
