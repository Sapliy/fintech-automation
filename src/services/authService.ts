import apiClient from '@/lib/apiClient';

interface User {
    id: string;
    email: string;
    name?: string;
    role?: string;
    email_verified?: boolean;
}

interface LoginResponse {
    token: string;
    user: User;
}

interface RegisterResponse {
    id: string;
    email: string;
    created_at: string;
}

interface MessageResponse {
    message: string;
}

class AuthService {
    // No constructor needed as apiClient handles base URL

    async login(email: string, password: string): Promise<LoginResponse> {
        return apiClient.post<LoginResponse>('/auth/login', { email, password });
    }

    async register(email: string, password: string): Promise<RegisterResponse> {
        return apiClient.post<RegisterResponse>('/auth/register', { email, password });
    }

    async forgotPassword(email: string): Promise<MessageResponse> {
        return apiClient.post<MessageResponse>('/auth/forgot-password', { email });
    }

    async resetPassword(token: string, newPassword: string): Promise<MessageResponse> {
        return apiClient.post<MessageResponse>('/auth/reset-password', { token, new_password: newPassword });
    }

    async verifyEmail(token: string): Promise<MessageResponse> {
        return apiClient.post<MessageResponse>('/auth/verify-email', { token });
    }

    async resendVerification(email: string): Promise<MessageResponse> {
        return apiClient.post<MessageResponse>('/auth/resend-verification', { email });
    }
}

export const authService = new AuthService();
export default authService;
