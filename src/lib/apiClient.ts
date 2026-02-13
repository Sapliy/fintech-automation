/**
 * Centralized API Client for Sapliy Fintech Automation Studio
 *
 * All frontend API calls go through this client, which:
 * - Reads the gateway URL from NEXT_PUBLIC_API_URL
 * - Auto-attaches Authorization header from Zustand auth store
 * - Handles 401 (redirect to login) and 429 (rate limit) responses
 * - Provides typed helpers: get, post, put, del
 */
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// ----- Types -----

export interface ApiError {
    status: number;
    message: string;
    error?: string;
}

export class ApiRequestError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.name = 'ApiRequestError';
        this.status = status;
    }
}

// ----- Token accessor -----
// Lazy-import to avoid circular dependency with Zustand store modules

function getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = localStorage.getItem('fintech-auth-storage');
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed?.state?.accessToken ?? null;
    } catch {
        return null;
    }
}

// ----- Core request -----

async function request<T>(
    endpoint: string,
    options: RequestInit = {},
): Promise<T> {
    const token = getAccessToken();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        // Handle 401 — redirect to login
        if (response.status === 401) {
            if (typeof window !== 'undefined') {
                // Clear stored auth state
                localStorage.removeItem('fintech-auth-storage');
                document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                window.location.href = `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`;
            }
            throw new ApiRequestError(401, 'Unauthorized — session expired');
        }

        // Handle 429 — rate limit
        if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After') || '60';
            throw new ApiRequestError(429, `Rate limit exceeded. Retry after ${retryAfter}s`);
        }

        // Parse response
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const message = data?.error || data?.message || `Request failed (${response.status})`;
            throw new ApiRequestError(response.status, message);
        }

        return data as T;
    } catch (error) {
        // Network errors (e.g., server down)
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            toast.error('Network Error: Unable to reach the server. Please check your connection.');
        } else if (error instanceof ApiRequestError) {
            // 4xx/5xx errors thrown above
            toast.error(error.message || 'An unexpected error occurred');
        } else {
            console.error('Unexpected API Error:', error);
        }
        throw error;
    }
}

// ----- Public helpers -----

const apiClient = {
    get<T>(endpoint: string, options?: RequestInit): Promise<T> {
        return request<T>(endpoint, { ...options, method: 'GET' });
    },

    post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
        return request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    },

    put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
        return request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    },

    del<T>(endpoint: string, options?: RequestInit): Promise<T> {
        return request<T>(endpoint, { ...options, method: 'DELETE' });
    },

    /** The base URL for external use (e.g., WebSocket connections) */
    baseUrl: API_BASE_URL,
};

export default apiClient;
