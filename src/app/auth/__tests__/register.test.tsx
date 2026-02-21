import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RegisterPage from '../register/page';
import authService from '@/services/authService';
import { useAuthStore } from '@/store/auth.store';

// Mock dependencies
vi.mock('@/services/authService', () => ({
    default: {
        register: vi.fn(),
    },
}));

vi.mock('@/store/auth.store', () => ({
    useAuthStore: vi.fn(),
}));

describe('Register Page', () => {
    const mockSetLoading = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuthStore as any).mockReturnValue({
            setLoading: mockSetLoading,
            isLoading: false,
        });
    });

    it('renders registration form', () => {
        render(<RegisterPage />);
        expect(screen.getByText('Create an account')).toBeInTheDocument();
        expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    });

    it('shows validation errors for missing data', async () => {
        render(<RegisterPage />);

        fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

        await waitFor(() => {
            expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
            expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
            expect(screen.getByText('You must accept the terms and conditions')).toBeInTheDocument();
        });
    });

    it('enforces password strength requirements', async () => {
        render(<RegisterPage />);

        fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'weakpassword' } });
        fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

        await waitFor(() => {
            expect(screen.getByText('Password must contain at least one uppercase letter')).toBeInTheDocument();
        });
    });

    it('validates password matching', async () => {
        render(<RegisterPage />);

        fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'StrongPass123!' } });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'StrongPass123!Mismatch' } });
        fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

        await waitFor(() => {
            expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
        });
    });

    it('submits successfully when valid', async () => {
        (authService.register as any).mockResolvedValue(true);

        render(<RegisterPage />);

        fireEvent.change(screen.getByLabelText(/Email address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'StrongPass123!' } });
        fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'StrongPass123!' } });

        // Accept terms
        const termsCheckbox = screen.getByLabelText(/I agree to the Terms of Service and Privacy Policy/i);
        fireEvent.click(termsCheckbox);

        fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

        await waitFor(() => {
            expect(authService.register).toHaveBeenCalledWith('test@example.com', 'StrongPass123!');
            expect(screen.getByText('Account Created!')).toBeInTheDocument();
            expect(screen.getByText('test@example.com')).toBeInTheDocument();
        });
    });
});
