'use client';

import React, { useState } from 'react';
import { ChevronDown, Shield, Zap, Plus } from 'lucide-react';

export interface Zone {
    id: string;
    name: string;
    mode: 'test' | 'live';
}

interface ZoneSelectorProps {
    zones: Zone[];
    selectedZone: Zone | null;
    onSelect: (zone: Zone) => void;
    onManage?: () => void;
}

const ZoneSelector = ({ zones, selectedZone, onSelect, onManage }: ZoneSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative w-full px-2 mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center w-full p-2 rounded-lg border transition-all
                    ${selectedZone?.mode === 'live'
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-blue-50 border-blue-200 text-blue-700'}
                `}
            >
                <div className="flex-1 flex items-center overflow-hidden">
                    {selectedZone?.mode === 'live' ? (
                        <Zap className="w-4 h-4 mr-2 flex-shrink-0" />
                    ) : (
                        <Shield className="w-4 h-4 mr-2 flex-shrink-0" />
                    )}
                    <span className="text-xs font-bold truncate">
                        {selectedZone?.name || 'Select Zone'}
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
                                onSelect(z);
                                setIsOpen(false);
                            }}
                            className={`
                                w-full flex items-center px-3 py-2 text-sm hover:bg-gray-50 transition-colors
                                ${selectedZone?.id === z.id ? 'text-blue-600 font-medium' : 'text-gray-600'}
                            `}
                        >
                            <div className={`w-2 h-2 rounded-full mr-3 ${z.mode === 'live' ? 'bg-green-500 shadow-sm shadow-green-200' : 'bg-blue-500 shadow-sm shadow-blue-200'}`} />
                            <div className="flex flex-col items-start translate-y-[1px]">
                                <span className="text-xs leading-none mb-1">{z.name}</span>
                                <span className="text-[10px] opacity-60 uppercase">{z.mode}</span>
                            </div>
                        </button>
                    ))}
                    {onManage && (
                        <div className="border-t border-gray-50 mt-1 pt-1">
                            <button
                                onClick={onManage}
                                className="w-full flex items-center px-3 py-2 text-[11px] text-gray-500 hover:text-blue-600 transition-colors"
                            >
                                <Plus className="w-3 h-3 mr-2" />
                                Manage Zones
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ZoneSelector;
