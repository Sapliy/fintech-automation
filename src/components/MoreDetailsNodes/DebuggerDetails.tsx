import { memo } from "react";
import { Activity, AlertCircle, Download, Trash2 } from "lucide-react";
import { type TDebuggerData } from "../../nodes/types";

interface DebuggerDetailsProps {
  data: TDebuggerData<any>;
  handleUpdate: (updatedData: Partial<TDebuggerData<any>>) => void;
}

const DebuggerDetails = ({ data, handleUpdate }: DebuggerDetailsProps) => {
  const handleLogLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleUpdate({ logLevel: e.target.value as 'info' | 'warning' | 'error' });
  };

  const handleAutoScrollToggle = () => {
    handleUpdate({ autoScroll: !data.autoScroll });
  };

  const handleClearLogs = () => {
    handleUpdate({ logs: [] });
  };

  const handleExportLogs = () => {
    const logData = JSON.stringify(data.logs, null, 2);
    const blob = new Blob([logData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'debugger-logs.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Activity className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Debugger Settings</h3>
          <p className="text-sm text-gray-500">Monitor and configure logging</p>
        </div>
      </div>

      {/* Log Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Log Level</span>
          </div>
          <select
            value={data.logLevel}
            onChange={handleLogLevelChange}
            className="px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Auto-scroll</span>
          </div>
          <button
            onClick={handleAutoScrollToggle}
            className={`p-2 rounded-full transition-colors ${data.autoScroll ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
              }`}
          >
            <Activity className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Recent Logs */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700">Recent Logs</h4>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearLogs}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              title="Clear Logs"
            >
              <Trash2 className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={handleExportLogs}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              title="Export Logs"
            >
              <Download className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {data.logs?.slice(0, 5).map((log, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Activity className={`w-4 h-4 ${log.level === 'info' ? 'text-blue-500' :
                    log.level === 'warning' ? 'text-yellow-500' :
                      'text-red-500'
                  }`} />
                <span className="text-sm text-gray-600">{log.message}</span>
              </div>
              <span className="text-xs text-gray-400">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Status</span>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${data.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
            }`}>
            {data.isActive ? "Active" : "Inactive"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(DebuggerDetails);