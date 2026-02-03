// Fintech Event Types - aligned with fintech-ecosystem
// These types define the structure of events from the fintech backend

export type EventSource = 'stripe' | 'wallet' | 'ledger' | 'system' | 'manual';

export type StripeEventType =
    | 'payment.succeeded'
    | 'payment.failed'
    | 'payment.pending'
    | 'refund.created'
    | 'refund.failed'
    | 'dispute.created'
    | 'charge.succeeded'
    | 'charge.failed';

export type WalletEventType =
    | 'wallet.created'
    | 'wallet.balance_changed'
    | 'wallet.low_balance'
    | 'wallet.credited'
    | 'wallet.debited'
    | 'wallet.frozen'
    | 'wallet.unfrozen';

export type LedgerEventType =
    | 'transaction.created'
    | 'transaction.posted'
    | 'transaction.failed'
    | 'entry.created'
    | 'account.created'
    | 'account.updated';

export type SystemEventType =
    | 'schedule.triggered'
    | 'manual.triggered'
    | 'automation.started'
    | 'automation.completed'
    | 'automation.failed';

export type EventType = StripeEventType | WalletEventType | LedgerEventType | SystemEventType;

// Main event interface - aligned with fintech-ecosystem event schema
export interface FintechEvent {
    id: string;
    type: EventType;
    source: EventSource;
    org_id: string;
    project_id?: string;
    environment: 'test' | 'live';
    payload: Record<string, unknown>;
    timestamp: string;
    metadata?: Record<string, string>;
}

// Event trigger configuration for nodes
export interface EventTriggerConfig {
    source: EventSource;
    eventTypes: EventType[];
    filters?: EventFilter[];
}

export interface EventFilter {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    value: string | number | boolean;
}

// Stripe-specific payload types
export interface StripePaymentPayload {
    payment_intent_id: string;
    amount: number;
    currency: string;
    status: string;
    customer_id?: string;
    metadata?: Record<string, string>;
}

// Wallet-specific payload types
export interface WalletPayload {
    wallet_id: string;
    balance: number;
    previous_balance?: number;
    currency: string;
    change_amount?: number;
    reason?: string;
}

// Ledger-specific payload types
export interface LedgerTransactionPayload {
    transaction_id: string;
    amount: number;
    currency: string;
    from_account_id: string;
    to_account_id: string;
    description?: string;
    status: 'pending' | 'posted' | 'failed';
}

// Event display helpers
export const EventSourceLabels: Record<EventSource, string> = {
    stripe: 'Stripe',
    wallet: 'Wallet',
    ledger: 'Ledger',
    system: 'System',
    manual: 'Manual',
};

export const EventSourceColors: Record<EventSource, { bg: string; text: string; border: string }> = {
    stripe: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
    wallet: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
    ledger: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
    system: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
    manual: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
};

// Event type groups for UI
export const EventTypesBySource: Record<EventSource, EventType[]> = {
    stripe: [
        'payment.succeeded',
        'payment.failed',
        'payment.pending',
        'refund.created',
        'refund.failed',
        'dispute.created',
        'charge.succeeded',
        'charge.failed',
    ],
    wallet: [
        'wallet.created',
        'wallet.balance_changed',
        'wallet.low_balance',
        'wallet.credited',
        'wallet.debited',
        'wallet.frozen',
        'wallet.unfrozen',
    ],
    ledger: [
        'transaction.created',
        'transaction.posted',
        'transaction.failed',
        'entry.created',
        'account.created',
        'account.updated',
    ],
    system: [
        'schedule.triggered',
        'manual.triggered',
        'automation.started',
        'automation.completed',
        'automation.failed',
    ],
    manual: [
        'manual.triggered',
    ],
};
