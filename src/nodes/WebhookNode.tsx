import { Handle, type NodeProps, Position } from '@xyflow/react';
import { memo, useState } from 'react';
import {
    Globe,
    ChevronDown,
    Activity,
    Code
} from 'lucide-react';
import { useShallow } from 'zustand/shallow';
import { useStoreNode } from '../store';
import type { Node } from '@xyflow/react';

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Node data type
export interface TWebhookNodeData extends Record<string, unknown> {
    label: string;
    url: string;
    method: HttpMethod;
    headers: Record<string, string>;
    body: string;
    status: 'idle' | 'pending' | 'success' | 'error';
    lastResponse?: {
        statusCode: number;
        body: string;
        timestamp: string;
    };
}

export type WebhookNode = Node<TWebhookNodeData, 'webhook'>;

const methodColors: Record<HttpMethod, string> = {
    GET: 'bg-green-100 text-green-700 border-green-300',
    POST: 'bg-blue-100 text-blue-700 border-blue-300',
    PUT: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    PATCH: 'bg-orange-100 text-orange-700 border-orange-300',
    DELETE: 'bg-red-100 text-red-700 border-red-300',
};

const selectorNode = (state: any) => ({
    updateNodeData: state.updateNodeData,
});

const WebhookNode = ({
    id,
    data,
    selected,
    isConnectable,
}: NodeProps<WebhookNode>) => {
    const [showMethodDropdown, setShowMethodDropdown] = useState(false);
    const [showBodyEditor, setShowBodyEditor] = useState(false);
    const { updateNodeData } = useStoreNode(useShallow(selectorNode));

    // Use a unique color for webhook
    const webhookColor = { from: '#059669', to: '#10B981' }; // Emerald green

    const handleMethodChange = (method: HttpMethod) => {
        updateNodeData?.(id, { method });
        setShowMethodDropdown(false);
    };

    const handleUrlChange = (url: string) => {
        updateNodeData?.(id, { url });
    };

    const handleBodyChange = (body: string) => {
        updateNodeData?.(id, { body });
    };

    const statusColors = {
        idle: 'bg-gray-100 text-gray-600',
        pending: 'bg-yellow-100 text-yellow-700',
        success: 'bg-green-100 text-green-700',
        error: 'bg-red-100 text-red-700',
    };

    return (
        <div
            style={{ border: `2px solid ${selected ? webhookColor.from : 'white'}` }}
            className={`
        shadow-lg rounded-lg bg-white border-2 
        transition-all duration-300 ease-in-out
        hover:shadow-xl transform hover:-translate-y-1
        min-w-[300px]
      `}
        >
            {/* Header */}
            <div
                className="text-white px-4 py-2 rounded-t-lg flex items-center justify-between"
                style={{
                    background: `linear-gradient(to right, ${webhookColor.from}, ${webhookColor.to})`,
                }}
            >
                <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    <span className="font-semibold truncate">
                        {data.label || 'Webhook'}
                    </span>
                </div>
                <Activity
                    className={`w-4 h-4 transition-all duration-200
            ${data.status === 'pending' ? 'text-yellow-300 scale-125 animate-pulse' : 'text-white scale-100'}`}
                />
            </div>

            {/* Body */}
            <div className="px-4 py-3 bg-gray-50 space-y-3">
                {/* Method + URL */}
                <div className="flex gap-2">
                    {/* Method Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMethodDropdown(!showMethodDropdown)}
                            className={`
                px-3 py-2 rounded-lg border-2 font-mono text-sm font-bold
                ${methodColors[data.method || 'POST']}
              `}
                        >
                            {data.method || 'POST'}
                            <ChevronDown className="w-3 h-3 inline ml-1" />
                        </button>

                        {showMethodDropdown && (
                            <div className="absolute z-20 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                                {(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as HttpMethod[]).map((method) => (
                                    <button
                                        key={method}
                                        onClick={() => handleMethodChange(method)}
                                        className={`
                      w-full px-3 py-2 text-left font-mono text-sm font-bold
                      hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg
                      ${methodColors[method]}
                    `}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* URL Input */}
                    <input
                        type="text"
                        value={data.url || ''}
                        onChange={(e) => handleUrlChange(e.target.value)}
                        placeholder="https://api.example.com/webhook"
                        className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 bg-white text-sm font-mono focus:border-blue-400 focus:outline-none"
                    />
                </div>

                {/* Body Editor Toggle */}
                {data.method !== 'GET' && (
                    <div>
                        <button
                            onClick={() => setShowBodyEditor(!showBodyEditor)}
                            className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700"
                        >
                            <Code className="w-3 h-3" />
                            {showBodyEditor ? 'Hide' : 'Edit'} Request Body
                        </button>

                        {showBodyEditor && (
                            <textarea
                                value={data.body || ''}
                                onChange={(e) => handleBodyChange(e.target.value)}
                                placeholder='{"event": "{{event.type}}", "data": {{event.payload}}}'
                                rows={3}
                                className="w-full mt-2 px-3 py-2 rounded-lg border-2 border-gray-200 bg-white text-sm font-mono focus:border-blue-400 focus:outline-none resize-none"
                            />
                        )}
                    </div>
                )}

                {/* Status + Last Response */}
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[data.status || 'idle']}`}>
                        {data.status || 'idle'}
                        {data.lastResponse && ` (${data.lastResponse.statusCode})`}
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
                    backgroundColor: webhookColor.from
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
                    backgroundColor: webhookColor.to,
                }}
                className="react-flow__handle-source"
                isConnectable={isConnectable}
            />
        </div>
    );
};

export default memo(WebhookNode);
