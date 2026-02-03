import { useEffect, useRef, useState, useCallback } from 'react';
import { FintechEvent } from '../types/events';

interface UseEventStreamOptions {
    url: string;
    onEvent?: (event: FintechEvent) => void;
    onError?: (error: Error) => void;
    onConnect?: () => void;
    onDisconnect?: () => void;
    autoReconnect?: boolean;
    reconnectInterval?: number;
}

interface UseEventStreamReturn {
    isConnected: boolean;
    events: FintechEvent[];
    error: Error | null;
    connect: () => void;
    disconnect: () => void;
    clearEvents: () => void;
}

/**
 * Hook for subscribing to fintech event stream via WebSocket
 * Replaces the old MQTT-based sensor connection
 */
const useEventStream = ({
    url,
    onEvent,
    onError,
    onConnect,
    onDisconnect,
    autoReconnect = true,
    reconnectInterval = 5000,
}: UseEventStreamOptions): UseEventStreamReturn => {
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [isConnected, setIsConnected] = useState(false);
    const [events, setEvents] = useState<FintechEvent[]>([]);
    const [error, setError] = useState<Error | null>(null);

    const clearEvents = useCallback(() => {
        setEvents([]);
    }, []);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        setIsConnected(false);
    }, []);

    const connect = useCallback(() => {
        // Clean up existing connection
        if (wsRef.current) {
            wsRef.current.close();
        }

        try {
            const ws = new WebSocket(url);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('[EventStream] Connected to event stream');
                setIsConnected(true);
                setError(null);
                onConnect?.();
            };

            ws.onmessage = (message) => {
                try {
                    const event = JSON.parse(message.data) as FintechEvent;
                    console.log('[EventStream] Received event:', event.type);

                    setEvents((prev) => [event, ...prev].slice(0, 100)); // Keep last 100 events
                    onEvent?.(event);
                } catch (err) {
                    console.error('[EventStream] Failed to parse event:', err);
                }
            };

            ws.onerror = (err) => {
                console.error('[EventStream] WebSocket error:', err);
                const error = new Error('WebSocket connection error');
                setError(error);
                onError?.(error);
            };

            ws.onclose = () => {
                console.log('[EventStream] Disconnected from event stream');
                setIsConnected(false);
                onDisconnect?.();

                // Auto-reconnect logic
                if (autoReconnect) {
                    console.log(`[EventStream] Reconnecting in ${reconnectInterval}ms...`);
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, reconnectInterval);
                }
            };
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to connect');
            setError(error);
            onError?.(error);
        }
    }, [url, onEvent, onError, onConnect, onDisconnect, autoReconnect, reconnectInterval]);

    // Connect on mount
    useEffect(() => {
        connect();

        return () => {
            disconnect();
        };
    }, []);

    return {
        isConnected,
        events,
        error,
        connect,
        disconnect,
        clearEvents,
    };
};

export default useEventStream;
