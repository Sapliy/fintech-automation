'use client';

import { useRef, useEffect } from 'react';
import { Activity, Clock, CreditCard, Wallet, FileText, Settings, RefreshCw } from 'lucide-react';
import useEventStream from '../../hooks/useEventStream';
import { EventSource } from '../../types/events';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth.store';
import useToaster from '@/store/toaster.store';

const EventIcon = ({ source }: { source: EventSource }) => {
    switch (source) {
        case 'stripe': return <CreditCard className="w-5 h-5 text-indigo-500" />;
        case 'wallet': return <Wallet className="w-5 h-5 text-emerald-500" />;
        case 'ledger': return <FileText className="w-5 h-5 text-gray-500" />;
        case 'system': return <Settings className="w-5 h-5 text-orange-500" />;
        default: return <Activity className="w-5 h-5 text-blue-500" />;
    }
};

export default function EventTimelinePage() {
    const { events, connect, isConnected, clearEvents } = useEventStream({
        url: `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080'}/v1/events/stream`,
        autoReconnect: true
    });

    const scrollRef = useRef<HTMLDivElement>(null);
    const { zone } = useAuthStore();
    const { addToast } = useToaster();

    const handleReplay = async (event: any) => {
        if (!zone) return;

        try {
            const flowServiceUrl = process.env.NEXT_PUBLIC_FLOW_SERVICE_URL || 'http://localhost:8084';
            const response = await fetch(`${flowServiceUrl}/api/v1/events/${event.id}/replay`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ zoneId: zone.id }),
            });

            if (response.ok) {
                addToast({
                    title: 'Success',
                    description: 'Event replayed successfully',
                    status: 'success',
                    position: 'top-right'
                });
            } else {
                addToast({
                    title: 'Error',
                    description: 'Failed to replay event',
                    status: 'error',
                    position: 'top-right'
                });
            }
        } catch (error) {
            addToast({
                title: 'Error',
                description: 'Error replaying event',
                status: 'error',
                position: 'top-right'
            });
            console.error('Error replaying event:', error);
        }
    };

    // Auto-scroll to top when new events arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [events]);

    return (
        <div className="flex flex-col h-full w-full bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${isConnected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Event Timeline</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                            {isConnected ? 'Connected to Event Stream' : 'Disconnected'}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={clearEvents}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                    >
                        Clear
                    </button>
                    {!isConnected && (
                        <button
                            onClick={connect}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Reconnect
                        </button>
                    )}
                </div>
            </div>

            {/* Timeline Stream */}
            <div className="flex-1 overflow-hidden relative">
                <div
                    ref={scrollRef}
                    className="h-full overflow-y-auto p-8 space-y-4"
                >
                    <AnimatePresence initial={false}>
                        {events.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Waiting for events...</p>
                            </div>
                        ) : (
                            events.map((event) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                                            <EventIcon source={event.source} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                                        {event.type}
                                                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-mono font-medium">
                                                            {event.source}
                                                        </span>
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-0.5 font-mono text-xs">
                                                        ID: {event.id}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(event.timestamp).toLocaleTimeString()}
                                                    </div>
                                                    <button
                                                        onClick={() => handleReplay(event)}
                                                        className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-xs font-medium"
                                                        title="Replay this event"
                                                    >
                                                        <RefreshCw className="w-3 h-3" />
                                                        Replay
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Payload Viewer */}
                                            <div className="mt-3 bg-gray-50 rounded-lg p-3 font-mono text-xs text-gray-700 overflow-x-auto border border-gray-200">
                                                <pre>{JSON.stringify(event.payload, null, 2)}</pre>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
