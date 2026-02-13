/**
 * Event Service
 *
 * Provides API calls for event emission and real-time streaming.
 */
import apiClient from '@/lib/apiClient';

export interface EventEmitRequest {
    type: string;
    data: Record<string, unknown>;
    idempotency_key?: string;
    meta?: Record<string, string>;
}

export interface EventEmitResponse {
    status: string;
    event_id: string;
    topic: string;
    message?: string;
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/v1/events/stream';

const eventService = {
    /** Emit an event to the gateway */
    async emit(event: EventEmitRequest): Promise<EventEmitResponse> {
        return apiClient.post<EventEmitResponse>('/v1/events/emit', event);
    },

    /**
     * Connect to the real-time event stream via WebSocket.
     * Returns a cleanup function to close the connection.
     */
    connectStream(
        apiKey: string,
        onMessage: (data: unknown) => void,
        onError?: (error: Event) => void,
    ): () => void {
        const url = `${WS_URL}?api_key=${encodeURIComponent(apiKey)}`;
        const ws = new WebSocket(url);

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessage(data);
            } catch {
                onMessage(event.data);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            onError?.(error);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        // Return cleanup function
        return () => {
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close();
            }
        };
    },
    /** Replay an event */
    async replay(eventId: string, zoneId: string): Promise<void> {
        return apiClient.post<void>(`/v1/events/${eventId}/replay`, { zoneId });
    },
};

export default eventService;
