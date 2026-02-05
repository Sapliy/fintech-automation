import { memo } from "react";
import { Sun, Moon, Activity, Settings } from "lucide-react";
import { type Node } from "@xyflow/react";
import { type TimeoutNode, type DateTimeNode, type DebuggerNode, type FilterNode } from "../nodes/types";

interface MoreDetailsProps {
  selectedNode: Node | null;
}

const MoreDetails = ({ selectedNode }: MoreDetailsProps) => {
  if (!selectedNode) return null;

  const renderTimeoutDetails = (node: TimeoutNode) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Duration:</span>
          <span className="text-sm text-gray-800">{node.data.duration}ms</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Status:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${node.data.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
            }`}>
            {node.data.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    );
  };

  const renderDateTimeDetails = (node: DateTimeNode) => {
    const isDaytime = new Date().getHours() >= 6 && new Date().getHours() < 18;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Time:</span>
          <span className="text-sm text-gray-800">{node.data.time}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Date:</span>
          <span className="text-sm text-gray-800">{node.data.date}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Repeat:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${node.data.repeat ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
            }`}>
            {node.data.repeat ? "Enabled" : "Disabled"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Time of Day:</span>
          <div className="flex items-center gap-2">
            {isDaytime ? (
              <Sun className="w-4 h-4 text-yellow-500" />
            ) : (
              <Moon className="w-4 h-4 text-blue-500" />
            )}
            <span className="text-sm text-gray-800">{isDaytime ? "Day" : "Night"}</span>
          </div>
        </div>
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Active Days</h3>
          <div className="grid grid-cols-7 gap-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${node.data.activeDays?.includes(index)
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-400'
                  }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderDebuggerDetails = (node: DebuggerNode) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Log Level:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${node.data.logLevel === 'info' ? 'bg-blue-100 text-blue-700' :
            node.data.logLevel === 'warning' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
            {node.data.logLevel}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Auto-scroll:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${node.data.autoScroll ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
            }`}>
            {node.data.autoScroll ? "Enabled" : "Disabled"}
          </span>
        </div>
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Logs</h3>
          <div className="space-y-2">
            {node.data.logs?.slice(0, 5).map((log, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Activity className={`w-4 h-4 ${log.level === 'info' ? 'text-blue-500' :
                    log.level === 'warning' ? 'text-yellow-500' :
                      'text-red-500'
                    }`} />
                  <span className="text-gray-600">{log.message}</span>
                </div>
                <span className="text-gray-400 text-xs">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderFilterDetails = (node: FilterNode) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Operator:</span>
          <span className="text-sm text-gray-800">{node.data.operator}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Filter Value:</span>
          <span className="text-sm text-gray-800">{node.data.filterValue}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Value Type:</span>
          <span className="text-sm text-gray-800">{node.data.valueType}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {selectedNode.type === 'timeout' && 'Timeout Details'}
          {selectedNode.type === 'datetime' && 'DateTime Details'}
          {selectedNode.type === 'debugger' && 'Debugger Details'}
          {selectedNode.type === 'filter' && 'Filter Details'}
        </h2>
        <div className="flex items-center gap-2">
          <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <Settings className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {selectedNode.type === 'timeout' && renderTimeoutDetails(selectedNode as unknown as TimeoutNode)}
      {selectedNode.type === 'datetime' && renderDateTimeDetails(selectedNode as unknown as DateTimeNode)}
      {selectedNode.type === 'debugger' && renderDebuggerDetails(selectedNode as unknown as DebuggerNode)}
      {selectedNode.type === 'filter' && renderFilterDetails(selectedNode as unknown as FilterNode)}
    </div>
  );
};

export default memo(MoreDetails);