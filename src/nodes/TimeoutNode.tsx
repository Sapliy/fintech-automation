import { Handle, type NodeProps, Position } from "@xyflow/react";
import { Timer, Play, Pause, RotateCcw, AlertCircle, ChevronDown, ChevronUp, Bell, BellOff } from "lucide-react";
import { useState, useEffect, memo } from "react";
import { nodeColors } from "../utils/edgeStyles";
import { type TimeoutNode } from "./types";
import { useStoreNode } from "../store";
import { useShallow } from "zustand/shallow";
import { SelectorNode } from "../store/type";

const selectorNode: SelectorNode = (state) => ({
  getSourceNodes: state.getSourceNodes,
  updateNodeData: state.updateNodeData,
});

const TimeoutNode = ({ data, selected, id, isConnectable }: NodeProps<TimeoutNode>) => {
  const [remainingTime, setRemainingTime] = useState(data.remainingTime || data.duration);
  const [isActive, setIsActive] = useState(data.isActive);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isAlertEnabled, setIsAlertEnabled] = useState(data.isAlertEnabled);
  const timeoutColor = nodeColors.timeout;
  const { getSourceNodes, updateNodeData } = useStoreNode(useShallow(selectorNode));
  const sourceNodes = getSourceNodes?.(id) ?? [];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prev: number) => {
          if (prev <= 1) {
            data.onTimeout?.();
            if (isAlertEnabled) {
              // Trigger alert notification
              console.log("Timeout alert triggered!");
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, remainingTime, data.onTimeout, isAlertEnabled]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (isNaN(remainingTime) || isNaN(data.duration)) return 0;
    return (remainingTime / data.duration) * 100;
  };

  const handleStart = () => {
    setIsActive(true);
    updateNodeData?.(id, { isActive: true });
  };

  const handlePause = () => {
    setIsActive(false);
    updateNodeData?.(id, { isActive: false });
  };

  const handleReset = () => {
    setRemainingTime(data.duration);
    setIsActive(false);
    updateNodeData?.(id, {
      isActive: false,
      remainingTime: data.duration
    });
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = parseInt(e.target.value);
    if (!isNaN(newDuration) && newDuration > 0) {
      updateNodeData?.(id, {
        duration: newDuration,
        remainingTime: newDuration
      });
      setRemainingTime(newDuration);
    }
  };

  const handleAlertToggle = () => {
    const newAlertState = !isAlertEnabled;
    setIsAlertEnabled(newAlertState);
    updateNodeData?.(id, { isAlertEnabled: newAlertState });
  };

  const getStatusColor = () => {
    if (remainingTime === 0) return "bg-destructive/10 text-destructive border-destructive/20";
    if (isActive) return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    return "bg-muted text-muted-foreground border-border";
  };

  const getStatusText = () => {
    if (remainingTime === 0) return "Timed Out";
    if (isActive) return "Running";
    return "Paused";
  };

  return (
    <div
      style={{ border: `2px solid ${selected ? timeoutColor.from : "transparent"}` }}
      className={`
        bg-card
        shadow-lg rounded-xl border border-border/60
        transition-all duration-300 ease-in-out
        hover:shadow-primary/20 hover:border-primary/40 transform hover:-translate-y-1
        min-w-[300px] overflow-hidden
      `}
    >
      {/* Header */}
      <div
        className="text-white px-4 py-2 rounded-t-lg 
                    flex items-center justify-between"
        style={{
          background: `linear-gradient(to right, ${timeoutColor.from}, ${timeoutColor.to})`
        }}
      >
        <div className="flex items-center gap-2">
          <Timer className="w-5 h-5" />
          <span className="font-semibold">Timeout</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAlertToggle}
            className={`p-1 rounded-full transition-colors ${isAlertEnabled ? 'bg-white/20' : 'hover:bg-white/20'
              }`}
            title={isAlertEnabled ? "Disable Alert" : "Enable Alert"}
          >
            {isAlertEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
            title="Advanced Settings"
          >
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-4 bg-secondary/30">
        <div className="space-y-5">
          {/* Timer Display */}
          <div className="flex flex-col items-center space-y-2">
            <div className="text-5xl font-mono font-bold text-foreground">
              {formatTime(remainingTime)}
            </div>
            <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              {formatTime(data.duration)} total duration
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-background border border-border/60 rounded-full h-3">
            <div
              className="h-full rounded-full transition-all duration-300 shadow-sm"
              style={{
                width: `${getProgressPercentage()}%`,
                backgroundColor: remainingTime > data.duration * 0.3
                  ? timeoutColor.from
                  : remainingTime > data.duration * 0.1
                    ? "#F59E0B"
                    : "#EF4444"
              }}
            />
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            {!isActive ? (
              <button
                onClick={handleStart}
                className="p-3 rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors shadow-sm"
                title="Start Timer"
              >
                <Play className="w-5 h-5 fill-current" />
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="p-3 rounded-full bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/20 transition-colors shadow-sm"
                title="Pause Timer"
              >
                <Pause className="w-5 h-5 fill-current" />
              </button>
            )}
            <button
              onClick={handleReset}
              className="p-3 rounded-full bg-muted text-foreground hover:bg-secondary border border-border transition-colors shadow-sm"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* Advanced Settings */}
          {showAdvanced && (
            <div className="mt-4 pt-4 border-t border-border/60">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-muted-foreground">Duration (seconds):</label>
                  <input
                    type="number"
                    value={data.duration}
                    onChange={handleDurationChange}
                    min="1"
                    className="px-2 py-1.5 rounded-md text-sm w-24 bg-background border border-border text-foreground font-mono focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide border ${getStatusColor()}`}>
                    {getStatusText()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Progress:</span>
                  <span className="font-mono text-sm font-semibold text-primary">
                    {getProgressPercentage().toFixed(0)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Alert:</span>
                  <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide border ${isAlertEnabled ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-muted text-muted-foreground border-border"
                    }`}>
                    {isAlertEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Connected Sensors */}
          {sourceNodes.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border/60">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                <AlertCircle className="w-4 h-4" />
                <span>Connected Sensors</span>
              </div>
              <div className="space-y-2">
                {sourceNodes.map((node) => (
                  <div key={node?.id} className="flex items-center justify-between text-sm p-2 bg-background border border-border/60 rounded-lg">
                    <span className="text-foreground font-medium">{node?.data?.label as string}</span>
                    <span className="font-mono text-primary text-xs bg-primary/10 px-2 py-0.5 rounded-full">{node?.data?.value as string}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="react-flow__handle-target"
        style={{
          top: -4,
          backgroundColor: timeoutColor.from
        }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="react-flow__handle-source"
        style={{
          bottom: -4,
          backgroundColor: timeoutColor.from
        }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default memo(TimeoutNode); 