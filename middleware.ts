import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const accessToken = request.cookies.get('accessToken')?.value;
  const isAuthenticated = !!accessToken;

  const publicPaths = [
    '/signin',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/email-verify',
    '/api/auth',
    '/_next',
    '/favicon.ico',
  ];

  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  if (isAuthenticated && (pathname === '/signin' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
