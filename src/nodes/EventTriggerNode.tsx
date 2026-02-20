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
            style={{ border: `2px solid ${selected ? triggerColor.from : 'transparent'}` }}
            className={`
        shadow-lg rounded-xl bg-card border border-border/60 
        transition-all duration-200 ease-in-out
        hover:shadow-primary/20 hover:border-primary/40 transform hover:-translate-y-1
        min-w-[280px] overflow-hidden
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
            <div className="px-4 py-4 bg-secondary/30 space-y-4">
                {/* Event Source Selector */}
                <div className="relative">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                        Event Source
                    </label>
                    <button
                        onClick={() => setShowSourceDropdown(!showSourceDropdown)}
                        className={`
              w-full flex items-center justify-between
              px-3 py-2.5 rounded-lg border
              ${sourceStyle ? `${sourceStyle.bg} ${sourceStyle.border}` : 'bg-background border-border'}
              hover:border-border/80 transition-colors
            `}
                    >
                        <span className={`font-medium ${sourceStyle?.text || 'text-foreground'}`}>
                            {data.source ? EventSourceLabels[data.source] : 'Select source...'}
                        </span>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </button>

                    {showSourceDropdown && (
                        <div className="absolute z-20 w-full mt-1 bg-card border border-border rounded-lg shadow-xl overflow-hidden">
                            {(Object.keys(EventSourceLabels) as EventSource[]).map((source) => (
                                <button
                                    key={source}
                                    onClick={() => handleSourceChange(source)}
                                    className={`
                    w-full px-3 py-2 text-left hover:bg-secondary/50
                    first:rounded-t-lg last:rounded-b-lg border-b border-border/40 last:border-0
                    ${data.source === source ? 'bg-primary/20 text-primary' : 'text-foreground'}
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
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                            Event Type
                        </label>
                        <button
                            onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-border bg-background hover:border-border/80 transition-colors"
                        >
                            <span className={`font-mono text-xs ${data.eventType ? 'text-primary' : 'text-muted-foreground'}`}>
                                {data.eventType || 'Select event type...'}
                            </span>
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </button>

                        {showTypeDropdown && (
                            <div className="absolute z-20 w-full mt-1 bg-card border border-border rounded-lg shadow-xl max-h-48 overflow-y-auto">
                                {EventTypesBySource[data.source].map((eventType) => (
                                    <button
                                        key={eventType}
                                        onClick={() => handleEventTypeChange(eventType)}
                                        className={`
                      w-full px-3 py-2 text-left font-mono text-xs hover:bg-secondary/50
                      first:rounded-t-lg last:rounded-b-lg border-b border-border/40 last:border-0
                      ${data.eventType === eventType ? 'bg-primary/20 text-primary' : 'text-foreground'}
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
                    <div className="mt-2 p-3 bg-background border border-border/60 rounded-lg text-xs">
                        <div className="text-muted-foreground mb-1">Last event:</div>
                        <div className="font-mono text-primary truncate mb-0.5">
                            {data.lastEvent.id}
                        </div>
                        <div className="text-muted-foreground/60 text-[10px] uppercase">
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
