import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import authService from '@/services/authService';

// User roles in the system
export type UserRole = 'admin' | 'finance' | 'developer' | 'viewer';

// Environment types
export type Environment = 'test' | 'live';

// Organization data
export interface Organization {
    id: string;
    name: string;
    slug: string;
}

// Zone data
export interface Zone {
    id: string;
    name: string;
    org_id: string;
    mode: Environment; // 'test' | 'live'
}

// User data - aligned with authService
export interface User {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
    role: UserRole;
    email_verified?: boolean;
}

// Auth state
interface AuthState {
    // Current user
    user: User | null;

    // Current organization
    organization: Organization | null;

    // Current zone
    zone: Zone | null;

    // Available zones
    zones: Zone[];

    // Current environment (synced with selected zone mode)
    environment: Environment;

    // Auth token
    accessToken: string | null;

    // Auth status
    isAuthenticated: boolean;

    // Loading state
    isLoading: boolean;

    // Error state
    error: string | null;

    // Actions
    setUser: (user: User | null) => void;
    setOrganization: (org: Organization | null) => void;
    setZone: (zone: Zone | null) => void;
    setZones: (zones: Zone[]) => void;
    setEnvironment: (env: Environment) => void;
    setAccessToken: (token: string | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;

    // Login action
    login: (email: string, password: string) => Promise<void>;

    // Logout action
    logout: () => void;

    // Check if user has role
    hasRole: (requiredRole: UserRole) => boolean;

    // Check if user can edit (admin, finance, developer)
    canEdit: () => boolean;

    // Check if user is admin
    isAdmin: () => boolean;
}

// Role hierarchy for permission checking
const roleHierarchy: Record<UserRole, number> = {
    admin: 4,
    finance: 3,
    developer: 2,
    viewer: 1,
};

const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            organization: null,
            zone: null,
            zones: [],
            environment: 'test',
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            setUser: (user) => set({ user, isAuthenticated: !!user }),
            setOrganization: (organization) => set({ organization }),
            setZone: (zone) => set({ zone, environment: zone?.mode || 'test' }),
            setZones: (zones) => set({ zones }),
            setEnvironment: (environment) => set({ environment }),
            setAccessToken: (accessToken) => set({ accessToken }),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),
            clearError: () => set({ error: null }),

            login: async (email: string, password: string) => {
                const { setLoading, setError, setUser, setAccessToken } = get();

                setLoading(true);
                setError(null);

                try {
                    const data = await authService.login(email, password);

                    setAccessToken(data.token);
                    setUser({
                        id: data.user.id,
                        email: data.user.email,
                        name: data.user.name || email.split('@')[0],
                        role: (data.user.role as UserRole) || 'developer',
                        email_verified: data.user.email_verified
                    });
                } catch (err) {
                    const message = err instanceof Error ? err.message : 'Login failed';
                    setError(message);
                    throw err;
                } finally {
                    setLoading(false);
                }
            },

            logout: () => {
                set({
                    user: null,
                    organization: null,
                    zone: null,
                    zones: [],
                    accessToken: null,
                    isAuthenticated: false,
                    error: null,
                });
                // Clear cookies for middleware
                document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            },

            hasRole: (requiredRole: UserRole) => {
                const { user } = get();
                if (!user) return false;
                return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
            },

            canEdit: () => {
                const { user } = get();
                if (!user) return false;
                return ['admin', 'finance', 'developer'].includes(user.role);
            },

            isAdmin: () => {
                const { user } = get();
                return user?.role === 'admin';
            },
        }),
        {
            name: 'fintech-auth-storage',
            partialize: (state) => ({
                accessToken: state.accessToken,
                user: state.user,
                organization: state.organization,
                zone: state.zone,
                zones: state.zones,
                environment: state.environment,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

export { useAuthStore };
