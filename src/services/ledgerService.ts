/**
 * Ledger Service
 *
 * Provides API calls for ledger queries (entries, balances).
 */
import apiClient from '@/lib/apiClient';

export interface LedgerEntry {
    id: string;
    account_id: string;
    type: 'credit' | 'debit';
    amount: number;
    currency: string;
    description: string;
    reference_id?: string;
    created_at: string;
}

export interface AccountBalance {
    account_id: string;
    balance: number;
    currency: string;
    last_updated: string;
}

const ledgerService = {
    /** List ledger entries */
    async listEntries(): Promise<LedgerEntry[]> {
        return apiClient.get<LedgerEntry[]>('/v1/ledger/entries');
    },

    /** Get account balance */
    async getBalance(accountId: string): Promise<AccountBalance> {
        return apiClient.get<AccountBalance>(`/v1/ledger/accounts/${accountId}/balance`);
    },
};

export default ledgerService;
