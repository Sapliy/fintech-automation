'use client';

import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Clock,
    Code,
    Braces,
    Activity
} from 'lucide-react';

// Mock Run Details
const MOCK_RUN_DETAIL = {
    id: 'run_123456789',
    flow_id: 'fl_987654321',
    status: 'success',
    trigger: {
        type: 'eventTrigger',
        source: 'stripe',
        event: 'payment.succeeded',
        payload: {
            amount: 5000,
            currency: 'usd',
            customer: 'cus_123'
        }
    },
    started_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    duration_ms: 450,
    steps: [
        {
            id: 'step_1',
            node_id: '1',
            type: 'eventTrigger',
            name: 'Payment Succeeded',
            status: 'success',
            duration_ms: 10,
            output: { event_id: 'evt_123' }
        },
        {
            id: 'step_2',
            node_id: '2',
            type: 'condition',
            name: 'Is High Value?',
            status: 'success',
            duration_ms: 5,
            output: { result: true }
        },
        {
            id: 'step_3',
            node_id: '3',
            type: 'filter',
            name: 'Filter Fraud',
            status: 'success',
            duration_ms: 2,
            output: { passed: true }
        },
        {
            id: 'step_4',
            node_id: '4',
            type: 'action',
            name: 'Send Slack Alert',
            status: 'success',
            duration_ms: 430,
            output: { sent: true, channel: 'C123' }
        }
    ]
};

export default function RunDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const runId = params.runId as string;
    // const flowId = params.id as string;

    // In a real app, fetch run data here
    const run = MOCK_RUN_DETAIL;

    return (
        <div className="flex flex-col h-full w-full bg-gray-50/50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-6">
                <div className="flex items-center gap-4 mb-2">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight font-mono">
                                {runId}
                            </h1>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${run.status === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                run.status === 'failed' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-100 text-gray-700 border-gray-200'
                                }`}>
                                {run.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            Started {new Date(run.started_at).toLocaleString()}
                            <span>•</span>
                            Duration: {run.duration_ms}ms
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 flex gap-6">
                {/* Left: Steps Timeline */}
                <div className="w-1/3 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 font-medium text-gray-900 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" />
                        Execution Trace
                    </div>
                    <div className="p-4 space-y-4">
                        {run.steps.map((step) => (
                            <div key={step.id} className="relative pl-6 pb-4 border-l-2 border-gray-100 last:pb-0 last:border-0">
                                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center bg-white ${step.status === 'success' ? 'border-emerald-500 text-emerald-500' : 'border-gray-300 text-gray-300'
                                    }`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${step.status === 'success' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                                </div>

                                <div className="mb-1 flex justify-between items-start">
                                    <span className="font-medium text-gray-900 text-sm">{step.name}</span>
                                    <span className="text-xs text-gray-400 font-mono">{step.duration_ms}ms</span>
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-2">
                                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono uppercase text-[10px]">
                                        {step.type}
                                    </span>
                                    <span className="font-mono text-gray-400">#{step.node_id}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Data Inspector */}
                <div className="flex-1 space-y-6">
                    {/* Trigger Payload */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50/50 font-medium text-gray-900 flex items-center gap-2">
                            <Braces className="w-4 h-4 text-blue-600" />
                            Trigger Payload
                        </div>
                        <div className="p-4 bg-gray-900 text-gray-200 font-mono text-sm overflow-x-auto">
                            <pre>{JSON.stringify(run.trigger.payload, null, 2)}</pre>
                        </div>
                    </div>

                    {/* Step Output (Mock for last step) */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50/50 font-medium text-gray-900 flex items-center gap-2">
                            <Code className="w-4 h-4 text-purple-600" />
                            Final Output
                        </div>
                        <div className="p-4 bg-gray-900 text-gray-200 font-mono text-sm overflow-x-auto">
                            <pre>{JSON.stringify(run.steps[run.steps.length - 1].output, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
