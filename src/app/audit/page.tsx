'use client';

import { Settings, Shield, AlertTriangle, CheckCircle, Search, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import auditService, { AuditLog } from '@/services/auditService';

export default function AuditLogsPage() {
    const [filter, setFilter] = useState('');
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const data = await auditService.getAuditLogs({ limit: 50 });
                setLogs(data);
            } catch (error) {
                console.error('Failed to fetch audit logs:', error);
                setLogs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(l =>
        l.action.toLowerCase().includes(filter.toLowerCase()) ||
        l.user.toLowerCase().includes(filter.toLowerCase())
    );

    if (loading && logs.length === 0) {
        return (
            <div className="flex items-center justify-center h-full w-full bg-gray-50">
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                        <Settings className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
                        <p className="text-sm text-gray-500">System trace and administrative actions</p>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search logs..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                    />
                </div>
            </div>

            {/* Logs List */}
            <div className="flex-1 overflow-auto p-8">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="divide-y divide-gray-100">
                        {filteredLogs.map((log) => (
                            <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4">
                                <div className="mt-1">
                                    {log.status === 'success' ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-sm font-semibold text-gray-900">{log.action}</h3>
                                        <span className="text-xs text-gray-400 font-mono">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Shield className="w-3 h-3 text-gray-400" />
                                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                            {log.user}
                                        </span>
                                        <span className="text-xs font-mono text-gray-300 ml-2">
                                            ID: {log.id}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
