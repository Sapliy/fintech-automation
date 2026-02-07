'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Shield, Zap, Plus, Check } from 'lucide-react';
import { Zone } from '../store/auth.store';

interface ZoneSelectorProps {
    zones: Zone[];
    selectedZone: Zone | null;
    onSelect: (zone: Zone) => void;
    onManage?: () => void;
}

const ZoneSelector = ({ zones, selectedZone, onSelect, onManage }: ZoneSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200
                    ${isOpen ? 'ring-2 ring-primary/20 border-primary' : 'border-border hover:border-border/80 hover:bg-muted/50'}
                    bg-white
                `}
            >
                <div className={`
                    p-1 rounded-md 
                    ${selectedZone?.mode === 'live' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}
                `}>
                    {selectedZone?.mode === 'live' ? (
                        <Zap className="w-3.5 h-3.5" />
                    ) : (
                        <Shield className="w-3.5 h-3.5" />
                    )}
                </div>

                <div className="text-left hidden sm:block">
                    <p className="text-xs font-semibold text-foreground leading-none">
                        {selectedZone?.name || 'Select Zone'}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider leading-none mt-0.5">
                        {selectedZone?.mode || 'NO MODE'}
                    </p>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-60 bg-white rounded-xl shadow-soft-xl border border-border py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50">
                        Switch Environment
                    </div>

                    <div className="p-1.5 space-y-0.5 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                        {zones.map((z) => {
                            const isSelected = selectedZone?.id === z.id;
                            const isLive = z.mode === 'live';

                            return (
                                <button
                                    key={z.id}
                                    onClick={() => {
                                        onSelect(z);
                                        setIsOpen(false);
                                    }}
                                    className={`
                                        w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all group
                                        ${isSelected ? 'bg-muted' : 'hover:bg-muted/50'}
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`
                                            w-2 h-2 rounded-full ring-2 ring-offset-1 transition-all
                                            ${isLive
                                                ? 'bg-emerald-500 ring-emerald-200'
                                                : 'bg-blue-500 ring-blue-200'
                                            }
                                        `}></div>
                                        <div className="flex flex-col items-start">
                                            <span className={`text-sm font-medium ${isSelected ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                                {z.name}
                                            </span>
                                        </div>
                                    </div>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                                </button>
                            );
                        })}
                    </div>

                    {onManage && (
                        <div className="p-1.5 border-t border-border/50 mt-1">
                            <button
                                onClick={() => {
                                    onManage();
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Create or Manage Zones
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ZoneSelector;
