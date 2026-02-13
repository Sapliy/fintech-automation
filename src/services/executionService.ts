/**
 * Execution Service
 *
 * Provides API calls for flow execution tracking.
 * All calls go through the gateway with auth tokens.
 */
import apiClient from '@/lib/apiClient';

export interface FlowExecution {
    id: string;
    flow_id: string;
    zone_id: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    trigger_event_id?: string;
    started_at: string;
    completed_at?: string;
    error?: string;
    result?: Record<string, unknown>;
}

const executionService = {
    /** List executions for a flow */
    async list(flowId: string): Promise<FlowExecution[]> {
        return apiClient.get<FlowExecution[]>(`/v1/executions?flow_id=${flowId}`);
    },

    /** Get a single execution by ID */
    async get(id: string): Promise<FlowExecution> {
        return apiClient.get<FlowExecution>(`/v1/executions/${id}`);
    },

    /** List all executions in the current zone */
    async listByZone(zoneId: string): Promise<FlowExecution[]> {
        return apiClient.get<FlowExecution[]>(`/v1/executions?zone_id=${zoneId}`);
    },
};

export default executionService;
