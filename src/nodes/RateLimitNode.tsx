import { Handle, type NodeProps, Position } from '@xyflow/react';
import { memo, useState } from 'react';
import { Gauge, Activity } from 'lucide-react';
import { useShallow } from 'zustand/shallow';
import { useStoreNode } from '../store';
import type { Node } from '@xyflow/react';

// Time units for rate limiting
export type TimeUnit = 'second' | 'minute' | 'hour' | 'day';

// Node data type
export interface TRateLimitNodeData {
    label: string;
    limit: number;
    timeWindow: number;
    timeUnit: TimeUnit;
    burstAllowance: number;
    currentCount: number;
    status: 'idle' | 'allowed' | 'blocked';
    resetAt?: string;
}

export type RateLimitNode = Node<TRateLimitNodeData, 'rateLimit'>;

const timeUnitLabels: Record<TimeUnit, string> = {
    second: 'per second',
    minute: 'per minute',
    hour: 'per hour',
    day: 'per day',
};

const selectorNode = (state: any) => ({
    updateNodeData: state.updateNodeData,
});

const RateLimitNode = ({
    id,
    data,
    selected,
    isConnectable,
}: NodeProps<RateLimitNode>) => {
    const { updateNodeData } = useStoreNode(useShallow(selectorNode));

    // Unique color for rate limit
    const rateLimitColor = { from: '#DC2626', to: '#F87171' }; // Red

    const handleLimitChange = (limit: number) => {
        updateNodeData?.(id, { limit });
    };

    const handleTimeUnitChange = (timeUnit: TimeUnit) => {
        updateNodeData?.(id, { timeUnit });
    };

    const handleBurstChange = (burstAllowance: number) => {
        updateNodeData?.(id, { burstAllowance });
    };

    const statusColors = {
        idle: 'bg-gray-100 text-gray-600',
        allowed: 'bg-green-100 text-green-700',
        blocked: 'bg-red-100 text-red-700',
    };

    const usagePercent = data.limit > 0
        ? Math.min((data.currentCount || 0) / data.limit * 100, 100)
        : 0;

    return (
        <div
            style={{ border: `2px solid ${selected ? rateLimitColor.from : 'white'}` }}
            className={`
        shadow-lg rounded-lg bg-white border-2 
        transition-all duration-300 ease-in-out
        hover:shadow-xl transform hover:-translate-y-1
        min-w-[260px]
      `}
        >
            {/* Header */}
            <div
                className="text-white px-4 py-2 rounded-t-lg flex items-center justify-between"
                style={{
                    background: `linear-gradient(to right, ${rateLimitColor.from}, ${rateLimitColor.to})`,
                }}
            >
                <div className="flex items-center gap-2">
                    <Gauge className="w-5 h-5" />
                    <span className="font-semibold truncate">
                        {data.label || 'Rate Limit'}
                    </span>
                </div>
                <Activity
                    className={`w-4 h-4 ${data.status === 'blocked' ? 'text-yellow-300' : 'text-white'}`}
                />
            </div>

            {/* Body */}
            <div className="px-4 py-3 bg-gray-50 space-y-3">
                {/* Rate Limit Config */}
                <div className="flex gap-2 items-end">
                    <div className="flex-1">
                        <label className="text-xs font-medium text-gray-500 mb-1 block">
                            Max Requests
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={data.limit || 10}
                            onChange={(e) => handleLimitChange(parseInt(e.target.value) || 10)}
                            className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 bg-white text-sm focus:border-blue-400 focus:outline-none"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs font-medium text-gray-500 mb-1 block">
                            Time Window
                        </label>
                        <select
                            value={data.timeUnit || 'minute'}
                            onChange={(e) => handleTimeUnitChange(e.target.value as TimeUnit)}
                            className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 bg-white text-sm focus:border-blue-400 focus:outline-none"
                        >
                            {(Object.keys(timeUnitLabels) as TimeUnit[]).map((unit) => (
                                <option key={unit} value={unit}>
                                    {timeUnitLabels[unit]}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Burst Allowance */}
                <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                        Burst Allowance
                    </label>
                    <input
                        type="number"
                        min={0}
                        value={data.burstAllowance || 0}
                        onChange={(e) => handleBurstChange(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 bg-white text-sm focus:border-blue-400 focus:outline-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Extra requests allowed in burst mode
                    </p>
                </div>

                {/* Usage Bar */}
                <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Usage</span>
                        <span>{data.currentCount || 0} / {data.limit || 10}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-300 ${usagePercent >= 100 ? 'bg-red-500' :
                                    usagePercent >= 80 ? 'bg-yellow-500' :
                                        'bg-green-500'
                                }`}
                            style={{ width: `${usagePercent}%` }}
                        />
                    </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[data.status || 'idle']}`}>
                        {data.status || 'idle'}
                    </span>
                </div>
            </div>

            {/* Path Indicators */}
            <div className="px-4 py-2 bg-white rounded-b-lg border-t border-gray-100">
                <div className="flex justify-center gap-8 text-xs">
                    <span className="text-green-600">✓ Allowed</span>
                    <span className="text-red-600">✗ Blocked</span>
                </div>
            </div>

            {/* Input Handle */}
            <Handle
                type="target"
                isConnectable={isConnectable}
                position={Position.Top}
                style={{
                    top: -6,
                    backgroundColor: rateLimitColor.from
                }}
                className="react-flow__handle-target"
            />

            {/* Allowed Output */}
            <Handle
                type="source"
                position={Position.Bottom}
                id="allowed"
                style={{
                    left: '30%',
                    bottom: -4,
                    backgroundColor: '#10B981',
                }}
                className="react-flow__handle-source"
                isConnectable={isConnectable}
            />

            {/* Blocked Output */}
            <Handle
                type="source"
                position={Position.Bottom}
                id="blocked"
                style={{
                    left: '70%',
                    bottom: -4,
                    backgroundColor: '#EF4444',
                }}
                className="react-flow__handle-source"
                isConnectable={isConnectable}
            />
        </div>
    );
};

export default memo(RateLimitNode);
