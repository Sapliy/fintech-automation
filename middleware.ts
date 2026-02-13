import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
    '/',
    '/builder',
    '/flows',
    '/data',
    '/audit',
    '/packages',
    '/settings',
    '/templates',
    '/timeline',
    '/transactions',
];

// Routes that should redirect to home if already authenticated
const authRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
];

// Public routes that don't need any checks
const publicRoutes = [
    '/auth/verify',
    '/auth/reset-password',
];

/**
 * Decode a JWT and check if it's expired.
 * Returns true if the token is valid (not expired), false otherwise.
 */
function isTokenValid(token: string): boolean {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return false;
        const payload = JSON.parse(atob(parts[1]));
        if (!payload.exp) return true; // No expiry claim — treat as valid
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get auth token from cookie
    const authToken = request.cookies.get('auth-token')?.value;

    // Check if route is public (always allowed)
    if (publicRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Check if route is a protected route
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname === route || (route !== '/' && pathname.startsWith(route))
    );

    // Check if route is an auth route (login, register, etc.)
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    // If user is not authenticated or token is expired, redirect to login
    if (isProtectedRoute && (!authToken || !isTokenValid(authToken))) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);

        // Clear the expired cookie
        const response = NextResponse.redirect(loginUrl);
        if (authToken && !isTokenValid(authToken)) {
            response.cookies.delete('auth-token');
        }
        return response;
    }

    // If user is authenticated and trying to access auth routes (login, register)
    if (isAuthRoute && authToken && isTokenValid(authToken)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
    ],
};

