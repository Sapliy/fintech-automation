import { Handle, type NodeProps, Position } from '@xyflow/react';
import { memo, useState } from 'react';
import {
    Send,
    Mail,
    MessageSquare,
    Activity,
    ChevronDown
} from 'lucide-react';
import { useShallow } from 'zustand/shallow';
import { useStoreNode } from '../store';
import { nodeColors } from '../utils/edgeStyles';
import {
    NotificationChannel,
    NotificationNode as TNotificationNode
} from './types';

const channelConfig: Record<NotificationChannel, {
    label: string;
    icon: typeof Mail;
    color: string;
    placeholder: string;
}> = {
    whatsapp: {
        label: 'WhatsApp',
        icon: MessageSquare,
        color: '#25D366',
        placeholder: '+1234567890'
    },
    email: {
        label: 'Email',
        icon: Mail,
        color: '#EA4335',
        placeholder: 'user@example.com'
    },
    slack: {
        label: 'Slack',
        icon: MessageSquare,
        color: '#4A154B',
        placeholder: '#channel or @user'
    },
    discord: {
        label: 'Discord',
        icon: MessageSquare,
        color: '#5865F2',
        placeholder: 'Webhook URL'
    },
    sms: {
        label: 'SMS',
        icon: MessageSquare,
        color: '#0088CC',
        placeholder: '+1234567890'
    },
};

const selectorNode = (state: any) => ({
    updateNodeData: state.updateNodeData,
});

const NotificationNodeComp = ({
    id,
    data,
    selected,
    isConnectable,
}: NodeProps<TNotificationNode>) => {
    const [showChannelDropdown, setShowChannelDropdown] = useState(false);
    const { updateNodeData } = useStoreNode(useShallow(selectorNode));

    const actionColor = nodeColors.notification;
    const currentChannel = channelConfig[data.channel] || channelConfig.email;
    const ChannelIcon = currentChannel.icon;

    const handleChannelChange = (channel: NotificationChannel) => {
        updateNodeData?.(id, { channel, recipient: '' });
        setShowChannelDropdown(false);
    };

    const handleRecipientChange = (recipient: string) => {
        updateNodeData?.(id, { recipient });
    };

    const handleTemplateChange = (template: string) => {
        updateNodeData?.(id, { template });
    };

    const statusColors: Record<string, string> = {
        idle: 'bg-gray-100 text-gray-600',
        sending: 'bg-yellow-100 text-yellow-700',
        sent: 'bg-green-100 text-green-700',
        failed: 'bg-red-100 text-red-700',
    };

    return (
        <div
            style={{ border: `2px solid ${selected ? actionColor?.from : 'white'}` }}
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
                    background: `linear-gradient(to right, ${actionColor?.from}, ${actionColor?.to})`,
                }}
            >
                <div className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    <span className="font-semibold truncate">
                        {data.label || 'Notification'}
                    </span>
                </div>
                <Activity
                    className={`w-4 h-4 transition-all duration-200
            ${data.status === 'sending' ? 'text-yellow-300 scale-125 animate-pulse' : 'text-white scale-100'}`}
                />
            </div>

            {/* Body */}
            <div className="px-4 py-3 bg-gray-50 space-y-3">
                {/* Channel Selector */}
                <div className="relative">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                        Channel
                    </label>
                    <button
                        onClick={() => setShowChannelDropdown(!showChannelDropdown)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg border-2 border-gray-200 bg-white hover:border-gray-300 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <ChannelIcon
                                className="w-4 h-4"
                                style={{ color: currentChannel.color }}
                            />
                            <span className="font-medium text-gray-700">
                                {currentChannel.label}
                            </span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    {showChannelDropdown && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                            {(Object.keys(channelConfig) as NotificationChannel[]).map((channel) => {
                                const config = channelConfig[channel];
                                const Icon = config.icon;
                                return (
                                    <button
                                        key={channel}
                                        onClick={() => handleChannelChange(channel)}
                                        className={`
                      w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-gray-50
                      first:rounded-t-lg last:rounded-b-lg
                      ${data.channel === channel ? 'bg-blue-50' : ''}
                    `}
                                    >
                                        <Icon className="w-4 h-4" style={{ color: config.color }} />
                                        <span className="text-gray-700">{config.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Recipient */}
                <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                        Recipient
                    </label>
                    <input
                        type="text"
                        value={data.recipient || ''}
                        onChange={(e) => handleRecipientChange(e.target.value)}
                        placeholder={currentChannel.placeholder}
                        className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 bg-white text-sm focus:border-blue-400 focus:outline-none"
                    />
                </div>

                {/* Message Template */}
                <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                        Message Template
                    </label>
                    <textarea
                        value={data.template || ''}
                        onChange={(e) => handleTemplateChange(e.target.value)}
                        placeholder="Payment of {{amount}} failed for {{customer}}..."
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 bg-white text-sm focus:border-blue-400 focus:outline-none resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Use {'{{field}}'} for dynamic values
                    </p>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[(data.status as string) || 'idle']}`}>
                        {data.status || 'idle'}
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
                    backgroundColor: actionColor?.from
                }}
                className="react-flow__handle-target"
            />

            {/* Output Handle (for chaining) */}
            <Handle
                type="source"
                position={Position.Bottom}
                id="source"
                style={{
                    bottom: -4,
                    backgroundColor: actionColor?.to,
                }}
                className="react-flow__handle-source"
                isConnectable={isConnectable}
            />
        </div>
    );
};

export default memo(NotificationNodeComp);
