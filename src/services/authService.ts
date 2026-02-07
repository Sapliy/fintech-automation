const API_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8081';

interface LoginResponse {
    token: string;
}

interface RegisterResponse {
    id: string;
    email: string;
    created_at: string;
}

interface MessageResponse {
    message: string;
}

interface ErrorResponse {
    error: string;
}

class AuthService {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error((data as ErrorResponse).error || 'Request failed');
        }

        return data as T;
    }

    async login(email: string, password: string): Promise<LoginResponse> {
        return this.request<LoginResponse>('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async register(email: string, password: string): Promise<RegisterResponse> {
        return this.request<RegisterResponse>('/register', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async forgotPassword(email: string): Promise<MessageResponse> {
        return this.request<MessageResponse>('/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }

    async resetPassword(token: string, newPassword: string): Promise<MessageResponse> {
        return this.request<MessageResponse>('/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, new_password: newPassword }),
        });
    }

    async verifyEmail(token: string): Promise<MessageResponse> {
        return this.request<MessageResponse>('/verify-email', {
            method: 'POST',
            body: JSON.stringify({ token }),
        });
    }

    async resendVerification(email: string): Promise<MessageResponse> {
        return this.request<MessageResponse>('/resend-verification', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }
}

export const authService = new AuthService();
export default authService;
