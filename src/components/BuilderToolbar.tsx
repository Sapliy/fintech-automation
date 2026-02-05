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
    ChevronDown
} from 'lucide-react';

export default function BuilderToolbar() {
    const {
        currentFlowName,
        saveCurrentFlow,
        isSaving,
        createNewFlow,
        savedFlows,
        loadFlowConfig
    } = useFlowStore();

    const [isFlowsOpen, setIsFlowsOpen] = useState(false);

    const { nodes, edges } = useStoreNode();
    const { zone } = useAuthStore();

    const [name, setName] = useState(currentFlowName);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        setName(currentFlowName);
    }, [currentFlowName]);

    const handleSave = async () => {
        setStatus('idle');
        try {
            await saveCurrentFlow();
            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);
        } catch (error) {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
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
        <div className="flex items-center justify-between w-full h-16 px-6 bg-white border-b border-gray-200 shadow-sm z-20">
            {/* Left side: Name & Status */}
            <div className="flex items-center space-x-4">
                <div className="flex flex-col">
                    <input
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-gray-900 w-64"
                        placeholder="Unnamed Flow"
                    />
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span className="flex items-center">
                            <span className={`w-2 h-2 rounded-full mr-1.5 ${zone ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                            {zone ? `Zone: ${zone.name}` : 'No Zone Selected'}
                        </span>
                        <span>•</span>
                        <span>{nodes.length} Nodes</span>
                        <span>•</span>
                        <span>{edges.length} Edges</span>
                    </div>
                </div>
            </div>

            {/* Right side: Actions */}
            <div className="flex items-center space-x-3">
                {status === 'success' && (
                    <span className="flex items-center text-green-600 text-sm animate-in fade-in slide-in-from-right-2">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Saved
                    </span>
                )}
                {status === 'error' && (
                    <span className="flex items-center text-red-600 text-sm animate-in fade-in slide-in-from-right-2">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Error Saving
                    </span>
                )}

                <div className="relative">
                    <button
                        onClick={() => setIsFlowsOpen(!isFlowsOpen)}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors mr-2"
                    >
                        <FolderOpen className="w-4 h-4 mr-2" />
                        Saved Flows
                        <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
                    </button>

                    {isFlowsOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-30 max-h-96 overflow-y-auto">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                                Your Automation Flows
                            </div>
                            {savedFlows.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-gray-400 italic">
                                    No flows found in this zone
                                </div>
                            ) : (
                                savedFlows.map((flow) => (
                                    <button
                                        key={flow.id}
                                        onClick={() => handleLoadFlow(flow.id)}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex flex-col"
                                    >
                                        <span className="font-medium">{flow.name}</span>
                                        <span className="text-[10px] text-gray-400 mt-0.5">Updated {new Date(flow.updated_at).toLocaleDateString()}</span>
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>

                <button
                    onClick={() => createNewFlow('Untitled Flow')}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New
                </button>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm"
                >
                    {isSaving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Flow
                </button>

                <div className="h-6 w-px bg-gray-200 mx-2"></div>

                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                    <Settings className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
