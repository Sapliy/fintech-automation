import { Handle, type NodeProps, Position } from "@xyflow/react";
import { Clock, Calendar, Bell, BellOff, CheckCircle2, XCircle, Repeat, ChevronDown, ChevronUp, Sun, Moon } from "lucide-react";
import { useState, useEffect, memo } from "react";
import { nodeColors } from "../utils/edgeStyles";
import { type DateTimeNode } from "./types";
import { useStoreNode } from "../store";
import { useShallow } from "zustand/shallow";
import { SelectorNode } from "../store/type";

const selectorNode: SelectorNode = (state) => ({
  getSourceNodes: state.getSourceNodes,
  updateNodeData: state.updateNodeData,
});

const DateTimeNode = ({ data, selected, id, isConnectable }: NodeProps<DateTimeNode>) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isActive, setIsActive] = useState(data.isActive);
  const [isTriggered, setIsTriggered] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const dateTimeColor = nodeColors.dateTime;
  const { getSourceNodes, updateNodeData } = useStoreNode(useShallow(selectorNode));
  const sourceNodes = getSourceNodes?.(id) ?? [];

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      if (isActive && data.time) {
        const [hours, minutes] = data.time.split(':').map(Number);
        const isTimeMatch = now.getHours() === hours && now.getMinutes() === minutes;
        
        if (isTimeMatch && !isTriggered) {
          setIsTriggered(true);
          data?.onTrigger?.();
        } else if (!isTimeMatch) {
          setIsTriggered(false);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [data.time, isActive, isTriggered, data.onTrigger]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleToggleActive = () => {
    const newActiveState = !isActive;
    setIsActive(newActiveState);
    updateNodeData?.(id, { data: { ...data, isActive: newActiveState } });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData?.(id, { data: { ...data, time: e.target.value } });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData?.(id, { data: { ...data, date: e.target.value } });
  };

  const handleRepeatToggle = () => {
    updateNodeData?.(id, { data: { ...data, repeat: !data.repeat } });
  };

  const handleDayToggle = (day: number) => {
    const newDays = data.activeDays?.includes(day)
      ? data.activeDays.filter(d => d !== day)
      : [...(data.activeDays || []), day];
    updateNodeData?.(id, { data: { ...data, activeDays: newDays } });
  };

  const getNextTriggerTime = () => {
    if (!data.time || !isActive) return "Not scheduled";
    
    const [hours, minutes] = data.time.split(':').map(Number);
    const nextTrigger = new Date();
    nextTrigger.setHours(hours, minutes, 0, 0);
    
    if (nextTrigger < currentTime) {
      nextTrigger.setDate(nextTrigger.getDate() + 1);
    }
    
    return formatTime(nextTrigger);
  };

  const isDaytime = () => {
    const hour = currentTime.getHours();
    return hour >= 6 && hour < 18;
  };

  return (
    <div
      style={{border: `2px solid ${selected ? dateTimeColor.from : "white"}`}}
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
          background: `linear-gradient(to right, ${dateTimeColor.from}, ${dateTimeColor.to})`
        }}
      >
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <span className="font-semibold">Date & Time</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleActive}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
            title={isActive ? "Deactivate" : "Activate"}
          >
            {isActive ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
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
      <div className="px-4 py-3">
        <div className="space-y-4">
          {/* Current Time & Date */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Current Time:</span>
              <span className="font-medium">{formatTime(currentTime)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Current Date:</span>
              <span className="font-medium">{formatDate(currentTime)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Time of Day:</span>
              <span className="flex items-center gap-1">
                {isDaytime() ? (
                  <>
                    <Sun className="w-4 h-4 text-yellow-500" />
                    <span className="text-yellow-600">Daytime</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-blue-500" />
                    <span className="text-blue-600">Nighttime</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Configuration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-600">Scheduled Time:</label>
              <input
                type="time"
                value={data.time}
                onChange={handleTimeChange}
                className="px-2 py-1 border rounded-md text-sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-600">Date:</label>
              <input
                type="date"
                value={data.date}
                onChange={handleDateChange}
                className="px-2 py-1 border rounded-md text-sm"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Repeat:</span>
              <button
                onClick={handleRepeatToggle}
                className={`p-1 rounded-full transition-colors ${
                  data.repeat ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                }`}
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Advanced Settings */}
          {showAdvanced && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Next Trigger:</span>
                  <span className="font-medium text-blue-600">{getNextTriggerTime()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${isTriggered ? "bg-green-100 text-green-700" :
                      isActive ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"}`}>
                    {isTriggered ? "Triggered" :
                      isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                {data.repeat && (
                  <div className="mt-2">
                    <div className="text-sm text-gray-600 mb-2">Active Days:</div>
                    <div className="grid grid-cols-7 gap-1">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                        <button
                          key={day}
                          onClick={() => handleDayToggle(index)}
                          className={`text-center text-xs py-1 rounded transition-colors ${
                            data.activeDays?.includes(index)
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Connected Sensors */}
          {sourceNodes.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Connected Sensors</span>
              </div>
              <div className="space-y-2">
                {sourceNodes.map((node) => (
                  <div key={node?.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{node?.data?.label as string}</span>
                    <span className="font-medium">{node?.data?.value as string}</span>
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
          backgroundColor: dateTimeColor.from
        }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="react-flow__handle-source"
        style={{ 
          bottom: -4,
          backgroundColor: dateTimeColor.from
        }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default memo(DateTimeNode); 