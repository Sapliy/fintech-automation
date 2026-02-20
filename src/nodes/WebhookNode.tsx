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
        idle: 'bg-muted text-muted-foreground border-border',
        pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        error: 'bg-destructive/10 text-destructive border-destructive/20',
    };

    return (
        <div
            style={{ border: `2px solid ${selected ? webhookColor.from : 'transparent'}` }}
            className={`
        shadow-lg rounded-xl bg-card border border-border/60
        transition-all duration-300 ease-in-out
        hover:shadow-primary/20 hover:border-primary/40 transform hover:-translate-y-1
        min-w-[300px] overflow-hidden
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
            <div className="px-4 py-4 bg-secondary/30 space-y-4">
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
                            <div className="absolute z-20 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                                {(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as HttpMethod[]).map((method) => (
                                    <button
                                        key={method}
                                        onClick={() => handleMethodChange(method)}
                                        className={`
                      w-full px-3 py-2 text-left font-mono text-sm font-bold
                      hover:bg-secondary/50 first:rounded-t-lg last:rounded-b-lg border-b border-border/40 last:border-0
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
                        className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                </div>

                {/* Body Editor Toggle */}
                {data.method !== 'GET' && (
                    <div>
                        <button
                            onClick={() => setShowBodyEditor(!showBodyEditor)}
                            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
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
                                className="w-full mt-2 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-mono focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                            />
                        )}
                    </div>
                )}

                {/* Status + Last Response */}
                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</span>
                    <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide border ${statusColors[data.status || 'idle']}`}>
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
