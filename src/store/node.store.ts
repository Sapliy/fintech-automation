import { create } from "zustand";
import { addEdge, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";

import { type AppStateNode } from "./type";

// this is our useStoreNode hook that we can use in our components to get parts of the store and call actions
const useStoreNode = create<AppStateNode>((set, get) => ({
  contextMenu: null,
  nodeDetails: null,
  nodes: [],
  edges: [],
  setContextMenu: (contextMenu) => {
    set({ contextMenu });
  },
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge(
        { ...connection, type: "custom", animated: true },
        get().edges
      ),
    });

    // Get source node data
    const sourceNode = get().nodes.find(
      (node) => node.id === connection.source
    );

    if (sourceNode && sourceNode.type === "sensor") {
      // Update target node's data
      set({
        nodes: get().nodes.map((node) =>
          node.id === connection.target
            ? {
              ...node,
              data: {
                ...node.data,
                sourcesourceNode: sourceNode.data, // This is the data from the source node
              },
            }
            : node
        ),
      });
    }
  },
  setNodes: (nodes) => {
    set({ nodes });
  },
  setEdges: (edges) => {
    set(() => ({ edges }));
  },
  removeEdge: (edgeId: string) => {
    const edge = get().edges.find((edge) => edge.id === edgeId);
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== edgeId),
      nodes: state.nodes.map((node) => {
        if (node.id === edge?.target) {
          return {
            ...node,
            data: {
              ...node.data,
              value: null,
            },
          };
        }
        return node;
      }),
    }));
  },
  onNodeContextMenu: (event, node, ref) => {
    event.preventDefault();
    const pane = ref.current
      ? (ref.current as HTMLElement).getBoundingClientRect()
      : { width: 0, height: 0 };

    get().setContextMenu({
      id: node.id,
      top: event.clientY < pane.height - 200 ? event.clientY : false,
      left: event.clientX < pane.width - 200 ? event.clientX : false,
      right:
        event.clientX >= pane.width - 200 ? pane.width - event.clientX : false,
      bottom:
        event.clientY >= pane.height - 200
          ? pane.height - event.clientY
          : false,
    });
  },
  deleteNode: (nodeId) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
    }));
    set({ contextMenu: null });
  },
  duplicateNode: (nodeId) => {
    set((state) => {
      const node = state.nodes.find((node) => node.id === nodeId);
      if (!node) return state;
      const newNode = {
        ...node,
        id: `${node.id}-copy`,
        position: {
          x: node.position.x + 100,
          y: node.position.y + 100,
        },
        value: "idle",
        data:
          node.type === "actuator"
            ? { ...node.data, status: "idle" }
            : node.type === "condition"
              ? {
                ...node.data,
                if: [
                  {
                    [(node?.data?.operator ?? "==") as string]: [
                      {
                        var: "payload",
                      },
                      "idle",
                    ],
                  },
                ],
                value: null,
              }
              : node.type === "sensor"
                ? { ...node.data, value: "idle" }
                : { ...node.data },
      };
      return {
        nodes: [...state.nodes, newNode],
      };
    });
    set({ contextMenu: null });
  },
  onDrop: (event, ref) => {
    event.preventDefault();
    const reactFlowBounds = ref.current?.getBoundingClientRect();
    const type = event.dataTransfer.getData("application/fintech-automation");
    const nodeType = type;

    if (!nodeType) return;

    const position = {
      x: reactFlowBounds ? event.clientX - reactFlowBounds.left : 0,
      y: reactFlowBounds ? event.clientY - reactFlowBounds.top : 0,
    };

    // Default data for all node types
    const nodeDefaultData: Record<string, Record<string, unknown>> = {
      // Triggers
      eventTrigger: {
        label: 'Event Trigger',
        source: 'stripe',
        eventType: null,
        isActive: false,
      },
      dateTime: {
        label: 'Schedule',
        time: '09:00',
        date: '',
        isActive: false,
        repeat: false,
        activeDays: [],
      },
      // Logic
      condition: {
        label: 'Condition',
        if: [{ '==': [{ var: 'payload' }, ''] }],
        operator: '==',
      },
      filter: {
        label: 'Filter',
        operator: '==',
        filterValue: 0,
        valueType: 'number',
      },
      timeout: {
        label: 'Delay',
        duration: 5000,
        isActive: false,
        remainingTime: 0,
      },
      approval: {
        label: 'Approval Required',
        approverRole: 'admin',
        timeoutHours: 24,
        message: '',
        status: 'idle',
      },
      rateLimit: {
        label: 'Rate Limit',
        limit: 10,
        timeUnit: 'minute',
        burstAllowance: 0,
        currentCount: 0,
        status: 'idle',
      },
      // Actions
      notification: {
        label: 'Notification',
        channel: 'email',
        template: '',
        recipient: '',
        status: 'idle',
      },
      webhook: {
        label: 'Webhook',
        url: '',
        method: 'POST',
        headers: {},
        body: '',
        status: 'idle',
      },
      auditLog: {
        label: 'Audit Log',
        action: '',
        severity: 'info',
        description: '',
        metadata: {},
        status: 'idle',
      },
      // Utilities
      debugger: {
        label: 'Debugger',
        logs: [],
        isActive: true,
        logLevel: 'info',
        autoScroll: true,
      },
      'ai-analysis': {
        label: 'AI Analysis',
        instruction: '',
        result: '',
        isProcessing: false,
      },
    };

    const newNode = {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      position,
      data: nodeDefaultData[nodeType] || { label: `${nodeType} Node` },
    };

    set({ nodes: [...get().nodes, newNode] });
  },
  clearAutomation: () => {
    set({ nodes: [], edges: [] });
  },
  onMoreDetails: (nodeId) => {
    // Handle more details action here
    set((state) => ({
      nodeDetails: state.nodes.find((n) => n.id === nodeId),
      contextMenu: null,
    }));
  },
  closeMoreDetails: () => {
    set({ nodeDetails: null });
  },
  updateNodeData: (id, data) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? {
            ...node,
            data: {
              ...node.data,
              ...data,
            },
          }
          : node
      ),
    }));
  },
  getSourceNodes: (nodeId) => {
    const edges = Array.isArray(get().edges) ? get().edges : [];

    if (!edges || !nodeId) return [];
    const sourceNodes = edges
      .filter((e) => e.target === nodeId)
      .map((e) => get().nodes.find((n) => n.id === e.source))
      .filter(Boolean);
    return sourceNodes;
  },
  getTargetNodes: (nodeId: string) => {
    const { nodes, edges } = get();

    const connectedEdges = edges.filter((edge) => edge.source === nodeId);

    const targetNodes = connectedEdges
      .map((edge) => nodes.find((node) => node.id === edge.target))
      .filter(Boolean);

    return targetNodes;
  },
}));

export { useStoreNode, type AppStateNode };
