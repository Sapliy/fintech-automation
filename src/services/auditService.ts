import apiClient from '@/lib/apiClient';

export interface AuditLog {
    id: string;
    action: string;
    user: string;
    details: string;
    timestamp: string;
    status: 'success' | 'warning' | 'error';
}

export interface GetAuditLogsParams {
    limit?: number;
    offset?: number;
    user_id?: string;
    action?: string;
}

const auditService = {
    /** Get audit logs */
    async getAuditLogs(params: GetAuditLogsParams = {}): Promise<AuditLog[]> {
        const query = new URLSearchParams();
        if (params.limit) query.append('limit', params.limit.toString());
        if (params.offset) query.append('offset', params.offset.toString());
        if (params.user_id) query.append('user_id', params.user_id);
        if (params.action) query.append('action', params.action);

        // Note: Backend endpoint might vary, assuming /auth/audit-logs or similar. 
        // If not implemented on backend, this will fail (and show toast).
        // For now, let's assume it exists on the auth service or gateway.
        return apiClient.get<AuditLog[]>(`/auth/audit-logs?${query.toString()}`);
    },
};

export default auditService;
