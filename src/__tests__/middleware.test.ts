import { expect, test, describe, vi, beforeEach } from 'vitest';
import { middleware } from '../../middleware';
import { NextRequest } from 'next/server';

// Mock NextResponse
vi.mock('next/server', async () => {
    const actual = await vi.importActual('next/server');
    return {
        ...actual,
        NextResponse: {
            next: vi.fn(() => ({
                type: 'next',
                cookies: { set: vi.fn(), delete: vi.fn() }
            })),
            redirect: vi.fn((url) => ({
                type: 'redirect',
                url: url.toString(),
                cookies: { set: vi.fn(), delete: vi.fn() }
            })),
        },
    };
});

// Mock globally available fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Utility to create a mocked NextRequest
function createMockRequest(path: string, cookies: Record<string, string> = {}) {
    const url = new URL(`http://localhost:3000${path}`);
    return {
        nextUrl: { pathname: path },
        url: url.toString(),
        cookies: {
            get: (name: string) => cookies[name] ? { value: cookies[name] } : undefined
        }
    } as unknown as NextRequest;
}

// Generate a fake JWT
function generateToken(expOffset: number = 3600) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
        exp: Math.floor(Date.now() / 1000) + expOffset,
        sub: 'user-123'
    }));
    return `${header}.${payload}.signature`;
}

describe('Middleware', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockFetch.mockReset();
    });

    describe('Public Routes', () => {
        test('passes through for /auth/verify', async () => {
            const req = createMockRequest('/auth/verify');
            const res = await middleware(req);
            expect(res.type).toBe('next');
        });

        test('passes through for /_next assets', async () => {
            const req = createMockRequest('/_next/static/chunks/main.js');
            const res = await middleware(req);
            expect(res.type).toBe('next');
        });
    });

    describe('Protected Routes', () => {
        const protectedPath = '/builder';

        test('redirects to login if no token is present', async () => {
            const req = createMockRequest(protectedPath);
            const res = await middleware(req);

            expect(res.type).toBe('redirect');
            expect(res.url).toContain('/auth/login');
            expect(res.url).toContain('redirect=%2Fbuilder');
        });

        test('allows access with valid token', async () => {
            const token = generateToken(3600);
            const req = createMockRequest(protectedPath, { 'auth-token': token });
            const res = await middleware(req);

            expect(res.type).toBe('next');
        });

        test('attempts refresh if auth-token is expired but refresh-token exists', async () => {
            const expiredToken = generateToken(-3600);
            const refreshToken = 'valid-refresh-token';
            const req = createMockRequest(protectedPath, {
                'auth-token': expiredToken,
                'refreshtoken': refreshToken
            });

            // Mock successful refresh
            const newToken = generateToken(3600);
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ token: newToken })
            });

            const res = await middleware(req);

            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/v1/auth/refresh'),
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'Cookie': `refreshtoken=${refreshToken}`
                    })
                })
            );

            expect(res.type).toBe('next');
            expect(res.cookies.set).toHaveBeenCalledWith(expect.objectContaining({
                name: 'auth-token',
                value: newToken
            }));
        });

        test('redirects to login if refresh fails', async () => {
            const expiredToken = generateToken(-3600);
            const refreshToken = 'invalid-refresh-token';
            const req = createMockRequest(protectedPath, {
                'auth-token': expiredToken,
                'refreshtoken': refreshToken
            });

            // Mock failed refresh
            mockFetch.mockResolvedValueOnce({ ok: false });

            const res = await middleware(req);

            expect(res.type).toBe('redirect');
            expect(res.url).toContain('/auth/login');
        });
    });

    describe('Auth Routes', () => {
        test('redirects to home if already logged in (accessing /auth/login)', async () => {
            const token = generateToken(3600);
            const req = createMockRequest('/auth/login', { 'auth-token': token });
            const res = await middleware(req);

            expect(res.type).toBe('redirect');
            expect(res.url).toBe('http://localhost:3000/');
        });

        test('allows /auth/login if not logged in', async () => {
            const req = createMockRequest('/auth/login');
            const res = await middleware(req);

            expect(res.type).toBe('next');
        });
    });
});
