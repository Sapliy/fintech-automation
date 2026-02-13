/**
 * Wallet Service
 *
 * Provides API calls for wallet operations.
 */
import apiClient from '@/lib/apiClient';

export interface Wallet {
    id: string;
    org_id: string;
    name: string;
    currency: string;
    balance: number;
    status: 'active' | 'frozen' | 'closed';
    created_at: string;
}

export interface WalletBalance {
    wallet_id: string;
    available: number;
    pending: number;
    currency: string;
}

const walletService = {
    /** List wallets */
    async list(): Promise<Wallet[]> {
        return apiClient.get<Wallet[]>('/v1/wallets');
    },

    /** Get wallet balance */
    async getBalance(walletId: string): Promise<WalletBalance> {
        return apiClient.get<WalletBalance>(`/v1/wallets/${walletId}/balance`);
    },

    /** Get a single wallet */
    async get(walletId: string): Promise<Wallet> {
        return apiClient.get<Wallet>(`/v1/wallets/${walletId}`);
    },
};

export default walletService;
