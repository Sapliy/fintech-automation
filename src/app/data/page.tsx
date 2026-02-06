'use client';

import { Database } from 'lucide-react';

export default function DataPage() {
    return (
        <div className="flex flex-col h-full w-full bg-gray-50 items-center justify-center p-8 text-center">
            <div className="bg-blue-100 p-6 rounded-full mb-6">
                <Database className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Management</h1>
            <p className="text-gray-500 max-w-md">
                Manage your transaction records, event logs, and system data here. This feature is coming soon.
            </p>
        </div>
    );
}
