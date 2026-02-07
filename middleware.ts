import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
    '/',
    '/builder',
    '/flows',
    '/data',
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

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get auth token from cookie or localStorage via cookie
    // Note: In Next.js middleware, we can only access cookies, not localStorage
    // The auth-storage from zustand persist is in localStorage, so we need
    // to check via a cookie that we'll set on login
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

    // If user is not authenticated and trying to access protected route
    if (isProtectedRoute && !authToken) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If user is authenticated and trying to access auth routes (login, register)
    if (isAuthRoute && authToken) {
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
