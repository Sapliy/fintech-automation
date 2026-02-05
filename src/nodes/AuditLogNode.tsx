import { Handle, type NodeProps, Position } from '@xyflow/react';
import { memo, useState } from 'react';
import {
    FileText,
    ChevronDown,
    Activity
} from 'lucide-react';
import { useShallow } from 'zustand/shallow';
import { useStoreNode } from '../store';
import type { Node } from '@xyflow/react';

// Severity levels
export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical';

// Node data type
export interface TAuditLogNodeData extends Record<string, unknown> {
    label: string;
    action: string;
    severity: AuditSeverity;
    description: string;
    metadata: Record<string, string>;
    status: 'idle' | 'logging' | 'logged' | 'failed';
    lastLogId?: string;
}

export type AuditLogNode = Node<TAuditLogNodeData, 'auditLog'>;

const severityConfig: Record<AuditSeverity, {
    label: string;
    color: string;
    bgColor: string;
}> = {
    info: { label: 'Info', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    warning: { label: 'Warning', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    error: { label: 'Error', color: 'text-red-600', bgColor: 'bg-red-100' },
    critical: { label: 'Critical', color: 'text-red-800', bgColor: 'bg-red-200' },
};

const selectorNode = (state: any) => ({
    updateNodeData: state.updateNodeData,
});

const AuditLogNode = ({
    id,
    data,
    selected,
    isConnectable,
}: NodeProps<AuditLogNode>) => {
    const [showSeverityDropdown, setShowSeverityDropdown] = useState(false);
    const { updateNodeData } = useStoreNode(useShallow(selectorNode));

    // Unique color for audit log
    const auditColor = { from: '#7C3AED', to: '#A78BFA' }; // Violet

    const handleSeverityChange = (severity: AuditSeverity) => {
        updateNodeData?.(id, { severity });
        setShowSeverityDropdown(false);
    };

    const handleActionChange = (action: string) => {
        updateNodeData?.(id, { action });
    };

    const handleDescriptionChange = (description: string) => {
        updateNodeData?.(id, { description });
    };

    const currentSeverity = severityConfig[data.severity || 'info'];

    return (
        <div
            style={{ border: `2px solid ${selected ? auditColor.from : 'white'}` }}
            className={`
        shadow-lg rounded-lg bg-white border-2 
        transition-all duration-300 ease-in-out
        hover:shadow-xl transform hover:-translate-y-1
        min-w-[280px]
      `}
        >
            {/* Header */}
            <div
                className="text-white px-4 py-2 rounded-t-lg flex items-center justify-between"
                style={{
                    background: `linear-gradient(to right, ${auditColor.from}, ${auditColor.to})`,
                }}
            >
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    <span className="font-semibold truncate">
                        {data.label || 'Audit Log'}
                    </span>
                </div>
                <Activity
                    className={`w-4 h-4 transition-all duration-200
            ${data.status === 'logging' ? 'text-yellow-300 scale-125 animate-pulse' : 'text-white scale-100'}`}
                />
            </div>

            {/* Body */}
            <div className="px-4 py-3 bg-gray-50 space-y-3">
                {/* Action Name */}
                <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                        Action Name
                    </label>
                    <input
                        type="text"
                        value={data.action || ''}
                        onChange={(e) => handleActionChange(e.target.value)}
                        placeholder="payment_failed_alert_sent"
                        className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 bg-white text-sm font-mono focus:border-blue-400 focus:outline-none"
                    />
                </div>

                {/* Severity */}
                <div className="relative">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                        Severity
                    </label>
                    <button
                        onClick={() => setShowSeverityDropdown(!showSeverityDropdown)}
                        className={`
              w-full flex items-center justify-between
              px-3 py-2 rounded-lg border-2 border-gray-200
              ${currentSeverity.bgColor}
            `}
                    >
                        <span className={`font-medium ${currentSeverity.color}`}>
                            {currentSeverity.label}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    {showSeverityDropdown && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                            {(Object.keys(severityConfig) as AuditSeverity[]).map((severity) => {
                                const config = severityConfig[severity];
                                return (
                                    <button
                                        key={severity}
                                        onClick={() => handleSeverityChange(severity)}
                                        className={`
                      w-full px-3 py-2 text-left hover:bg-gray-50
                      first:rounded-t-lg last:rounded-b-lg
                      ${config.color}
                    `}
                                    >
                                        {config.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                        Description
                    </label>
                    <textarea
                        value={data.description || ''}
                        onChange={(e) => handleDescriptionChange(e.target.value)}
                        placeholder="Alert sent for payment failure of {{amount}}..."
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 bg-white text-sm focus:border-blue-400 focus:outline-none resize-none"
                    />
                </div>

                {/* Last Log Reference */}
                {data.lastLogId && (
                    <div className="text-xs text-gray-500">
                        Last log: <span className="font-mono">{data.lastLogId}</span>
                    </div>
                )}
            </div>

            {/* Input Handle */}
            <Handle
                type="target"
                isConnectable={isConnectable}
                position={Position.Top}
                style={{
                    top: -6,
                    backgroundColor: auditColor.from
                }}
                className="react-flow__handle-target"
            />

            {/* Output Handle */}
            <Handle
                type="source"
                position={Position.Bottom}
                id="source"
                style={{
                    bottom: -4,
                    backgroundColor: auditColor.to,
                }}
                className="react-flow__handle-source"
                isConnectable={isConnectable}
            />
        </div>
    );
};

export default memo(AuditLogNode);
