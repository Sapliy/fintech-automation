'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Plus,
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
    GitBranch,
    Clock,
    Activity,
    ArrowRight
} from 'lucide-react';
import { useFlowStore, FlowMetadata } from '@/store/flow.store';
import { useAuthStore } from '@/store/auth.store';
import { formatDistanceToNow } from 'date-fns';

export default function FlowsPage() {
    const router = useRouter();
    const { savedFlows, loadFlows, createNewFlow, isSaving } = useFlowStore();
    const { zone } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

    useEffect(() => {
        loadFlows();
    }, [loadFlows, zone?.id]);

    const handleCreateFlow = () => {
        // For now, just redirect to builder with a new flow intent
        // In a real app, this might open a modal to name the flow first
        createNewFlow('Untitled Flow').then(() => {
            router.push('/builder');
        });
    };

    const filteredFlows = savedFlows.filter(flow =>
        flow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flow.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full w-full bg-gray-50/50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Flows</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage and monitor your automation workflows</p>
                    </div>
                    <button
                        onClick={handleCreateFlow}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm ring-offset-2 focus:ring-2 focus:ring-primary/20"
                    >
                        <Plus className="w-4 h-4" />
                        New Flow
                    </button>
                </div>

                {/* Filters & Controls */}
                <div className="flex justify-between items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search flows..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg border border-gray-200">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
                {filteredFlows.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <div className="p-3 bg-white rounded-full shadow-sm mb-4">
                            <GitBranch className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No flows found</h3>
                        <p className="text-gray-500 max-w-sm mt-1 mb-4">
                            {searchQuery ? `No flows match "${searchQuery}"` : "Get started by creating your first automation flow."}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={handleCreateFlow}
                                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                                Create new flow
                            </button>
                        )}
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-3'}>
                        {filteredFlows.map((flow) => (
                            <FlowCard key={flow.id} flow={flow} viewMode={viewMode} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function FlowCard({ flow, viewMode }: { flow: FlowMetadata, viewMode: 'grid' | 'list' }) {
    const isGrid = viewMode === 'grid';

    // Helper to format date safely
    const timeAgo = (dateStr: string) => {
        try {
            return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
        } catch (e) {
            return 'recently';
        }
    };

    if (isGrid) {
        return (
            <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 overflow-hidden flex flex-col">
                <div className="p-5 flex-1">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-lg ${flow.is_template ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                            <GitBranch className="w-5 h-5" />
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors line-clamp-1">
                        {flow.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 h-10 mb-4">
                        {flow.description || 'No description provided.'}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{timeAgo(flow.updated_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            <span>{flow.nodeCount || 0} nodes</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-3 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${true ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${true ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                            Active
                        </span>
                    </div>

                    <Link
                        href={`/builder?id=${flow.id}`}
                        className="text-xs font-medium text-gray-600 hover:text-primary flex items-center gap-1 transition-colors"
                    >
                        Edit Flow <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
            </div>
        );
    }

    // List View
    return (
        <div className="group bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm hover:border-primary/30 transition-all flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={`p-2 rounded-lg ${flow.is_template ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                    <GitBranch className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors truncate">
                        {flow.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                        <span>{timeAgo(flow.updated_at)}</span>
                        <span>•</span>
                        <span>{flow.nodeCount || 0} nodes</span>
                        <span>•</span>
                        <span className={true ? 'text-emerald-600' : 'text-gray-500'}>Active</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                    href={`/builder?id=${flow.id}`}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    title="Edit in Builder"
                >
                    <Edit className="w-4 h-4" />
                </Link>
                <button className="p-2 text-gray-400 hover:text-destructive hover:bg-destructive/5 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
