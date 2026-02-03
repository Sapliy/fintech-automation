import { Handle, type NodeProps, Position } from "@xyflow/react";
import {
  Bug,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  Activity,
  ChevronDown,
  ChevronUp,
  Trash2,
  Download,
  Search,
} from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useStoreNode } from "../store";
import { useShallow } from "zustand/shallow";
import { SelectorNode } from "../store/type";
import { nodeColors } from "../utils/edgeStyles";
import { type DebuggerNode } from "./types";
import { p } from "framer-motion/client";

const selectorNode: SelectorNode = (state) => ({
  getSourceNodes: state.getSourceNodes,
  updateNodeData: state.updateNodeData,
});

const DebuggerNode = ({
  data,
  selected,
  id,
  isConnectable,
}: NodeProps<DebuggerNode>) => {
  const { getSourceNodes, updateNodeData } = useStoreNode(
    useShallow(selectorNode)
  );
  const debuggerColor = nodeColors.debugger;
  const lastValuesRef = useRef<Record<string, any>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [logLevelFilter, setLogLevelFilter] = useState<string>("all");
  const [autoScroll, setAutoScroll] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const [sourceNodes, setSourceNodes] = useState(getSourceNodes?.(id) ?? []);

  useEffect(() => {
    const newLogs: { timestamp: string; message: string; level: string }[] = [];

    sourceNodes.forEach((node) => {
      if (!node?.id || !node?.data?.value) return;

      console.log("data.value", node.data.value);

      const currentValue = node.data.value;
      const lastValue = lastValuesRef.current[node.id];

      if (currentValue !== lastValue) {
        const timestamp = new Date().toLocaleTimeString();
        const message = `${node.data.label}: ${currentValue}`;
        newLogs.push({ timestamp, message, level: "info" });
        lastValuesRef.current[node.id] = currentValue;
      }
    });

    if (newLogs.length > 0) {
      updateNodeData?.(id, {
        logs: [...(data.logs || []), ...newLogs].slice(-100),
      });
    }
  }, [sourceNodes, id, updateNodeData, getSourceNodes]);

  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data.logs, autoScroll]);

  useEffect(() => {
    const updatedNodes = getSourceNodes?.(id) || [];
    setSourceNodes(updatedNodes);
  }, [getSourceNodes, id]);

  const getLogIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-100 text-red-700";
      case "warning":
        return "bg-yellow-100 text-yellow-700";
      case "success":
        return "bg-green-100 text-green-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const handleClearLogs = () => {
    updateNodeData?.(id, { logs: [] });
  };

  const handleExportLogs = () => {
    const logData = JSON.stringify(data.logs, null, 2);
    const blob = new Blob([logData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `debugger-logs-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLogs = (data.logs || []).filter((log) => {
    const matchesSearch = log.message
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLevel =
      logLevelFilter === "all" || log.level === logLevelFilter;
    return matchesSearch && matchesLevel;
  });

  const logStats = (data.logs || []).reduce((acc, log) => {
    acc[log.level] = (acc[log.level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div
      style={{ border: `2px solid ${selected ? debuggerColor.from : "white"}` }}
      className={`
        bg-white
        shadow-lg rounded-lg border-2
        transition-all duration-300 ease-in-out
        hover:shadow-xl transform hover:-translate-y-1
        min-w-[300px]
      `}
    >
      {/* Header */}
      <div
        className="text-white px-4 py-2 rounded-t-lg 
                    flex items-center justify-between"
        style={{
          background: `linear-gradient(to right, ${debuggerColor.from}, ${debuggerColor.to})`,
        }}
      >
        <div className="flex items-center gap-2">
          <Bug className="w-5 h-5" />
          <span className="font-semibold">Debugger</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
            {data.logs?.length || 0} logs
          </div>
          {sourceNodes.length > 0 && (
            <div className="text-xs bg-white/20 px-2 py-1 rounded-full flex items-center gap-1">
              <Activity className="w-3 h-3" />
              {sourceNodes.length} sensors
            </div>
          )}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
            title="Advanced Settings"
          >
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: `1px solid ${debuggerColor.from}` }}
                className="w-full pl-8 pr-2 py-1 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={logLevelFilter}
              onChange={(e) => setLogLevelFilter(e.target.value)}
              className="text-sm border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ border: `1px solid ${debuggerColor.from}` }}
            >
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="success">Success</option>
            </select>
          </div>

          {/* Log Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Info:</span>
                <span className="font-medium">{logStats.info || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Warnings:</span>
                <span className="font-medium">{logStats.warning || 0}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Errors:</span>
                <span className="font-medium">{logStats.error || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Success:</span>
                <span className="font-medium">{logStats.success || 0}</span>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          {showAdvanced && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Auto-scroll:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoScroll}
                      onChange={(e) => setAutoScroll(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Actions:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleClearLogs}
                      className="p-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                      title="Clear Logs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleExportLogs}
                      className="p-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                      title="Export Logs"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Connected Sensors */}
          {sourceNodes.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Activity className="w-4 h-4" />
                <span>Connected Sensors</span>
              </div>
              <div className="space-y-2">
                {sourceNodes.map((node) => (
                  <div
                    key={node?.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-600">
                      {node?.data?.label as string}
                    </span>
                    <span className="font-medium">
                      {node?.data?.value as string}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Log Display */}
          <div className="mt-4 max-h-[200px] overflow-y-auto">
            {filteredLogs.map((log, index) => (
              <div
                key={index}
                className="flex items-start gap-2 py-2 border-b border-gray-100 last:border-0"
              >
                <div className="mt-1">{getLogIcon(log.level)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {log.timestamp}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getLogColor(
                        log.level
                      )}`}
                    >
                      {log.level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{log.message}</p>
                </div>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="react-flow__handle-target"
        style={{
          top: -4,
          backgroundColor: debuggerColor.from,
        }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default memo(DebuggerNode);
