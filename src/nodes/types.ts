import type { Node, BuiltInNode } from '@xyflow/react';

// ===== NODE TYPE IDENTIFIERS =====
export type NodeTypes =
  // Triggers
  | 'eventTrigger'
  | 'dateTime'
  // Logic
  | 'condition'
  | 'filter'
  | 'timeout'
  | 'approval'
  | 'rateLimit'
  // Actions
  | 'notification'
  | 'webhook'
  | 'auditLog'
  // Utilities
  | 'debugger'
  | 'ai-analysis';

// ===== COMMON TYPES =====
export type Operator = '>' | '<' | '>=' | '<=' | '==' | '!=' | '===' | '!==' | 'contains' | 'not_contains' | 'starts_with' | 'ends_with' | 'regex';
export type ValueType = 'number' | 'text';
export type ValuesSensor = string | number;

export type Condition = {
  [key in string]?: [Variable, string];
};

type Variable = {
  var: string;
};

interface NodeBase {
  width?: number;
  height?: number;
  [key: string]: unknown;
}

// ===== TRIGGER NODE TYPES =====
import { EventSource, EventType } from '../types/events';

export interface TEventTriggerData extends NodeBase {
  label: string;
  source: EventSource;
  eventType: EventType | null;
  lastEvent?: {
    id: string;
    payload: Record<string, unknown>;
    timestamp: string;
  };
  isActive: boolean;
}

export interface TDateTimeData extends NodeBase {
  label?: string;
  time: string;
  date: string;
  isActive: boolean;
  repeat: boolean;
  activeDays: number[];
  onTrigger?: () => void;
}

// ===== LOGIC NODE TYPES =====
export interface TConditionData<T> extends NodeBase {
  label: string;
  operator: Operator;
  value: T;
  if: Condition[];
  outputTruePath: T;
  outputFalsePath: T;
}

export interface TFilterData extends NodeBase {
  label: string;
  operator: Operator;
  filterValue: ValuesSensor;
  valueType: ValueType;
  value?: ValuesSensor;
}

export interface TTimeoutData extends NodeBase {
  label: string;
  duration: number;
  isActive: boolean;
  remainingTime: number;
  onTimeout: () => void;
}

export type ApproverRole = 'admin' | 'finance' | 'manager' | 'any';

export interface TApprovalData extends NodeBase {
  label: string;
  approverRole: ApproverRole;
  timeoutHours: number;
  message: string;
  status: 'pending' | 'approved' | 'rejected' | 'timeout' | 'idle';
  approvedBy?: string;
  approvedAt?: string;
}

export type TimeUnit = 'second' | 'minute' | 'hour' | 'day';

export interface TRateLimitData extends NodeBase {
  label: string;
  limit: number;
  timeWindow: number;
  timeUnit: TimeUnit;
  burstAllowance: number;
  currentCount: number;
  status: 'idle' | 'allowed' | 'blocked';
  resetAt?: string;
}

// ===== ACTION NODE TYPES =====
export type NotificationChannel = 'whatsapp' | 'email' | 'slack' | 'discord' | 'sms';

export interface TNotificationData extends NodeBase {
  label: string;
  channel: NotificationChannel;
  template: string;
  recipient: string;
  status: 'idle' | 'sending' | 'sent' | 'failed';
  lastSent?: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface TWebhookData extends NodeBase {
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

export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface TAuditLogData extends NodeBase {
  label: string;
  action: string;
  severity: AuditSeverity;
  description: string;
  metadata: Record<string, string>;
  status: 'idle' | 'logging' | 'logged' | 'failed';
  lastLogId?: string;
}

// ===== UTILITY NODE TYPES =====
export interface LogEntry extends NodeBase {
  message: string;
  level: 'info' | 'warning' | 'error';
  timestamp: string;
}

export interface TDebuggerData<T> extends NodeBase {
  label: string;
  isActive: boolean;
  logLevel: 'info' | 'warning' | 'error';
  autoScroll: boolean;
  logs: LogEntry[];
  value: T;
  onTrigger?: (data: unknown) => void;
}

export interface TAIAnalysisData extends NodeBase {
  label: string;
  value?: ValuesSensor;
  instruction: string;
  result: string;
  isProcessing: boolean;
  error?: string;
}

// ===== NODE TYPE DEFINITIONS =====
// Triggers
export type EventTriggerNode = Node<TEventTriggerData, 'eventTrigger'>;
export type DateTimeNode = Node<TDateTimeData, 'dateTime'>;

// Logic
export type ConditionNode = Node<TConditionData<ValuesSensor>, 'condition'>;
export type FilterNode = Node<TFilterData, 'filter'>;
export type TimeoutNode = Node<TTimeoutData, 'timeout'>;
export type ApprovalNode = Node<TApprovalData, 'approval'>;
export type RateLimitNode = Node<TRateLimitData, 'rateLimit'>;

// Actions
export type NotificationNode = Node<TNotificationData, 'notification'>;
export type WebhookNode = Node<TWebhookData, 'webhook'>;
export type AuditLogNode = Node<TAuditLogData, 'auditLog'>;

// Utilities
export type DebuggerNode = Node<TDebuggerData<ValuesSensor>, 'debugger'>;
export type AIAnalysisNode = Node<TAIAnalysisData, 'ai-analysis'>;

// ===== UNION TYPES =====
export type TriggerNode = EventTriggerNode | DateTimeNode;
export type LogicNode = ConditionNode | FilterNode | TimeoutNode | ApprovalNode | RateLimitNode;
export type ActionNode = NotificationNode | WebhookNode | AuditLogNode;
export type UtilityNode = DebuggerNode | AIAnalysisNode;

export type CustomNode = TriggerNode | LogicNode | ActionNode | UtilityNode;
export type AppNode = BuiltInNode | CustomNode;

// ===== GENERAL TYPES =====
export type Operations = 'text' | 'number';
