import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';
import { auth } from './auth';

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // Run i18n middleware first
  const intlResponse = intlMiddleware(request);

  // Then run auth middleware
  const session = await auth();
  const pathname = request.nextUrl.pathname;

  // Protected routes that require authentication
  const isProtectedRoute =
    pathname.includes('/my-bookings') ||
    pathname.includes('/profile') ||
    pathname.includes('/wallet') ||
    pathname.includes('/matches') ||
    pathname.includes('/chat') ||
    pathname.includes('/feed') ||
    pathname.includes('/leaderboard') ||
    pathname.includes('/notifications');

  if (isProtectedRoute && !session) {
    // Redirect to login
    const locale = pathname.split('/')[1]; // Extract locale (fa or en)
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return intlResponse;
}

export const config = {
  matcher: ['/', '/(fa|en)/:path*', '/((?!api|_next|.*\\..*).*)'],
};
