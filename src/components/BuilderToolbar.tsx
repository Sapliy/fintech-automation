'use client';

import React, { useState, useEffect } from 'react';
import { useFlowStore } from '../store/flow.store';
import { useStoreNode } from '../store/node.store';
import { useAuthStore } from '../store/auth.store';
import {
    Save,
    Plus,
    Settings,
    CheckCircle2,
    AlertCircle,
    Loader2,
    FolderOpen,
    ChevronDown,
    ArrowLeft,
    LayoutTemplate
} from 'lucide-react';
import Link from 'next/link';

export default function BuilderToolbar() {
    const {
        currentFlowName,
        saveCurrentFlow,
        isSaving,
        createNewFlow,
        savedFlows,
        loadFlowConfig,
    } = useFlowStore();

    const [isFlowsOpen, setIsFlowsOpen] = useState(false);

    const { nodes, edges } = useStoreNode();
    const { zone } = useAuthStore();

    const [name, setName] = useState(currentFlowName);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    useEffect(() => {
        setName(currentFlowName);
    }, [currentFlowName]);

    const handleSave = async () => {
        setStatus("idle");
        try {
            await saveCurrentFlow();
            setStatus("success");
            setTimeout(() => setStatus("idle"), 3000);
        } catch (error) {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 3000);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);
        // We might want a separate action to update name in store without saving
        useFlowStore.setState({ currentFlowName: newName });
    };

    const handleLoadFlow = (id: string) => {
        loadFlowConfig(id);
        setIsFlowsOpen(false);
    };

    return (
        <div className="flex items-center justify-between w-full h-16 px-6 bg-card border-b border-border shadow-sm z-30 relative">
            {/* Left side: Back & Name */}
            <div className="flex items-center gap-4">
                <Link
                    href="/"
                    className="p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>

                <div className="h-6 w-px bg-border"></div>

                <div className="flex flex-col">
                    <input
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        className="text-lg font-bold bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-foreground w-64 placeholder:text-muted-foreground/50"
                        placeholder="Untitled Flow"
                    />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <span
                                className={`w-1.5 h-1.5 rounded-full ${zone ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-gray-300"
                                    }`}
                            ></span>
                            {zone ? zone.name : "No Zone"}
                        </span>
                        <span className="text-border">•</span>
                        <span>{nodes.length} Nodes</span>
                        <span className="text-border">•</span>
                        <span>{edges.length} Edges</span>
                    </div>
                </div>
            </div>

            {/* Center: Status Indicator */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                {status === "success" && (
                    <span className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-full animate-in fade-in zoom-in duration-300 border border-emerald-100 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        All changes saved
                    </span>
                )}
                {status === "error" && (
                    <span className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-full animate-in fade-in zoom-in duration-300 border border-red-100 shadow-sm">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Failed to save changes
                    </span>
                )}
            </div>

            {/* Right side: Actions */}
            <div className="flex items-center gap-3">
                {/* Templates Button */}
                <button className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors">
                    <LayoutTemplate className="w-4 h-4" />
                    Templates
                </button>

                {/* Saved Flows Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsFlowsOpen(!isFlowsOpen)}
                        className={`
                flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200
                ${isFlowsOpen
                                ? 'bg-secondary border-border text-foreground'
                                : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-border/80 hover:bg-secondary/50'
                            }
            `}
                    >
                        <FolderOpen className="w-4 h-4" />
                        <span className="hidden sm:inline">Open</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isFlowsOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isFlowsOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsFlowsOpen(false)}></div>
                            <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                                <div className="px-4 py-3 bg-secondary/30 border-b border-border flex justify-between items-center">
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Your Flows
                                    </span>
                                    <button
                                        onClick={() => {
                                            createNewFlow("Untitled Flow");
                                            setIsFlowsOpen(false);
                                        }}
                                        className="p-1 hover:bg-secondary hover:text-primary rounded transition-all text-muted-foreground"
                                        title="New Flow"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                                    {savedFlows.length === 0 ? (
                                        <div className="px-8 py-8 text-center">
                                            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2 text-gray-300">
                                                <FolderOpen className="w-5 h-5" />
                                            </div>
                                            <p className="text-sm text-muted-foreground italic">
                                                No flows found
                                            </p>
                                        </div>
                                    ) : (
                                        savedFlows.map((flow) => (
                                            <button
                                                key={flow.id}
                                                onClick={() => handleLoadFlow(flow.id)}
                                                className="w-full text-left px-4 py-3 hover:bg-secondary transition-colors flex flex-col group border-b border-border/40 last:border-0"
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate pr-4">
                                                        {flow.name}
                                                    </span>
                                                    {flow.id === "current-id-placeholder" && (
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-muted-foreground">
                                                    Updated {new Date(flow.updated_at).toLocaleDateString()}
                                                </span>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="h-6 w-px bg-border mx-1"></div>

                {/* Primary Actions */}
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`
            flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white shadow-lg shadow-primary/20
            transition-all duration-200 border border-transparent
            ${isSaving
                            ? 'bg-primary/80 cursor-wait'
                            : 'bg-primary hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md'
                        }
          `}
                >
                    {isSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    Save
                </button>

                <button className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors border border-transparent hover:border-border">
                    <Settings className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
