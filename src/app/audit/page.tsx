'use client';

import { Settings, Shield, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { useState } from 'react';

// Dummy Data
const MOCK_LOGS = [
    { id: 'log_001', action: 'NODE_CREATED', user: 'admin@fintech.io', details: 'Created generic-trigger node', timestamp: '2024-03-15T11:45:00Z', status: 'success' },
    { id: 'log_002', action: 'FLOW_DEPLOYED', user: 'dev_team', details: 'Deployed "Large Transaction Alert"', timestamp: '2024-03-15T11:30:00Z', status: 'success' },
    { id: 'log_003', action: 'LOGIN_FAILURE', user: 'unknown', details: 'Failed login attempt from ip 192.168.1.5', timestamp: '2024-03-15T10:15:00Z', status: 'warning' },
    { id: 'log_004', action: 'API_KEY_ROTATED', user: 'system', details: 'Automated key rotation', timestamp: '2024-03-14T00:00:00Z', status: 'success' },
    { id: 'log_005', action: 'NODE_DELETED', user: 'admin@fintech.io', details: 'Deleted legacy-mqtt-node', timestamp: '2024-03-13T16:20:00Z', status: 'success' },
];

export default function AuditLogsPage() {
    const [filter, setFilter] = useState('');

    const filteredLogs = MOCK_LOGS.filter(l =>
        l.action.toLowerCase().includes(filter.toLowerCase()) ||
        l.user.toLowerCase().includes(filter.toLowerCase())
    );

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
