'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown, Globe, Shield, Zap } from 'lucide-react';
import { useAuthStore, Zone } from '@/store/auth.store';

const ZoneSelector = () => {
    const { zones, zone, setZone, organization } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);

    // Mock zones if none exist (for initial setup/demo)
    useEffect(() => {
        if (zones.length === 0 && organization) {
            // In a real app, these would be fetched from the API
            const demoZones: Zone[] = [
                { id: 'zone_test', name: 'Sandbox', org_id: organization.id, mode: 'test' },
                { id: 'zone_live', name: 'Production', org_id: organization.id, mode: 'live' },
            ];
            // Since we can't easily call setZones here without triggering re-renders or if it's not the right place
            // we'll assume the parent or a global effect handles fetching.
            // But for this component to look good in the recording:
        }
    }, [zones, organization]);

    if (!zone && zones.length > 0) {
        // Auto-select first zone if none selected
        // setZone(zones[0]); // Be careful with side effects in render
    }

    return (
        <div className="relative w-full px-2 mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center w-full p-2 rounded-lg border transition-all
                    ${zone?.mode === 'live'
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-blue-50 border-blue-200 text-blue-700'}
                `}
            >
                <div className="flex-1 flex items-center overflow-hidden">
                    {zone?.mode === 'live' ? (
                        <Zap className="w-4 h-4 mr-2 flex-shrink-0" />
                    ) : (
                        <Shield className="w-4 h-4 mr-2 flex-shrink-0" />
                    )}
                    <span className="text-xs font-bold truncate">
                        {zone?.name || 'Select Zone'}
                    </span>
                </div>
                <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute left-full ml-2 top-0 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-[100] animate-in fade-in slide-in-from-left-2">
                    <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Switch Zone
                    </div>
                    {zones.map((z) => (
                        <button
                            key={z.id}
                            onClick={() => {
                                setZone(z);
                                setIsOpen(false);
                            }}
                            className={`
                                w-full flex items-center px-3 py-2 text-sm hover:bg-gray-50 transition-colors
                                ${zone?.id === z.id ? 'text-blue-600 font-medium' : 'text-gray-600'}
                            `}
                        >
                            <div className={`w-2 h-2 rounded-full mr-3 ${z.mode === 'live' ? 'bg-green-500 shadow-sm shadow-green-200' : 'bg-blue-500 shadow-sm shadow-blue-200'}`} />
                            <div className="flex flex-col items-start translate-y-[1px]">
                                <span className="text-xs leading-none mb-1">{z.name}</span>
                                <span className="text-[10px] opacity-60 uppercase">{z.mode}</span>
                            </div>
                        </button>
                    ))}
                    <div className="border-t border-gray-50 mt-1 pt-1">
                        <button className="w-full flex items-center px-3 py-2 text-[11px] text-gray-500 hover:text-blue-600 transition-colors">
                            <Plus className="w-3 h-3 mr-2" />
                            Manage Zones
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const Plus = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

export default ZoneSelector;
