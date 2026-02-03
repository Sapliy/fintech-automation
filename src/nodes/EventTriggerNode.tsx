import { Handle, type NodeProps, Position } from '@xyflow/react';
import { memo, useState } from 'react';
import { Zap, ChevronDown, Activity } from 'lucide-react';
import { useShallow } from 'zustand/shallow';
import { useStoreNode } from '../store';
import { nodeColors } from '../utils/edgeStyles';
import {
    EventSource,
    EventType,
    EventSourceLabels,
    EventTypesBySource,
    EventSourceColors
} from '../types/events';
import type { TEventTriggerData } from './types';
import type { Node } from '@xyflow/react';

// Node data type definition removed (imported from ./types)

export type EventTriggerNode = Node<TEventTriggerData, 'eventTrigger'>;

const selectorNode = (state: any) => ({
    updateNodeData: state.updateNodeData,
    getTargetNodes: state.getTargetNodes,
});

const EventTriggerNode = ({
    id,
    data,
    selected,
    isConnectable,
}: NodeProps<EventTriggerNode>) => {
    const [showSourceDropdown, setShowSourceDropdown] = useState(false);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const { updateNodeData, getTargetNodes } = useStoreNode(useShallow(selectorNode));

    const triggerColor = nodeColors['eventTrigger']; // Reuse sensor colors for triggers
    const sourceStyle = data.source ? EventSourceColors[data.source] : null;

    const handleSourceChange = (source: EventSource) => {
        updateNodeData?.(id, {
            source,
            eventType: null // Reset event type when source changes
        });
        setShowSourceDropdown(false);
    };

    const handleEventTypeChange = (eventType: EventType) => {
        updateNodeData?.(id, { eventType });
        setShowTypeDropdown(false);

        // Propagate to connected nodes
        const targetNodes = getTargetNodes?.(id) ?? [];
        targetNodes.forEach((targetNode: any) => {
            if (targetNode) {
                updateNodeData?.(targetNode.id, {
                    sourceTrigger: { source: data.source, eventType }
                });
            }
        });
    };

    return (
        <div
            style={{ border: `2px solid ${selected ? triggerColor.from : 'white'}` }}
            className={`
        shadow-lg rounded-lg bg-white border-2 
        transition-all duration-200 ease-in-out
        hover:shadow-xl transform hover:-translate-y-1
        min-w-[280px]
      `}
        >
            {/* Header */}
            <div
                className="text-white px-4 py-2 rounded-t-lg flex items-center justify-between"
                style={{
                    background: `linear-gradient(to right, ${triggerColor.from}, ${triggerColor.to})`,
                }}
            >
                <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    <span className="font-semibold truncate">
                        {data.label || 'Event Trigger'}
                    </span>
                </div>
                <Activity
                    className={`w-4 h-4 transition-all duration-200
            ${data.isActive ? 'text-green-300 scale-125' : 'text-white scale-100'}`}
                />
            </div>

            {/* Body */}
            <div className="px-4 py-3 bg-gray-50 space-y-3">
                {/* Event Source Selector */}
                <div className="relative">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                        Event Source
                    </label>
                    <button
                        onClick={() => setShowSourceDropdown(!showSourceDropdown)}
                        className={`
              w-full flex items-center justify-between
              px-3 py-2 rounded-lg border-2
              ${sourceStyle ? `${sourceStyle.bg} ${sourceStyle.border}` : 'bg-white border-gray-200'}
              hover:border-gray-300 transition-colors
            `}
                    >
                        <span className={`font-medium ${sourceStyle?.text || 'text-gray-600'}`}>
                            {data.source ? EventSourceLabels[data.source] : 'Select source...'}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    {showSourceDropdown && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                            {(Object.keys(EventSourceLabels) as EventSource[]).map((source) => (
                                <button
                                    key={source}
                                    onClick={() => handleSourceChange(source)}
                                    className={`
                    w-full px-3 py-2 text-left hover:bg-gray-50
                    first:rounded-t-lg last:rounded-b-lg
                    ${data.source === source ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
                  `}
                                >
                                    {EventSourceLabels[source]}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Event Type Selector */}
                {data.source && (
                    <div className="relative">
                        <label className="text-xs font-medium text-gray-500 mb-1 block">
                            Event Type
                        </label>
                        <button
                            onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg border-2 border-gray-200 bg-white hover:border-gray-300 transition-colors"
                        >
                            <span className={`font-mono text-sm ${data.eventType ? 'text-gray-800' : 'text-gray-400'}`}>
                                {data.eventType || 'Select event type...'}
                            </span>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>

                        {showTypeDropdown && (
                            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                {EventTypesBySource[data.source].map((eventType) => (
                                    <button
                                        key={eventType}
                                        onClick={() => handleEventTypeChange(eventType)}
                                        className={`
                      w-full px-3 py-2 text-left font-mono text-sm hover:bg-gray-50
                      first:rounded-t-lg last:rounded-b-lg
                      ${data.eventType === eventType ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
                    `}
                                    >
                                        {eventType}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Last Event Preview */}
                {data.lastEvent && (
                    <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                        <div className="text-gray-500">Last event:</div>
                        <div className="font-mono text-gray-700 truncate">
                            {data.lastEvent.id}
                        </div>
                        <div className="text-gray-400">
                            {new Date(data.lastEvent.timestamp).toLocaleTimeString()}
                        </div>
                    </div>
                )}
            </div>

            {/* Output Handle */}
            <Handle
                type="source"
                position={Position.Bottom}
                id="source"
                style={{
                    bottom: -4,
                    backgroundColor: triggerColor.to,
                }}
                className="react-flow__handle-source"
                isConnectable={isConnectable}
            />
        </div>
    );
};

export default memo(EventTriggerNode);
