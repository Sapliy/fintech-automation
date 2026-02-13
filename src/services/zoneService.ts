/**
 * Zone Service
 *
 * Provides API calls for zone management.
 * Zones are isolated automation spaces with test/live modes.
 */
import apiClient from '@/lib/apiClient';
import type { Zone } from '@/store/auth.store';

export interface CreateZoneRequest {
    name: string;
    org_id: string;
    mode: 'test' | 'live';
}

const zoneService = {
    /** List zones for an organization */
    async list(orgId: string): Promise<Zone[]> {
        return apiClient.get<Zone[]>(`/auth/zones?org_id=${orgId}`);
    },

    /** Create a new zone */
    async create(data: CreateZoneRequest): Promise<Zone> {
        return apiClient.post<Zone>('/auth/zones', data);
    },

    /** Get a single zone by ID */
    async get(id: string): Promise<Zone> {
        return apiClient.get<Zone>(`/auth/zones/${id}`);
    },
};

export default zoneService;
