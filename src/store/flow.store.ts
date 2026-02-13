import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppNode } from '../nodes/types';
import { Edge } from '@xyflow/react';
import { useStoreNode } from './node.store';
import { useAuthStore } from './auth.store';
import apiClient from '@/lib/apiClient';

// Flow Metadata (Lightweight)
export interface FlowMetadata {
    id: string;
    name: string;
    description: string;
    is_template: boolean;
    created_at: string;
    updated_at: string;
    thumbnail_url?: string;
    tags?: string[];
    nodeCount?: number; // Optional count for UI
}

// Full Flow Data
export interface FlowData extends FlowMetadata {
    nodes: AppNode[];
    edges: Edge[];
}

// Flow Store State
interface FlowState {
    // Current Flow Metadata
    currentFlowId: string | null;
    currentFlowName: string;
    isSaving: boolean;

    // Lists
    savedFlows: FlowMetadata[];
    templates: FlowMetadata[];
    internalTemplates: FlowData[]; // Keep full data loaded for mocks

    // Actions
    setCurrentFlow: (id: string | null, name?: string) => void;

    // API Actions
    loadFlows: () => Promise<void>;
    loadTemplates: () => Promise<void>;
    saveCurrentFlow: () => Promise<void>;
    loadFlowConfig: (id: string, isTemplate?: boolean) => Promise<void>;
    createNewFlow: (name: string, templateId?: string) => Promise<void>;
    deleteFlow: (id: string) => Promise<void>;
}

// Mock Templates Data
const MOCK_TEMPLATES: FlowData[] = [
    {
        id: 'tmpl_kyc',
        name: 'KYC & AML Checks',
        description: 'Automated KYC verification with risk scoring and manual approval for high-risk users.',
        is_template: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: ['Compliance', 'Onboarding'],
        nodes: [
            {
                id: '1',
                type: 'eventTrigger',
                position: { x: 100, y: 100 },
                data: { source: 'system', type: 'user.signup', payloadSchema: {} }
            },
            {
                id: '2',
                type: 'filter',
                position: { x: 400, y: 100 },
                data: { operator: '>', filterValue: 80, property: 'risk_score' }
            },
            {
                id: '3',
                type: 'approval',
                position: { x: 700, y: 50 },
                data: { approverRole: 'compliance', timeoutMinutes: 60 }
            }
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' }
        ]
    },
    {
        id: 'tmpl_fraud',
        name: 'High-Value Transaction Alert',
        description: 'Monitor transactions > $10k and send alerts to Slack and audit logs.',
        is_template: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: ['Fraud', 'Monitoring'],
        nodes: [
            {
                id: '1',
                type: 'eventTrigger',
                position: { x: 100, y: 100 },
                data: { source: 'stripe', type: 'payment.succeeded' }
            },
            {
                id: '2',
                type: 'filter',
                position: { x: 400, y: 100 },
                data: { operator: '>', filterValue: 10000 }
            },
            {
                id: '3',
                type: 'notification',
                position: { x: 700, y: 100 },
                data: { channel: 'slack', message: 'High value txn detected!' }
            }
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' }
        ]
    }
] as unknown as FlowData[]; // Casting to avoid complex type matching for now

const useFlowStore = create<FlowState>()(
    persist(
        (set, get) => ({
            currentFlowId: null,
            currentFlowName: 'Untitled Flow',
            isSaving: false,
            savedFlows: [],
            templates: [],
            internalTemplates: MOCK_TEMPLATES,

            setCurrentFlow: (id, name) => set({
                currentFlowId: id,
                currentFlowName: name || get().currentFlowName
            }),

            loadFlows: async () => {
                const { zone } = useAuthStore.getState();
                if (!zone) return;

                try {
                    const data = await apiClient.get<FlowMetadata[]>(`/v1/flows?zone_id=${zone.id}`);
                    set({ savedFlows: data || [] });
                } catch (error) {
                    console.error('Failed to load flows:', error);
                }
            },

            loadTemplates: async () => {
                // Keep templates mock for now as they are predefined UI presets
                const templateMeta = MOCK_TEMPLATES.map(t => ({
                    id: t.id,
                    name: t.name,
                    description: t.description,
                    is_template: t.is_template,
                    created_at: t.created_at,
                    updated_at: t.updated_at,
                    tags: t.tags,
                    nodeCount: t.nodes.length
                }));
                set({ templates: templateMeta });
            },

            saveCurrentFlow: async () => {
                set({ isSaving: true });
                const { nodes, edges } = useStoreNode.getState();
                const { currentFlowId, currentFlowName } = get();
                const { organization, zone } = useAuthStore.getState();

                if (!zone || !organization) {
                    console.error('Missing zone or organization');
                    set({ isSaving: false });
                    throw new Error('Missing zone or organization');
                }

                const flowData = {
                    id: currentFlowId || undefined,
                    name: currentFlowName,
                    org_id: organization.id,
                    zone_id: zone.id,
                    nodes: nodes,
                    edges: edges,
                    enabled: true
                };

                try {
                    let savedFlow: FlowData;
                    if (currentFlowId) {
                        savedFlow = await apiClient.put<FlowData>(`/v1/flows/${currentFlowId}`, flowData);
                    } else {
                        savedFlow = await apiClient.post<FlowData>('/v1/flows', flowData);
                    }

                    set({
                        currentFlowId: savedFlow.id || currentFlowId,
                        isSaving: false
                    });
                    await get().loadFlows();
                } catch (error) {
                    console.error('Failed to save flow:', error);
                    set({ isSaving: false });
                    throw error;
                }
            },

            loadFlowConfig: async (id: string, isTemplate = false) => {
                let data: FlowData | undefined;

                if (isTemplate) {
                    data = get().internalTemplates.find(t => t.id === id);
                } else {
                    try {
                        data = await apiClient.get<FlowData>(`/v1/flows/${id}`);
                    } catch (error) {
                        console.error('Failed to load flow config:', error);
                    }
                }

                if (data) {
                    const { setNodes, setEdges } = useStoreNode.getState();
                    setNodes(data.nodes || []);
                    setEdges(data.edges || []);
                    set({
                        currentFlowId: isTemplate ? null : data.id,
                        currentFlowName: isTemplate ? `Copy of ${data.name}` : data.name
                    });
                }
            },

            createNewFlow: async (name: string, templateId?: string) => {
                const { setNodes, setEdges } = useStoreNode.getState();

                if (templateId) {
                    await get().loadFlowConfig(templateId, true);
                    set({ currentFlowName: name || `Copy of Template` });
                } else {
                    setNodes([]);
                    setEdges([]);
                    set({
                        currentFlowId: null,
                        currentFlowName: name
                    });
                }
            },

            deleteFlow: async (id: string) => {
                try {
                    await apiClient.del(`/v1/flows/${id}`);
                    set(state => ({
                        savedFlows: state.savedFlows.filter(f => f.id !== id),
                        currentFlowId: state.currentFlowId === id ? null : state.currentFlowId,
                    }));
                } catch (error) {
                    console.error('Failed to delete flow:', error);
                    throw error;
                }
            }
        }),
        {
            name: 'fintech-flow-storage',
            partialize: (state) => ({
                savedFlows: state.savedFlows,
            })
        }
    )
);

export { useFlowStore };
