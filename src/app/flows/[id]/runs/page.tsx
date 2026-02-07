'use client';

import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    AlertCircle,
    PlayCircle,
    MoreHorizontal,
    Search
} from 'lucide-react';
import { useState } from 'react';

// Mock Execution Data
const MOCK_RUNS = [
    {
        id: 'run_123456789',
        status: 'success',
        trigger: 'payment.succeeded',
        started_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
        duration_ms: 450,
        steps_completed: 5,
        total_steps: 5,
    },
    {
        id: 'run_987654321',
        status: 'failed',
        trigger: 'payment.failed',
        started_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        duration_ms: 120,
        steps_completed: 2,
        total_steps: 5,
        error: 'Timeout waiting for external API'
    },
    {
        id: 'run_456123789',
        status: 'running',
        trigger: 'user.signup',
        started_at: new Date(Date.now() - 1000 * 10).toISOString(), // 10s ago
        duration_ms: 0,
        steps_completed: 1,
        total_steps: 4,
    }
];

export default function FlowRunsPage() {
    const params = useParams();
    const router = useRouter();
    const flowId = params.id as string;
    const [filter, setFilter] = useState('all');

    const statusColor = (status: string) => {
        switch (status) {
            case 'success': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'failed': return 'text-red-600 bg-red-50 border-red-100';
            case 'running': return 'text-blue-600 bg-blue-50 border-blue-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    const StatusIcon = ({ status }: { status: string }) => {
        switch (status) {
            case 'success': return <CheckCircle2 className="w-4 h-4" />;
            case 'failed': return <XCircle className="w-4 h-4" />;
            case 'running': return <PlayCircle className="w-4 h-4 animate-pulse" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-gray-50/50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-6">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                            Execution History
                            <span className="text-gray-400 font-normal text-base">/</span>
                            <span className="font-mono text-base text-gray-500">{flowId}</span>
                        </h1>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {['all', 'success', 'failed', 'running'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`
                                    px-3 py-1.5 rounded-full text-xs font-medium capitalize border transition-all
                                    ${filter === f
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}
                                `}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search executions..."
                            className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Run ID</th>
                                <th className="px-6 py-3">Trigger Info</th>
                                <th className="px-6 py-3">Duration</th>
                                <th className="px-6 py-3">Started</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {MOCK_RUNS.map((run) => (
                                <tr
                                    key={run.id}
                                    className="hover:bg-gray-50 transition-colors group cursor-pointer"
                                    onClick={() => router.push(`/flows/${flowId}/runs/${run.id}`)}
                                >
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${statusColor(run.status)}`}>
                                            <StatusIcon status={run.status} />
                                            <span className="capitalize font-medium text-xs">{run.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-gray-600">
                                        {run.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">{run.trigger}</span>
                                            {run.error && (
                                                <span className="text-xs text-red-500 mt-0.5">{run.error}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                                        {run.duration_ms > 0 ? `${run.duration_ms}ms` : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(run.started_at).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
