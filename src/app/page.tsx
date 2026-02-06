'use client';

import { Activity, ArrowUpRight, ArrowDownLeft, CreditCard, DollarSign, Users, Zap } from 'lucide-react';
import Link from 'next/link';

const STATS = [
    { label: 'Total Volume', value: '$2.4M', change: '+12.5%', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Active Flows', value: '14', change: '+2', icon: Zap, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Transactions', value: '1,234', change: '+5.2%', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Active Events', value: '892', change: '+24%', icon: Activity, color: 'text-orange-600', bg: 'bg-orange-100' },
];

const RECENT_ACTIVITY = [
    { id: 1, type: 'payment', message: 'Payment of $500.00 succeeded', time: '2 mins ago', icon: ArrowDownLeft, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 2, type: 'flow', message: 'Fraud Check process completed', time: '5 mins ago', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 3, type: 'payout', message: 'Payout of $2,500.00 initiated', time: '1 hour ago', icon: ArrowUpRight, color: 'text-gray-500', bg: 'bg-gray-50' },
    { id: 4, type: 'system', message: 'Daily reconciliation started', time: '4 hours ago', icon: Activity, color: 'text-orange-500', bg: 'bg-orange-50' },
];

export default function DashboardPage() {
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
                    {STATS.map((stat) => (
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
                            {RECENT_ACTIVITY.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-4">
                                    <div className={`p-2 rounded-full ${activity.bg} ${activity.color} mt-1`}>
                                        <activity.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

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
