'use client';

import { Users, Shield, Bell } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {

    // Auto-redirect to zones or show landing
    // For now, let's show a settings landing page

    const SECTIONS = [
        { title: 'Zone Management', description: 'Manage your automation zones and environments', to: '/settings/zones', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-100' },
        { title: 'Team Members', description: 'Manage access and permissions', to: '/settings/team', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { title: 'Notifications', description: 'Configure alerts and system notifications', to: '/settings/notifications', icon: Bell, color: 'text-orange-600', bg: 'bg-orange-100' },
    ];

    return (
        <div className="flex flex-col h-full w-full bg-gray-50 overflow-y-auto">
            <div className="bg-white border-b border-gray-200 px-8 py-6">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500">Configure your workspace</p>
            </div>

            <div className="p-8 max-w-5xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SECTIONS.map((section) => (
                        <Link
                            key={section.to}
                            href={section.to}
                            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className={`w-12 h-12 rounded-lg ${section.bg} ${section.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <section.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h3>
                            <p className="text-sm text-gray-500">{section.description}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
