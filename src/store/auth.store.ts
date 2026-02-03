import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

// Project data
export interface Project {
    id: string;
    name: string;
    org_id: string;
}

// User data
export interface User {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
    role: UserRole;
}

// Auth state
interface AuthState {
    // Current user
    user: User | null;

    // Current organization
    organization: Organization | null;

    // Current project
    project: Project | null;

    // Current environment
    environment: Environment;

    // Auth token
    accessToken: string | null;

    // Loading state
    isLoading: boolean;

    // Error state
    error: string | null;

    // Actions
    setUser: (user: User | null) => void;
    setOrganization: (org: Organization | null) => void;
    setProject: (project: Project | null) => void;
    setEnvironment: (env: Environment) => void;
    setAccessToken: (token: string | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

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
            project: null,
            environment: 'test',
            accessToken: null,
            isLoading: false,
            error: null,

            setUser: (user) => set({ user }),
            setOrganization: (organization) => set({ organization }),
            setProject: (project) => set({ project }),
            setEnvironment: (environment) => set({ environment }),
            setAccessToken: (accessToken) => set({ accessToken }),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),

            login: async (email: string, password: string) => {
                const { setLoading, setError, setUser, setAccessToken } = get();

                setLoading(true);
                setError(null);

                try {
                    const authUrl = import.meta.env.VITE_AUTH_URL || 'http://localhost:8080/auth';

                    const response = await fetch(`${authUrl}/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    });

                    if (!response.ok) {
                        throw new Error('Invalid credentials');
                    }

                    const data = await response.json();

                    setAccessToken(data.access_token);
                    setUser({
                        id: data.user.id,
                        email: data.user.email,
                        name: data.user.name || email.split('@')[0],
                        role: data.user.role || 'developer',
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
                    project: null,
                    accessToken: null,
                    error: null,
                });
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
                project: state.project,
                environment: state.environment,
            }),
        }
    )
);

export { useAuthStore };
export type { AuthState };
