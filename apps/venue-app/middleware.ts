import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './auth';
import { UserType } from '@smartclub/types';
import { detectLocaleFromRequest, LOCALE_COOKIE_NAME, LOCALE_COOKIE_CONFIG } from '@smartclub/i18n';
import { logger } from '@smartclub/utils';

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method;

  logger.middleware('request', { method, pathname });

  // Backward compatibility: redirect old locale-prefixed URLs
  const localeMatch = pathname.match(/^\/(fa|en|ar)(\/.*)?$/);
  if (localeMatch) {
    const locale = localeMatch[1];
    const rest = localeMatch[2] || '/';
    logger.middleware('legacy locale redirect', { from: pathname, to: rest, locale });
    const response = NextResponse.redirect(new URL(rest, request.url));
    response.cookies.set(LOCALE_COOKIE_NAME, locale, {
      maxAge: LOCALE_COOKIE_CONFIG.maxAge,
      path: LOCALE_COOKIE_CONFIG.path,
      sameSite: LOCALE_COOKIE_CONFIG.sameSite,
    });
    return response;
  }

  const response = NextResponse.next();

  // Detect and set locale cookie if not present
  const existingLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  if (!existingLocale) {
    const detected = detectLocaleFromRequest(request);
    logger.i18n('locale auto-detected (no cookie)', { detected });
    response.cookies.set(LOCALE_COOKIE_NAME, detected, {
      maxAge: LOCALE_COOKIE_CONFIG.maxAge,
      path: LOCALE_COOKIE_CONFIG.path,
      sameSite: LOCALE_COOKIE_CONFIG.sameSite,
    });
  }

  // Auth middleware
  const session = await auth();

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

  if (isProtectedRoute) {
    logger.auth('protected route check', {
      pathname,
      hasSession: !!session,
      userType: session?.user?.userType ?? 'none',
      isVenueStaff,
    });
  }

  if (isProtectedRoute && (!session || !isVenueStaff)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    logger.auth('redirecting to login', { pathname, reason: !session ? 'no session' : 'not venue staff' });
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)', '/'],
};
