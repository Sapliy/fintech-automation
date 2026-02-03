import { Settings } from 'lucide-react';

const AuditLogs = () => {
    return (
        <div className="p-8 w-full h-full overflow-y-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                    <Settings className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
                    <p className="text-gray-500">System trace and user actions</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                <p>Audit logs viewer coming soon...</p>
            </div>
        </div>
    );
};

export default AuditLogs;
