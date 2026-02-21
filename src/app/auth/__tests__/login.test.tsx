import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from '../login/page';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

// Mock dependencies
vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
    useSearchParams: () => ({ get: vi.fn().mockReturnValue('/') }),
}));

vi.mock('@/store/auth.store', () => ({
    useAuthStore: vi.fn(),
}));

// Mock the WebGL background so it doesn't crash JSDOM
vi.mock('@/components/auth/ShaderBackground', () => ({
    __esModule: true,
    default: () => <div data-testid="mock-shader-bg" />,
}));

describe('Login Page', () => {
    const mockLogin = vi.fn();
    const mockPush = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useRouter as any).mockReturnValue({ push: mockPush });
        (useAuthStore as any).mockReturnValue({
            login: mockLogin,
            isLoading: false,
            error: null,
            clearError: vi.fn(),
        });
    });

    it('renders login form correctly', () => {
        render(<LoginPage />);
        expect(screen.getByText('Welcome back')).toBeInTheDocument();
        expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    });

    it('shows validation errors for empty submission', async () => {
        render(<LoginPage />);

        const submitButton = screen.getByRole('button', { name: /Sign in to platform/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
            expect(screen.getByText('Password is required')).toBeInTheDocument();
        });

        expect(mockLogin).not.toHaveBeenCalled();
    });

    it('calls login api when validation passes', async () => {
        render(<LoginPage />);

        // Fill out form
        fireEvent.change(screen.getByLabelText(/Email address/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/Password/i), {
            target: { value: 'ValidPassword123!' },
        });

        const submitButton = screen.getByRole('button', { name: /Sign in to platform/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'ValidPassword123!');
        });
    });
});
