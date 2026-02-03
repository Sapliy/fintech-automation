import { Handle, type NodeProps, Position } from '@xyflow/react';
import { memo, useState } from 'react';
import {
    UserCheck,
    ChevronDown,
    Clock,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { useShallow } from 'zustand/shallow';
import { useStoreNode } from '../store';
import { nodeColors } from '../utils/edgeStyles';
import type { Node } from '@xyflow/react';

// Approver roles that can approve
export type ApproverRole = 'admin' | 'finance' | 'manager' | 'any';

// Node data type
export interface TApprovalNodeData {
    label: string;
    approverRole: ApproverRole;
    timeoutHours: number;
    message: string;
    status: 'pending' | 'approved' | 'rejected' | 'timeout' | 'idle';
    approvedBy?: string;
    approvedAt?: string;
}

export type ApprovalNode = Node<TApprovalNodeData, 'approval'>;

const roleConfig: Record<ApproverRole, { label: string; description: string }> = {
    admin: { label: 'Admin', description: 'Organization admin' },
    finance: { label: 'Finance', description: 'Finance team member' },
    manager: { label: 'Manager', description: 'Team manager' },
    any: { label: 'Any User', description: 'Any authenticated user' },
};

const selectorNode = (state: any) => ({
    updateNodeData: state.updateNodeData,
});

const ApprovalNode = ({
    id,
    data,
    selected,
    isConnectable,
}: NodeProps<ApprovalNode>) => {
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);
    const { updateNodeData } = useStoreNode(useShallow(selectorNode));

    // Unique color for approval node
    const approvalColor = { from: '#D97706', to: '#FBBF24' }; // Amber

    const handleRoleChange = (role: ApproverRole) => {
        updateNodeData?.(id, { approverRole: role });
        setShowRoleDropdown(false);
    };

    const handleTimeoutChange = (hours: number) => {
        updateNodeData?.(id, { timeoutHours: hours });
    };

    const handleMessageChange = (message: string) => {
        updateNodeData?.(id, { message });
    };

    const statusConfig = {
        idle: { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-100' },
        pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
        approved: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
        rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
        timeout: { icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
    };

    const currentStatus = statusConfig[data.status || 'idle'];
    const StatusIcon = currentStatus.icon;

    return (
        <div
            style={{ border: `2px solid ${selected ? approvalColor.from : 'white'}` }}
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
                    background: `linear-gradient(to right, ${approvalColor.from}, ${approvalColor.to})`,
                }}
            >
                <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    <span className="font-semibold truncate">
                        {data.label || 'Approval Required'}
                    </span>
                </div>
                <StatusIcon className={`w-4 h-4 ${data.status === 'pending' ? 'animate-pulse' : ''}`} />
            </div>

            {/* Body */}
            <div className="px-4 py-3 bg-gray-50 space-y-3">
                {/* Approver Role */}
                <div className="relative">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                        Approver Role
                    </label>
                    <button
                        onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg border-2 border-gray-200 bg-white hover:border-gray-300 transition-colors"
                    >
                        <span className="font-medium text-gray-700">
                            {roleConfig[data.approverRole || 'admin'].label}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    {showRoleDropdown && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                            {(Object.keys(roleConfig) as ApproverRole[]).map((role) => {
                                const config = roleConfig[role];
                                return (
                                    <button
                                        key={role}
                                        onClick={() => handleRoleChange(role)}
                                        className={`
                      w-full px-3 py-2 text-left hover:bg-gray-50
                      first:rounded-t-lg last:rounded-b-lg
                    `}
                                    >
                                        <div className="font-medium text-gray-700">{config.label}</div>
                                        <div className="text-xs text-gray-500">{config.description}</div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Timeout */}
                <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                        Timeout (hours)
                    </label>
                    <input
                        type="number"
                        min={1}
                        max={168}
                        value={data.timeoutHours || 24}
                        onChange={(e) => handleTimeoutChange(parseInt(e.target.value) || 24)}
                        className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 bg-white text-sm focus:border-blue-400 focus:outline-none"
                    />
                </div>

                {/* Message */}
                <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                        Approval Message
                    </label>
                    <textarea
                        value={data.message || ''}
                        onChange={(e) => handleMessageChange(e.target.value)}
                        placeholder="Please approve payment of {{amount}} for {{customer}}..."
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 bg-white text-sm focus:border-blue-400 focus:outline-none resize-none"
                    />
                </div>

                {/* Status */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${currentStatus.bg}`}>
                    <StatusIcon className={`w-4 h-4 ${currentStatus.color}`} />
                    <span className={`text-sm font-medium ${currentStatus.color}`}>
                        {data.status === 'idle' ? 'Waiting for trigger' :
                            data.status === 'pending' ? 'Awaiting approval' :
                                data.status === 'approved' ? `Approved${data.approvedBy ? ` by ${data.approvedBy}` : ''}` :
                                    data.status === 'rejected' ? 'Rejected' :
                                        'Timed out'}
                    </span>
                </div>
            </div>

            {/* Input Handle */}
            <Handle
                type="target"
                isConnectable={isConnectable}
                position={Position.Top}
                style={{
                    top: -6,
                    backgroundColor: approvalColor.from
                }}
                className="react-flow__handle-target"
            />

            {/* Approved Path (True) */}
            <div className="px-4 py-2 bg-white rounded-b-lg border-t border-gray-100">
                <div className="flex justify-center gap-8">
                    <div className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        <span>Approved</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-red-600">
                        <XCircle className="w-3 h-3" />
                        <span>Rejected/Timeout</span>
                    </div>
                </div>
            </div>

            {/* Approved Output Handle */}
            <Handle
                type="source"
                position={Position.Bottom}
                id="approved"
                style={{
                    left: '30%',
                    bottom: -4,
                    backgroundColor: '#10B981', // Green
                }}
                className="react-flow__handle-source"
                isConnectable={isConnectable}
            />

            {/* Rejected/Timeout Output Handle */}
            <Handle
                type="source"
                position={Position.Bottom}
                id="rejected"
                style={{
                    left: '70%',
                    bottom: -4,
                    backgroundColor: '#EF4444', // Red
                }}
                className="react-flow__handle-source"
                isConnectable={isConnectable}
            />
        </div>
    );
};

export default memo(ApprovalNode);
