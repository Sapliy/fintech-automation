/**
 * Payment Service
 *
 * Provides API calls for payment intent creation and management.
 */
import apiClient from '@/lib/apiClient';

export interface PaymentIntent {
    id: string;
    amount: number;
    currency: string;
    status: 'pending' | 'succeeded' | 'failed' | 'cancelled';
    zone_id: string;
    description?: string;
    payment_method_id?: string;
    created_at: string;
    updated_at: string;
}

export interface CreatePaymentIntentRequest {
    amount: number;
    currency: string;
    zone_id: string;
    description?: string;
}

const paymentService = {
    /** List payments */
    async list(): Promise<PaymentIntent[]> {
        return apiClient.get<PaymentIntent[]>('/v1/payments');
    },

    /** Create a payment intent */
    async createIntent(data: CreatePaymentIntentRequest): Promise<PaymentIntent> {
        return apiClient.post<PaymentIntent>('/v1/payments/intents', data);
    },

    /** Confirm a payment intent */
    async confirmIntent(id: string, paymentMethodId: string): Promise<PaymentIntent> {
        return apiClient.post<PaymentIntent>(`/v1/payments/intents/${id}/confirm`, {
            payment_method_id: paymentMethodId,
        });
    },

    /** Get a single payment by ID */
    async get(id: string): Promise<PaymentIntent> {
        return apiClient.get<PaymentIntent>(`/v1/payments/${id}`);
    },
};

export default paymentService;
