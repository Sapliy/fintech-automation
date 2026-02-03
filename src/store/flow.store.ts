import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppNode } from '../nodes/types';
import { Edge } from '@xyflow/react';
import { useStoreNode } from './node.store';

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

    // API Actions (Simulated)
    loadFlows: () => Promise<void>;
    loadTemplates: () => Promise<void>;
    saveCurrentFlow: () => Promise<void>;
    loadFlowConfig: (id: string, isTemplate?: boolean) => Promise<void>;
    createNewFlow: (name: string, templateId?: string) => Promise<void>;
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
                // Simulate API call to fetch flow list
                set({ savedFlows: [] });
            },

            loadTemplates: async () => {
                // Return metadata only for list
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

                await new Promise(resolve => setTimeout(resolve, 800));

                const flowData: FlowMetadata = {
                    id: currentFlowId || `fl_${Date.now()}`,
                    name: currentFlowName,
                    description: 'Saved flow',
                    is_template: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    nodeCount: nodes.length
                };

                const currentSaved = get().savedFlows;
                const exists = currentSaved.find(f => f.id === flowData.id);

                let newSaved = currentSaved;
                if (exists) {
                    newSaved = currentSaved.map(f => f.id === flowData.id ? flowData : f);
                } else {
                    newSaved = [...currentSaved, flowData];
                }

                set({
                    savedFlows: newSaved,
                    currentFlowId: flowData.id,
                    isSaving: false
                });

                console.log('Flow Saved:', { ...flowData, nodes, edges });
            },

            loadFlowConfig: async (id: string, isTemplate = false) => {
                let data: FlowData | undefined;

                if (isTemplate) {
                    data = get().internalTemplates.find(t => t.id === id);
                } else {
                    // In real app, we fetch from API/DB
                    console.log('Would fetch flow', id);
                    return;
                }

                if (data) {
                    const { setNodes, setEdges } = useStoreNode.getState();
                    setNodes(data.nodes);
                    setEdges(data.edges);
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
