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

// Routes starting with these prefixes are public assets/endpoints
const publicPrefixes = [
    '/api',
    '/_next',
    '/favicon.ico',
    '/public',
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
        const now = Math.floor(Date.now() / 1000);
        return payload.exp > now + 10; // 10s buffer
    } catch {
        return false;
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if route is explicitly public or specific asset
    if (publicRoutes.some(route => pathname.startsWith(route)) ||
        publicPrefixes.some(prefix => pathname.startsWith(prefix))) {
        return NextResponse.next();
    }

    // Determine route type
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname === route || (route !== '/' && pathname.startsWith(route))
    );
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    // Get tokens from cookies
    const authToken = request.cookies.get('auth-token')?.value;
    const refreshToken = request.cookies.get('refreshtoken')?.value;

    const isAuthTokenValid = authToken && isTokenValid(authToken);

    // Scenario 1: User authenticated accessing Auth Route (Login/Register)
    if (isAuthRoute && isAuthTokenValid) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Scenario 2: Protected Route with Valid Token
    if (isProtectedRoute && isAuthTokenValid) {
        return NextResponse.next();
    }

    // Scenario 3: Protected Route (or Auth Check) with Expired/Missing Token
    if (isProtectedRoute || (isAuthRoute && !isAuthTokenValid && refreshToken)) {
        // Try to refresh
        if (refreshToken) {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
                // Try /v1/auth/refresh (Gateway) or /refresh (Direct)
                // Assuming Gateway usage: /v1/auth/refresh
                const refreshResponse = await fetch(`${apiUrl}/v1/auth/refresh`, {
                    method: 'POST',
                    headers: {
                        'Cookie': `refreshtoken=${refreshToken}`, // Forward cookie
                    },
                });

                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();
                    const newAccessToken = data.token;

                    if (newAccessToken) {
                        // Success!
                        // Determine where to go
                        // If we were on login page (isAuthRoute), redirect home.
                        // If we were on protected page, pass through (but we need to set cookie)

                        let response: NextResponse;
                        if (isAuthRoute) {
                            response = NextResponse.redirect(new URL('/', request.url));
                        } else {
                            response = NextResponse.next();
                        }

                        // Set response cookie manually since we did this server-side
                        // Note: Backend might setup Set-Cookie header, but we need to pass it to client.
                        // However, fetch doesn't automatically pass Set-Cookie to NextResponse.
                        // We must set it ourselves.

                        response.cookies.set({
                            name: 'auth-token',
                            value: newAccessToken,
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            path: '/',
                            sameSite: 'lax',
                            maxAge: 15 * 60, // 15 mins matching backend
                        });

                        return response;
                    }
                }
            } catch (error) {
                console.error("Middleware Refresh Failed", error);
            }
        }

        // If refresh failed or no refresh token
        if (isProtectedRoute) {
            const loginUrl = new URL('/auth/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            const response = NextResponse.redirect(loginUrl);

            // Clear any invalid cookies
            response.cookies.delete('auth-token');
            // We might keep refresh token to try again or let login handle it? 
            // Better clear if it failed verification server-side? 
            // Actually, kept secure. Backend 'ValidateRefreshToken' clears it using Set-Cookie if invalid.
            // But we can't easily see that here from fetch response headers without parsing.
            // Safe to let it be. Login page will just overwrite it on successful login.
            return response;
        }
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
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
