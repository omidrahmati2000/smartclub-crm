import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { auth } from './auth';
import { UserType } from '@smartclub/types';

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request);
  const session = await auth();
  const pathname = request.nextUrl.pathname;

  const isProtectedRoute =
    pathname.includes('/overview') ||
    pathname.includes('/calendar') ||
    pathname.includes('/bookings') ||
    pathname.includes('/assets') ||
    pathname.includes('/customers') ||
    pathname.includes('/staff') ||
    pathname.includes('/finance') ||
    pathname.includes('/pricing') ||
    pathname.includes('/reports') ||
    pathname.includes('/settings');

  const isVenueStaff = session?.user?.userType === UserType.VENUE_STAFF;

  if (isProtectedRoute && (!session || !isVenueStaff)) {
    const locale = pathname.split('/')[1] || 'fa';
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return intlResponse;
}

export const config = {
  matcher: ['/', '/(fa|en)/:path*'],
};
