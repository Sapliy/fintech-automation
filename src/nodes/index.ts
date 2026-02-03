// Node type exports and registry for the Fintech Automation Studio
import type { NodeTypes } from '@xyflow/react';

// Import existing nodes (Logic/Utilities)
import ConditionNode from './ConditionNode';
import FilterNode from './FilterNode';
import DateTimeNode from './DateTimeNode';
import DebuggerNode from './DebuggerNode';
import TimeoutNode from './TimeoutNode';
import AIAnalysisNode from './AIAnalysisNode';

// Import new fintech nodes
import EventTriggerNode from './EventTriggerNode';
import NotificationNode from './NotificationNode';
import WebhookNode from './WebhookNode';
import AuditLogNode from './AuditLogNode';
import ApprovalNode from './ApprovalNode';
import RateLimitNode from './RateLimitNode';

/**
 * Node Types Registry
 * 
 * Organized by category:
 * - Triggers: Event sources that start automation flows
 * - Logic: Decision making and flow control
 * - Actions: Output operations (notifications, webhooks, etc.)
 * - Utilities: Debugging and analysis tools
 */
export const nodeTypes = {
  // ===== TRIGGERS =====
  'eventTrigger': EventTriggerNode,
  'dateTime': DateTimeNode,

  // ===== LOGIC =====
  'condition': ConditionNode,
  'filter': FilterNode,
  'timeout': TimeoutNode,
  'approval': ApprovalNode,
  'rateLimit': RateLimitNode,

  // ===== ACTIONS =====
  'notification': NotificationNode,
  'webhook': WebhookNode,
  'auditLog': AuditLogNode,

  // ===== UTILITIES =====
  'debugger': DebuggerNode,
  'ai-analysis': AIAnalysisNode,
} satisfies NodeTypes;

// Export type for node type keys
export type NodeTypeKey = keyof typeof nodeTypes;

// Node categories for UI organization
export const nodeCategories = {
  triggers: ['eventTrigger', 'dateTime'] as NodeTypeKey[],
  logic: ['condition', 'filter', 'timeout', 'approval', 'rateLimit'] as NodeTypeKey[],
  actions: ['notification', 'webhook', 'auditLog'] as NodeTypeKey[],
  utilities: ['debugger', 'ai-analysis'] as NodeTypeKey[],
};

// Default data for each node type
export const nodeDefaultData: Record<NodeTypeKey, Record<string, unknown>> = {
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
    label: 'Timeout',
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
