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
    /** List payments */
    async list(zoneId?: string, limit: number = 20): Promise<PaymentIntent[]> {
        const query = new URLSearchParams();
        if (zoneId) query.append('zone_id', zoneId);
        query.append('limit', limit.toString());
        return apiClient.get<PaymentIntent[]>(`/v1/payments/payment_intents?${query.toString()}`);
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
